import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormNotificationConst, InvestorAccountConst, SaleStatusConst, SearchConst, UserConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserResetPasswordComponent } from '../investor/user-reset-password/user-reset-password.component';
import { BreadcrumbService } from '../layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from '../form-set-display-column/form-set-display-column.component';
import { FormNotificationComponent } from '../form-notification/form-notification.component';

@Component({
	selector: 'app-investor-list-account',
	templateUrl: './investor-list-account.component.html',
	styleUrls: ['./investor-list-account.component.scss']
})
export class InvestorListAccountComponent extends CrudComponentBase {

	constructor(injector: Injector,
		messageService: MessageService,
		private routeActive: ActivatedRoute,
		private _investorService: InvestorServiceProxy,
		private dialogService: DialogService,
		private breadcrumbService: BreadcrumbService,
		private confirmationService: ConfirmationService,
		private router: Router,

	) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: 'Trang chủ', routerLink: ['/home'] },
			{ label: 'Tài khoản người dùng' },
		]);
	}
	rows: any[] = [];
	row: any;
	col: any;

	cols: any[];
	_selectedColumns: any[];

	user: any = {
		userId: -1,
		userName: -1,
		displayName: "",
		email: "",
		phone: "",
		name: "",
		investorId: -1
	}

	submitted: boolean;

	statuses: any[];
	// listAction: any[] = [];
	listAction: any = [];
	listUsers: any = [];

	InvestorAccountConst = InvestorAccountConst;
	UserConst = UserConst;

	dataFilter = {
		field: null,
		status: null,
	}

	page = new Page();
	offset = 0;
	screenHeight: number = window.innerHeight;
	statusSearch: any[] = [
		{
			name: "Tất cả",
			code: ''

		},
		...InvestorAccountConst.status
	];
	ngOnInit() {
		this.setPage({ page: this.offset });
		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.keyword === "") {
				this.setPage({ page: this.offset });
			} else {
				this.setPage();
			}
		});

		this.cols = [
			{ field: 'cifCode', header: 'Mã KH', width: '8rem', cutText: 'b-cut-text-8', isPin: true },
			{ field: 'name', header: 'Tên khách hàng', width: '16rem', cutText: 'b-cut-text-16', isPin: true },
			{ field: 'userName', header: 'Tên đăng nhập', width: '10rem', cutText: 'b-cut-text-10' },
			{ field: 'phone', header: 'Số điện thoại', width: '10rem', cutText: 'b-cut-text-10' },
			{ field: 'idNo', header: 'Số giấy tờ', width: '12rem', cutText: 'b-cut-text-12' },
			{ field: 'email', header: 'Thư điện tử', width: '18rem', cutText: 'b-cut-text-18' },
			{ field: 'referralCodeSelf', header: 'Mã giới thiệu', width: '9rem', cutText: 'b-cut-text-9' },
			{ field: 'isCheck', header: 'Khách hàng', width: '8rem', cutText: 'b-cut-text-8', class: 'justify-content-center', type:'checkbox' },
			{ field: 'isSale', header: 'Tư vấn viên', width: '8rem', cutText: 'b-cut-text-8', class: 'justify-content-center', type:'checkbox' },
			{ field: 'columnResize', header: '', type:'hidden' },
		];
		this.cols = this.cols.map((item, index) => {
			item.position = index + 1;
			return item;
		})

		this._selectedColumns = this.getLocalStorage('investorListAccount') ?? this.cols;
	}

	setPage(pageInfo?: any) {
		console.log(pageInfo?.rows);

		this.page.pageNumber = pageInfo?.page ?? this.offset;
		if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
		this.page.keyword = this.keyword;
		this.isLoading = true;

		this._investorService.getAllInvestorAccount(this.page, this.dataFilter).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, '')) {
				this.page.totalItems = res.data.totalItems;
				this.rows = res.data.items;
				this.rows = res.data.items.map((item) => {
					item.isSale = item.checkSaleStatus == SaleStatusConst.TRUE ? true : false;
					return item;
				});
				this.genListAction(this.rows);
				this.showData(this.rows);
				console.log({ rows: res.data.items, totalItems: res.data.totalItems });
			}
		}, (err) => {
			this.isLoading = false;
			console.log('Error-------', err);
			
		});
		// fix show dropdown options bị ẩn dướ
	}

	getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('investorListAccount', JSON.stringify(data));
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
			row.cifCode = row.cifCode;
			row.name = row.name,
			row.userName = row.userName,
			row.email = row.email;
			row.phone = row.phone;
			row.idNo = this.hidePhone(row?.idNo, 3 , '******');
		};
		console.log('showData' + rows);
	}

	genListAction(data = []) {
		this.listAction = data.map((item) => {
			const status = item?.status;
			const actions = [];
			
			if (this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_ChiTiet])) {
				actions.push({
					data: item,
					label: "Thông tin chi tiết",
					icon: "pi pi-info-circle",
					command: ($event) => {
					this.detail($event.item.data);            
					},
				})
			}

			if (status == UserConst.STATUS.LOCK && this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_ChangeStatus])) {
				actions.push({
					data: item,
					label: "Khôi phục tài khoản",
					icon: "pi pi-refresh",
					command: ($event) => {
						this.changeStatusUser($event.item.data, UserConst.STATUS.ACTIVE);
					},
				});
			}

			if (status !== UserConst.STATUS.DEACTIVE && this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_ChangeStatus])) {
				actions.push({
					data: item,
					label: "Đóng tài khoản",
					icon: "pi pi-lock",
					command: ($event) => {
						this.changeStatusUser($event.item.data, UserConst.STATUS.DEACTIVE);
					},
				});
			}

			if (status === UserConst.STATUS.DEACTIVE && this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_ChangeStatus])) {
				actions.push({
					data: item,
					label: "Mở tài khoản",
					icon: "pi pi-check",
					command: ($event) => {
						this.changeStatusUser($event.item.data, UserConst.STATUS.ACTIVE);
					},
				});
			}

			if (this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_ResetMatKhau])) {
				actions.push({
				  data: item,
				  label: "Reset mật khẩu",
				  icon: "pi pi-undo",
				  command: ($event) => {
					this.resetPassword($event.item.data);
				  },
				})
			}

			if (this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_DatMaPin])) {
				actions.push({
				  data: item,
				  label: "Đặt lại mã PIN",
				  icon: "pi pi-refresh",
				  command: ($event) => {
					this.restPin($event.item.data);
				  },
				})
			}

			if (this.isGranted([this.PermissionCoreConst.CorePageInvestorAccount_XoaTaiKhoan])) {
			actions.push({
				data: item,
				label: "Xóa tài khoản",
				icon: "pi pi-trash",
				command: ($event) => {
				this.delete($event.item.data);            
				},
			})
			}

			return actions;
		});
	}

	detail(user) {
		this.router.navigate([`/customer/investor/${this.cryptEncode(user.investorId)}/temp/0`]);
	}

	delete(user) {
		const ref = this.dialogService.open(
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
			this._investorService.deleteInvestorAccount(user?.userId).subscribe((response) => {
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

	restPin(user) {
		const ref = this.dialogService.open(
				FormNotificationComponent,
				{
					header: "Đặt lại mã PIN",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn có chắc chắn đặt lại mã PIN khách hàng này không?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			if (dataCallBack?.accept) {
				const body = {
			  userId: user?.userId,
			};
			this._investorService.resetPinEpic(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Đặt lại mã PIN thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	  }

	resetPassword(user) {
		const ref = this.dialogService.open(
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
					investorId: user?.investorId,
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

	/**
	   * ĐỔI TRẠNG THÁI
	   * @param user
	   * @param status
	   */
	changeStatusUser(user, status) {
		this._investorService
			.changeUserStatus({
				userId: user.userId,
				investorId: user?.investorId,
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

	/**
 * RESET PIN
 * @param user
 */
	resetPinListAccount(user) {
		console.log("user reset", user);

		this.confirmationService.confirm({
			message: "Bạn có chắc chắn đặt lại mã Pin khách hàng này không?",
			header: "Đặt lại mã Pin",
			acceptLabel: "Đồng ý",
			rejectLabel: "Hủy",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				const body = {
					userId: user.userId,
				};
				this._investorService.resetPinListAccount(body).subscribe((response) => {
					if (
						this.handleResponseInterceptor(
							response,
							"Đặt lại mã Pin thành công"
						)
					) {
						this.setPage();
					}
				});
			},
			reject: () => { },
		});
	}

	/**
   * THAY ĐỔI MẬT KHẨU
   * @param user
   */
	resetPasswordListAccount(user) {
		this.confirmationService.confirm({
			message: "Bạn có chắc chắn đặt lại mật khẩu tài khoản này không?",
			header: "Đặt lại mật khẩu",
			acceptLabel: "Đồng ý",
			rejectLabel: "Hủy",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				const body = {
					userId: user.userId,
					investorId: user?.investorId,
				};
				this._investorService.resetPasswordListAccount(body).subscribe((response) => {
					if (
						this.handleResponseInterceptor(
							response,
							"Đặt lại mật khẩu thành công"
						)
					) {
						this.setPage();
					}
				});
			},
			reject: () => { },
		});
	}

	changeStatus() {
		this.setPage({ page: this.offset });
	}

	changeFieldFilter() {
		if (this.keyword) {
			this.setPage();
		}
	}
}
