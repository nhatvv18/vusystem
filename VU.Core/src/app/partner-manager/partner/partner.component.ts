import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerConst ,IssuerConst, DistributionContractConst, SearchConst, FormNotificationConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NationalityConst } from '@shared/nationality-list';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { CreatePartnerComponent } from './create-partner/create-partner.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class PartnerComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    private dialogService: DialogService,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private partnerService: PartnerServiceProxy,
    messageService: MessageService,
    private breadcrumbService: BreadcrumbService) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Đối tác', routerLink: ['/partner-manager/partner'] },
    ]);
  }

  ref: DynamicDialogRef;

  modalDialog: boolean;
  deleteItemDialog: boolean = false;
  deleteItemsDialog: boolean = false;
  rows: any[] = [];
	row: any;
	col: any;

	cols: any[];
	_selectedColumns: any[];
  
  PartnerConst = PartnerConst;
  IssuerConst = IssuerConst;
  DistributionContractConst = DistributionContractConst;
  NationalityConst = NationalityConst;
  
  partner: any = {
    "partnerId": 0,
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
    // "bankName": null,
    // "bankBranchName": null,
    // "bankAccNo": null,
    // "backAccName": null,
    "status": null,
  }

  fieldErrors = {};
  //
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  submitted: boolean;
  expandedRows = {};
  statuses: any[];
	listAction: any[] = [];


  //
  page = new Page();
  offset = 0;
  isToast: boolean = true;

  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];

  ngOnInit(): void {
    this.fixFloatToast();
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });

    this.cols = [
			{ field: 'code', header: 'Mã DN', width: '8rem', position: 1, isPin: true },
			{ field: 'name', header: 'Tên doanh nghiệp', width: '30rem', position: 2, isPin: true },
      { field: 'address', header: 'Địa chỉ', width: '40rem', position: 3 },
      { field: 'email', header: 'Thư điện tử', width: '18rem', position: 4, cutText: 'b-cut-text-18'  },
			{ field: 'phone', header: 'Số điện thoại', width: '10rem', position: 5, cutText: 'b-cut-text-10' },
			{ field: 'repName', header: 'Người đại diện', width: '13.5rem', position: 6 },
			{ field: 'repPosition', header: 'Chức vụ', width: '15rem', position: 7, cutText: 'b-cut-text-15' },
      { field: 'columnResize', header: '', type:'hidden' },
		];

		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('partnerCore') ?? this.cols;  
  }

  fixFloatToast() {
    this.isToast = false;
    setTimeout(() => {
      this.isToast = true;
    }, 0);
  }

  getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('parterCore', JSON.stringify(data));
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
			row.email = row.email;
			row.phone = row.phone;
			row.address = row.address;
			row.repName = row.repName;
			row.repPosition = row.repPosition;
		};
		console.log('showData', rows);
	}

  genListAction(data = []) {
		this.listAction = data.map(partnerItem => {
			const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreDoiTac_ThongTinChiTiet])) {
        actions.push({
          data: partnerItem,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreDoiTac_Xoa])) {
        actions.push({
          data: partnerItem,
          label: 'Xoá',
          icon: 'pi pi-trash',
          command: ($event) => {
            this.delete($event.item.data);
          }
        })
      }

			return actions;
		});
	}
  clickDropdown(row) {
    this.partner = { ...row };
    this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(row.status) && action.permission);
    console.log({ partner: row });
  }

  detail(partner) {
    this.router.navigate(['/partner-manager/partner/detail/' + this.cryptEncode(partner?.partnerId)]);
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.partner)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  create() {
    // this.partner = {};
    // this.submitted = false;
    // this.modalDialog = true;
    this.isToast = false;
    const ref = this.dialogService.open(CreatePartnerComponent, {
      data: {
        inputData: null
      },
      header: "Thêm đối tác",
      width: '1000px',
    }).onClose.subscribe(result => {
      this.setPage();
    })
  }

  deleteSelectedItems() {
    this.deleteItemsDialog = true;
  }

  edit(partner) {
    console.log("partner",partner);
    
    const ref = this.dialogService.open(CreatePartnerComponent, {
      data: {
        inputData: partner
      },
      header: "Sửa đối tác",
      width: '1000px',
    }).onClose.subscribe(result => {
      this.setPage();
    })
    // this.partner = {
    //   ...partner,
    //   licenseDate: partner?.licenseDate ? new Date(partner?.licenseDate) : null,
    //   decisionDate: partner?.decisionDate ? new Date(partner?.decisionDate) : null,
    //   dateModified: partner?.dateModified ? new Date(partner?.dateModified) : null,
    // };
    // console.log({ partner: this.partner });
    // this.modalDialog = true;
  }

  // delete(partner) {
  //   // this.deleteItemDialog = true;
  //   this.partner = {...partner}
  //   this.confirmationService.confirm({
	// 		message: 'Bạn có chắc chắn xóa đối tác này?',
	// 		header: 'Xóa đối tác',
	// 		acceptLabel: "Đồng ý",
	// 		rejectLabel: "Hủy",
	// 		icon: 'pi pi-exclamation-triangle',
	// 		accept: () => {
	// 			this.partnerService.delete(this.partner.partnerId).subscribe((response) => {
	// 				if (this.handleResponseInterceptor(response, "Xóa thành công")) {
	// 					this.setPage();
	// 				}
	// 			});
	// 		},
	// 		reject: () => {

	// 		},
	// 	});
  // }

  delete(partner) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Thông báo",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa đối tác này?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
        this.partnerService.delete(partner.partnerId).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Xóa đối tác thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }

  setPage(pageInfo?: any) {
    this.setFieldError();
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    this.partnerService.getAll(this.page).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data.totalItems;
        this.rows = res.data.items;
        //
        if(res.data?.items?.length) { 
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
    let body = this.formatCalendar(this.fieldDates, {...this.partner});
    console.log({ partner: this.partner });
    if (this.partner.partnerId) {
      this.partnerService.update(body).subscribe((response) => {
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
      this.partnerService.create(body).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
            this.submitted = false;
            this.hideDialog();
            this.router.navigate(['/partner-manager/partner/detail', this.cryptEncode(response.data.partnerId)]);
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

    const validRequired = this.partner?.code?.trim() && this.partner?.taxCode
      && this.partner?.licenseIssuer?.trim() && this.partner?.licenseDate
      && this.partner?.name?.trim() && this.partner?.shortName?.trim()
      && this.partner?.email?.trim() && this.partner?.address?.trim()
      && this.partner?.nation?.trim() && this.partner?.repName?.trim()
      && this.partner?.repPosition?.trim();
    return validRequired;
  }

  header(): string {
    return this.partner?.partnerId > 0 ? 'Sửa đối tác' : 'Thêm đối tác';
  }
}
