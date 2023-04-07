
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotVerifiedConst ,IssuerConst, DistributionContractConst, SearchConst, FormNotificationConst, UserConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NationalityConst } from '@shared/nationality-list';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { NotVerifiedServiceProxy } from '@shared/service-proxies/not-verified-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-not-verified',
  templateUrl: './not-verified.component.html',
  styleUrls: ['./not-verified.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class NotVerifiedComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    private dialogService: DialogService,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private _investorService: InvestorServiceProxy,
    private _notVerifiedService: NotVerifiedServiceProxy,
    
    messageService: MessageService,
    private breadcrumbService: BreadcrumbService) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Tài khoản chưa xác minh', routerLink: ['/app-account/not-verified'] },
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
  
  NotVerifiedConst = NotVerifiedConst;
  NationalityConst = NationalityConst;
  UserConst = UserConst;
  notVerified: boolean = true;
  partner: any = {
    
  }
  investorIdVerified: any;
  investorVerified: any;
  fieldErrors = {};
  //
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  submitted: boolean;
  expandedRows = {};
  statuses: any[] = [
    {
			name: "Tất cả",
			code: ''
		},
    {
      name: 'Hoạt động',
      code: 'A',
    },
    {
      name: 'Khởi tạo',
      code: 'T',
    },
    {
      name: 'Đang khóa',
      code: 'D',
    },
  ];
	listAction: any[] = [];
  tradingSearch: any[] = [
		{
			name: "Tất cả",
			tradingProviderId: ''

		},
	];

  dataFilter: any = {
    status: null
  }

  tradingProviderId: any;

  //
  page = new Page();
  offset = 0;
  isToast: boolean = true;

  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];

  ngOnInit(): void {
   
    this._notVerifiedService.getAllTradingProvider().subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        let resTrading = res?.data?.items;
        this.tradingSearch = [...this.tradingSearch,...resTrading]
        console.log( " this.tradingSearch",this.tradingSearch);
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      

    });
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
			{ field: 'phone', header: 'Số điện thoại', width: '10rem', position: 1, isPin: true },
			{ field: 'email', header: 'Email', width: '20rem', position: 2, isPin: true },
      { field: 'referralCode', header: 'Mã người giới thiệu', width: '12rem', position: 3 },
      { field: 'createdDate', header: 'Ngày khởi tạo', width: '12rem', position: 4, cutText: 'b-cut-text-15'  },
			{ field: 'createdBy', header: 'Người khởi tạo', width: '10rem', position: 5, cutText: 'b-cut-text-15' },
			{ field: 'source', header: 'Nguồn', width: '10rem', position: 6 },
			// { field: 'repPosition', header: 'Chức vụ', width: '15rem', position: 7, cutText: 'b-cut-text-15' },
      { field: 'columnResize', header: '', type:'hidden' },
		];

		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('notVerified') ?? this.cols;  
  }

  changeTrading() {
    this.setPage({ page: this.offset });
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
		return localStorage.setItem('notVerified', JSON.stringify(data));
	}

	setColumn(col, _selectedColumns) {

		const ref = this.dialogService.open(
			FormSetDisplayColumnComponent,
			this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
		);

		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				this._selectedColumns = dataCallBack.data.sort(function (a, b) {
					return a.position - b.position;
				});
				this.setLocalStorage(this._selectedColumns)
			}
		});
	}

	showData(rows) {
    // console.log('rows',rows);
    
		for (let row of rows) {
      console.log('rows',row)
      
			row.createdDate = this.formatDateTime(row?.createdDate),
      row.source = NotVerifiedConst.getSourceInfo(row?.source, 'name'),
      row.createdBy = this.hidePhone(row?.createdBy, 3 , '****')
		};

	}



  genListAction(data = []) {
		this.listAction = data.map(item => {
			const actions = [];
      
      // if (item.status == NotVerifiedConst.STATUS_ACTIVE ) {
      //   actions.push({
      //     data: item,
      //     label: 'Chỉnh sửa',
      //     icon: 'pi pi-trash',
      //     command: ($event) => {
      //       // this.delete($event.item.data);
      //     }
      //   })
      // }

      if (item.status == NotVerifiedConst.STATUS_LOCKED) {
        actions.push({
          data: item,
          label: 'Mở khóa',
          icon: 'pi pi-check',
          command: ($event) => {
            this.changeStatusUser($event.item.data, UserConst.STATUS.TEMPORARY);
          }
        })
      }

      if (item.status != NotVerifiedConst.STATUS_LOCKED) { 
        actions.push({
          data: item,
          label: 'Khóa tài khoản',
          icon: 'pi pi-lock',
          command: ($event) => {
            this.changeStatusUser($event.item.data, UserConst.STATUS.DEACTIVE);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.Core_TK_ChuaXacMinh_ResetMatKhau]) ) {
        actions.push({
          data: item,
          label: 'Reset mật khẩu',
          icon: 'pi pi-undo',
          command: ($event) => {
            this.resetPassword($event.item.data);
          }
        })
      }

      if ((item.step == NotVerifiedConst.STEP_BAT_DAU || item.step == NotVerifiedConst.STEP_DA_DANG_KY || item.step == NotVerifiedConst.STEP_DA_EKYC) && this.isGranted([this.PermissionCoreConst.Core_TK_ChuaXacMinh_XacMinh])) { 
        actions.push({
          data: item,
          label: 'Xác minh thông tin',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.openEkycModal($event.item.data);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.Core_TK_ChuaXacMinh_XoaTaiKhoan])) { //item.status == NotVerifiedConst.STATUS_ACTIVE || item.status == NotVerifiedConst.STATUS_ACTIVE
        actions.push({
          data: item,
          label: 'Xoá tài khoản',
          icon: 'pi pi-trash',
          command: ($event) => {
            this.delete($event.item.data);  
          }
        })
      }

			return actions;
		});
	}

  openEkycModal(investor) {
    console.log("openEkycModal",investor);
    
    this.investorIdVerified = investor.investorId;
    this.investorVerified = investor;
		this.submitted = false;
		this.modalDialog = true;
	}
  onSaveInvestor() {
		this.setPage(0);
	}

  changeStatusUser(user, status) {
    
    this._investorService
      .changeUserStatus({
        userId: user.userId,
        investorId:  user.investorId,
        status,
      })
      .subscribe(
        (res) => {
          if (this.handleResponseInterceptor(res, "Thực hiện thành công!")) {
            this.setPage();
          }
        },
        (err) => {
          this.messageError("Có sự cố khi thực hiện thao tác");
        }
      );
  }

  resetPassword(user) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Đặt lại mật khẩu",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn đặt lại mật khẩu tài khoản này không?",
					icon: FormNotificationConst.IMAGE_APPROVE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
    		const body = {
                userId: user.userId,
                investorId: user.investorId,
              };
        this._investorService.resetPassword(body).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Đặt lại mật khẩu thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
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
   
    // this.isToast = false;
    // const ref = this.dialogService.open(CreatePartnerComponent, {
    //   data: {
    //     inputData: null
    //   },
    //   header: "Thêm đối tác",
    //   width: '1000px',
    // }).onClose.subscribe(result => {
    //   this.setPage();
    // })
  }

  deleteSelectedItems() {
    this.deleteItemsDialog = true;
  }

  edit(partner) {
    console.log("partner",partner);
    
    // const ref = this.dialogService.open(CreatePartnerComponent, {
    //   data: {
    //     inputData: partner
    //   },
    //   header: "Sửa đối tác",
    //   width: '1000px',
    // }).onClose.subscribe(result => {
    //   this.setPage();
    // })
    
  }

  delete(user) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Xóa tài khoản",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa tài khoản này không?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
        this._notVerifiedService.delete(user?.userId).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Xóa tài khoản thành công"
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

    this._notVerifiedService.getAllNotVerified(this.page,this.tradingProviderId, this.dataFilter).subscribe((res) => {
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

}
