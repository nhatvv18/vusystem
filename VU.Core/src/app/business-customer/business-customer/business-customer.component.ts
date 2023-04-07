import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessCustomerApproveConst, BusinessCustomerConst, DistributionContractConst, FormNotificationConst, SearchConst, YesNoConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { BankServiceProxy } from '@shared/service-proxies/bank-service';
import { NationalityConst } from '@shared/nationality-list';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { Subject } from 'rxjs';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';

@Component({
  selector: 'app-business-customer',
  templateUrl: './business-customer.component.html',
  styleUrls: ['./business-customer.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class BusinessCustomerComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private _businessCustomerService: BusinessCustomerServiceProxy,
    private breadcrumbService: BreadcrumbService,
  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Khách hàng doanh nghiệp', routerLink: ['/customer/business-customer/business-customer'] },
    ]);
  }

  ref: DynamicDialogRef;

  modalDialog: boolean;
  deleteItemDialog: boolean = false;
  deleteItemsDialog: boolean = false;
  //
  rows: any[] = [];
  row: any;
  col: any;

  cols: any[];
  
  _selectedColumns: any[];
  listAction: any[] = [];

  BusinessCustomerApproveConst = BusinessCustomerApproveConst;
  BusinessCustomerConst = BusinessCustomerConst;
  DistributionContractConst = DistributionContractConst;
  YesNoConst = YesNoConst;
  NationalityConst = NationalityConst;

  isCheckSearch: any[] = [
    {
      name: 'Tất cả',
      code: ''
    },
    ...BusinessCustomerConst.isCheckConst
  ];

  subject = {
    keyword: new Subject(),
  };

  dataFilter = {
    fieldFilter: null,
    isCheck: null
  }

  businessCustomer: any = {
    "businessCustomerId": 0,
    "code": null,
    "name": null,
    "shortName": null,
    "address": null,
    "phone": null,
    "mobile": null,
    "email": null,
    "taxCode": null,
    "licenseDate": null,
    "licenseIssuer": null,
    "capital": null,
    "tradingAddress": null,
    "nation": null,
    "decisionNo": null,
    "decisionDate": null,
    "numberModified": null,
    "dateModified": null,
    "repName": null,
    "repPosition": null,
    "bankName": null,
    "bankBranchName": null,
    "bankAccNo": null,
    "backAccName": null,
    "status": null,
  }

  genListAction(data = []) {
    this.listAction = data.map(businessCustomerItem => {
      const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreKHDN_ThongTinKhachHang])) {
        actions.push({
          data: businessCustomerItem,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      if (businessCustomerItem.status == this.BusinessCustomerConst.status.HOAT_DONG 
        && (businessCustomerItem.isCheck == false || businessCustomerItem.isCheck == "N") 
        && this.isGranted([this.PermissionCoreConst.CoreKHDN_XacMinh])) {
        actions.push({
          data: businessCustomerItem,
          label: 'Phê duyệt (Epic)',
          icon: 'pi pi-check',
          command: ($event) => {
            this.check($event.item.data);
          }
        });
      }
      return actions;
    });
  }

  fieldErrors = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  submitted: boolean;
  expandedRows = {};
  statuses: any[];

  //
  page = new Page();
  offset = 0;

  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];

  ngOnInit(): void {
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });

    this.cols = [
      { field: 'taxCode', header: 'Mã số thuế', width: '8rem', isPin: true },
      { field: 'shortName', header: 'Tên viết tắt', width: '15rem', isPin: true },
      { field: 'name', header: 'Tên doanh nghiệp', width: '35rem', isResize: true },
      // { field: 'address', header: 'Địa chỉ', width: '40rem', position: 4, cutText: 'b-cut-text-40' },
      { field: 'email', header: 'Thư điện tử', width: '18rem', cutText: 'b-cut-text-18', },
      { field: 'isCheck', header: 'Kiểm tra', width: '10rem', class: 'justify-content-center' },
      // { field: 'phone', header: 'Số điện thoại', width: '12rem', position: 7, cutText: 'b-cut-text-12' },
      // { field: 'repName', header: 'Người đại diện', width: '12rem', position: 8, cutText: 'b-cut-text-12' },
      // { field: 'repPosition', header: 'Chức vụ', width: '10rem', position: 9, cutText: 'b-cut-text-10' },
      { field: 'columnResize', header: '', type:'hidden', width: '1rem', isResize: true }, 
    ];

    this.cols = this.cols.map((item, index) => {
      item.position = index + 1;
      return item;
    });

    // this._selectedColumns = this.cols;
    this._selectedColumns = this.getLocalStorage('busiCusCore') ?? this.cols;
  }
  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
  }
  setLocalStorage(data) {
    return localStorage.setItem('busiCusCore', JSON.stringify(data));
  }

  setColumn(col, _selectedColumns) {
    console.log('cols:', col);

    console.log('_selectedColumns', _selectedColumns);

    const ref = this.dialogService.open(
      FormSetDisplayColumnComponent,
      this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
    );

    ref.onClose.subscribe((dataCallBack) => {
      console.log('dataCallBack', dataCallBack);
      if (dataCallBack?.accept) {
        this._selectedColumns = dataCallBack.data.sort(function (a, b) {
          return a.position - b.position;
        });
        this.setLocalStorage(this._selectedColumns)
        console.log('Luu o local', this._selectedColumns);
      }
    });
  }

  showData(rows) {
    for (let row of rows) {
      row.shortName = row.shortName,
      row.name = row.name,
        row.email = row.email;
      row.phone = row.phone;
      row.address = row.address;
      row.repName = row.repName;
      row.repPosition = row.repPosition;
    };
    console.log('showData', rows);
  }

  // check(businessCustomer) {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có chắc chắn phê duyệt doanh nghiệp này không?',
  //     header: 'Thông báo',
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     icon: 'pi pi-check-circle',
  //     accept: () => {
  //       console.log("businessCustomer?.businessCustomerId", businessCustomer?.businessCustomerId);

  //       this._businessCustomerService.check({ id: businessCustomer?.businessCustomerId }).subscribe((response) => {
  //         if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
  //           this.setPage();
  //         }
  //       });
  //     },
  //     reject: () => {
  //     },
  //   });
  // }

  check(businessCustomer) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn có chắc chắn phê duyệt doanh nghiệp này không?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			if (dataCallBack?.accept) {
			this._businessCustomerService.check({ id: businessCustomer?.businessCustomerId }).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Phê duyệt doanh nghiệp thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	  }

  clickDropdown(row) {
    this.businessCustomer = { ...row };
    this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(row.status) && action.permission);
    console.log({ businessCustomer: row });
  }

  detail(businessCustomer) {
    this.router.navigate(['/customer/business-customer/business-customer/detail/' + this.cryptEncode(businessCustomer?.businessCustomerId)]);
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.businessCustomer)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  create() {
    this.businessCustomer = {};
    this.submitted = false;
    this.modalDialog = true;
  }

  deleteSelectedItems() {
    this.deleteItemsDialog = true;
  }

  delete(businessCustomer) {
    this.deleteItemDialog = true;
    this.businessCustomer = { ...businessCustomer }
  }

  confirmDelete() {
    this.deleteItemDialog = false;
    this._businessCustomerService.delete(this.businessCustomer.businessCustomerId).subscribe(
      (response) => {
        if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
          this.setPage({ page: this.page.pageNumber });
          this.businessCustomer = {};
        }
      }, () => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          detail: `Không xóa được khách hàng doanh nghiệp ${this.businessCustomer.name}`,
          life: 3000,
        });
      }
    );
  }

  confirm() {
    this.businessCustomer = true;
  }

  changeStatus() {
    this.setPage({ page: this.offset });
  }

  changeFieldFilter() {
    if (this.keyword?.trim()) {
      this.setPage();
    }
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    //
    this.isLoading = true;
    this._businessCustomerService.getAll(this.page, this.dataFilter).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data.totalItems;
        if (res.data?.items) {
          this.rows = res.data.items.map(row => {
            row.isCheck = (row.isCheck == this.YesNoConst.YES);
            return row;
          });
        }
        //
        if (res.data?.items?.length) {
          this.genListAction(this.rows);
          this.showData(this.rows);
        }

        console.log({ rows: res.data.items, totalItems: res.data.totalItems });
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  hideDialog() {
    this.modalDialog = false;
    this.submitted = false;
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  save() {
    this.submitted = true;
    //
    let body = this.formatCalendar(this.fieldDates, {...this.businessCustomer});
    console.log({ businessCustomer: this.businessCustomer });
    if (this.businessCustomer.approveId) {
      this._businessCustomerService.update(body).subscribe((response) => {
        if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.submitted = false;
          this.setPage({ page: this.page.pageNumber });
          this.hideDialog();
        } else {
          this.submitted = false;
        }
      }, () => {
        this.submitted = false;
      }
      );
    } else {
      this._businessCustomerService.create(body).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
            this.submitted = false;
            this.hideDialog();
            this.router.navigate(['/customer/business-customer/business-customer/detail', this.cryptEncode(response.data.businessCustomerTempId)]);
          } else {
            this.submitted = false;
          }
        }, () => {
          this.submitted = false;
        }
      );
    }
  }

  validForm(): boolean {

    const validRequired = this.businessCustomer?.code?.trim() && this.businessCustomer?.taxCode
      && this.businessCustomer?.licenseIssuer?.trim() && this.businessCustomer?.licenseDate
      && this.businessCustomer?.name?.trim() && this.businessCustomer?.shortName?.trim()
      && this.businessCustomer?.email?.trim() && this.businessCustomer?.address?.trim()
      && this.businessCustomer?.nation?.trim() && this.businessCustomer?.repName?.trim()
      && this.businessCustomer?.repPosition?.trim() && this.businessCustomer?.bankAccNo?.trim()
      && this.businessCustomer?.bankAccName?.trim() && this.businessCustomer?.bankName?.trim()
      && this.businessCustomer?.bankBranchName?.trim();
    return validRequired;
  }

  header(): string {
    return this.businessCustomer?.approveId > 0 ? 'Sửa khách hàng doanh nghiệp' : 'Thêm khách hàng doanh nghiệp';
  }
}
