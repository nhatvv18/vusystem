
import { Component, Injector, Input, OnInit } from '@angular/core';
import { SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { TradingProviderServiceProxy } from '@shared/service-proxies/setting-service';
import { debounceTime } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { Router } from "@angular/router"
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NationalityConst } from '@shared/nationality-list';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { FilterBusinessCustomerComponent } from 'src/app/components/filter-business-customer/filter-business-customer.component';
// import { FormSetDisplayColumnComponent } from 'src/app/form-general/form-set-display-column/form-set-display-column/form-set-display-column.component';
// import { FilterBusinessCustomerComponent } from 'src/app/components-general/filter-business-customer/filter-business-customer.component';

@Component({
  selector: 'app-trading-provider',
  templateUrl: './trading-provider.component.html',
  styleUrls: ['./trading-provider.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class TradingProviderComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private dialogService: DialogService,
    private tradingProviderService: TradingProviderServiceProxy,
    private breadcrumbService: BreadcrumbService) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Đại lý' },
    ]);
  }

  ref: DynamicDialogRef;
  modalDialog: boolean;

  deleteItemDialog: boolean = false;

  confirmRequestDialog: boolean = false;
  rows: any[] = [];

  NationalityConst = NationalityConst;

  businessCustomer: any;

  tradingProvider: any = {
    businessCustomerId: null,
    aliasName: null
  };

  businessCustomerId: number;

  listAction: any[] = [];
  submitted: boolean;

  statuses: any[];

  page = new Page();
  offset = 0;
  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];
  row: any;
  col: any;

  cols: any[];
  _selectedColumns: any[];

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
      { field: 'taxCode', header: 'Mã số thuế', width: '10rem', isPin: true },
			{ field: 'name', header: 'Tên đại lý', width : '30rem', isPin: true },
      { field: 'shortName', header: 'Tên viết tắt', width: '15rem' },
      { field: 'email', header: 'Email', width: '18rem', cutText: 'b-cut-text-18' },
      { field: 'phone', header: 'SĐT', width: '10rem', cutText: 'b-cut-text-10' },
      // { field: 'address', header: 'Địa chỉ', width: '40rem', cutText: 'b-cut-text-40' },
      // { field: 'repName', header: 'Người đại diện', width: '12rem', cutText: 'b-cut-text-12' },
      // { field: 'repPosition', header: 'Chức vụ', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'columnResize', header: '', type:'hidden' },
    ];

    // this._selectedColumns = this.cols;
    this._selectedColumns = this.getLocalStorage('tradingProvider') ?? this.cols;
  }

  getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key))
  }
  setLocalStorage(data) {
    return localStorage.setItem('tradingProvider', JSON.stringify(data));
  }

  setColumn(col, _selectedColumns) {
    console.log('cols:', col);

    console.log('123', _selectedColumns);

    const ref = this.dialogService.open(
      FormSetDisplayColumnComponent,
      this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
    );
    //
    ref.onClose.subscribe((dataCallBack) => {
      console.log('dataCallBack', dataCallBack);
      if (dataCallBack?.accept) {
        this._selectedColumns = dataCallBack.data.sort(function (a, b) {
          return a.position - b.position;
        });
        this.setLocalStorage(this._selectedColumns)
        console.log('Luu o local', this.getLocalStorage('tradingProvider'));
      }
    });
  }

  genListAction(data = []) {
    this.listAction = data.map(tradingProviderItem => {
      const actions = [
        // {
        //   data: tradingProviderItem,
        //   label: 'Xoá',
        //   icon: 'pi pi-trash',
        //   command: ($event) => {
        //     this.delete($event.item.data);
        //   }
        // },
      ];

      if(this.isGranted([this.PermissionCoreConst.CoreDaiLy_ThongTinChiTiet])) { 
        actions.push({
          data: tradingProviderItem,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      return actions;
    });
  }

  create() {
    this.tradingProvider = {};
    this.submitted = false;
    this.modalDialog = true;
  }

  detail(tradingProvider) {
    this.router.navigate(['/partner-manager/trading-provider/detail', this.cryptEncode(tradingProvider?.tradingProviderId)]);
  }

  confirmDelete() {
    this.deleteItemDialog = false;
    this.tradingProviderService.delete(this.tradingProvider.tradingProviderId).subscribe(
      (response) => {
        if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
          this.setPage({ page: this.page.pageNumber });
          this.tradingProvider = {};
        }
      }, () => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          detail: `Không xóa được tài khoản ${this.tradingProvider.name}`,
          life: 3000,
        });
      }
    );
  }

  filterBusinessCustomer() {
    const ref = this.dialogService.open(FilterBusinessCustomerComponent,
      {
        header: 'Tìm kiếm khách hàng doanh nghiệp',
        width: '1000px',
        styleClass: 'p-dialog-custom filter-business-customer customModal',
        contentStyle: { "overflow": "hidden", "padding-bottom": "50px" },
        style: { "overflow": "hidden", 'height': 'auto', 'top': '-16%'},
      });

    ref.onClose.subscribe((businessCustomerId) => {
      this.changeBusinessCustomer(businessCustomerId);
    });
  }

  changeBusinessCustomer(businessCustomerId) {
    this.isLoading = true;
    console.log("businessCustomerId",businessCustomerId);
    if (businessCustomerId != null) {
      this.tradingProviderService.get(businessCustomerId).subscribe((item) => {
          this.isLoading = false;
          if (this.handleResponseInterceptor(item, '')) {
              this.tradingProvider.businessCustomerId = item.data.businessCustomerId;
              this.businessCustomer = item.data;
              console.log({ itembusinessCustomerId: item.data });
          }
      }, (err) => {
          this.isLoading = false;
          console.log('Error-------', err);
          
      });

    }
    this.isLoading = false;
  }

  clickDropdown(row) {
    this.row = { ...row };
    this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(row.status) && action.permission);
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    this.tradingProviderService.getAllTradingProvider(this.page).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res?.data?.totalItems;
        this.rows = res?.data?.items;
        this.genListAction(this.rows);
        console.log({ rows: res.data.items, totalItems: res.data.totalItems });
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
    // fix show dropdown options bị ẩn dướ
  }

  delete(tradingProvider) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn xóa ${tradingProvider?.name} này?`,
      header: 'Cảnh báo',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy',
      accept: () => {
        this.tradingProviderService.delete(tradingProvider?.tradingProviderId).subscribe(
          (response) => {
            if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
              this.setPage({ page: this.page.pageNumber });
              this.tradingProvider = {};
            }
          }, () => {
            this.messageService.add({ severity: 'error', summary: '', detail: `Không xóa được ${tradingProvider?.name}`, life: 3000 });
          }
        );
      },
      reject: () => {

      },
    });
  }

  hideDialog() {
    this.modalDialog = false;
    this.submitted = false;
  }

  save() {
    this.submitted = true;
    this.tradingProviderService.create(this.tradingProvider).subscribe(
      (response) => {
        if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
          this.submitted = false;
          this.hideDialog();
          this.isLoadingPage = true;
          setTimeout(() => {
            this.isLoadingPage = false;
            this.router.navigate(['/partner-manager/trading-provider/detail', this.cryptEncode(response.data.tradingProviderId)]);
          }, 1000);
        }
        this.submitted = false;
      }, () => {
        this.submitted = false;
        this.messageService.add({ severity: 'error', summary: '', detail: 'Không lấy được dữ liệu', life: 2000 });
      }
    );
  }

  validForm(): boolean {
		const validRequired = this.businessCustomer?.code;
		 
		return validRequired;
	  }
}

