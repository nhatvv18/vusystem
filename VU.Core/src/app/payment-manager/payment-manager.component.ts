import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentManagerConst, SaleStatusConst, SearchConst, UserConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserResetPasswordComponent } from '../investor/user-reset-password/user-reset-password.component';
import { BreadcrumbService } from '../layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from '../form-set-display-column/form-set-display-column.component';
import { PaymentManagerServiceProxy } from '@shared/service-proxies/payment-manager-service';

@Component({
  selector: 'app-payment-manager',
  templateUrl: './payment-manager.component.html',
  styleUrls: ['./payment-manager.component.scss']
})
export class PaymentManagerComponent extends CrudComponentBase {

	constructor(injector: Injector,
		messageService: MessageService,
		private routeActive: ActivatedRoute,
		private _investorService: InvestorServiceProxy,
		private dialogService: DialogService,
		private breadcrumbService: BreadcrumbService,
		private confirmationService: ConfirmationService,
    private _paymentManagerService: PaymentManagerServiceProxy,

	) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: 'Trang chủ', routerLink: ['/home'] },
			{ label: 'Quản lý giao dịch' },
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

	PaymentManagerConst = PaymentManagerConst;
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
		...PaymentManagerConst.status
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
			{ field: 'ftType', header: 'Loại giao dịch', width: '10rem', cutText: 'b-cut-text-10', isPin: true },
			{ field: 'amount', header: 'Giá trị', width: '16rem', cutText: 'b-cut-text-16', isPin: true },
			{ field: 'balance', header: 'Số dư sau giao dịch', width: '15rem', cutText: 'b-cut-text-15' },
			{ field: 'senderBankId', header: 'Mã ngân hàng gửi', width: '12rem', cutText: 'b-cut-text-12' },
			{ field: 'description', header: 'Nội dung', width: '12rem', cutText: 'b-cut-text-12' },
			{ field: 'tranId', header: 'Mã Giao dịch ở ngân hàng (FT)', width: '20rem', cutText: 'b-cut-text-20' },
			{ field: 'tranDate', header: 'Ngày giao dịch', width: '12rem', cutText: 'b-cut-text-12', class: 'justify-content-center' },
			{ field: 'currency', header: 'Tiền tệ', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'tranStatus', header: 'Trạng thái giao dịch', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'conAmount', header: 'Giá trị qui ra việt nam đồng', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'numberOfBeneficiary', header: 'Số thẻ nhận giao dịch', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'account', header: 'Số tài khoản thụ hưởng', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'createdDate', header: 'Ngày tạo', width: '12rem', cutText: 'b-cut-text-12' },
      { field: 'requestIP', header: 'Ip request', width: '12rem', cutText: 'b-cut-text-12' },
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

		this._paymentManagerService.getAll(this.page, this.dataFilter).subscribe((res) => {
			this.isLoading = false;
      
      
				this.page.totalItems = res.totalItems;
        console.log("resssssssss",this.page.totalItems);
				this.rows = res.items;
        console.log("1112312",this.rows);
				
				// this.genListAction(this.rows);
			
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

	// showData(rows) {
	// 	for (let row of rows) {
	// 		row.cifCode = row.cifCode;
	// 		row.displayName = row.displayName,
	// 			row.userName = row.userName,
	// 			row.email = row.email;
	// 		row.phone = row.phone;
	// 	};
	// 	console.log('showData' + rows);
	// }

	// genListAction(data = []) {
	// 	this.listAction = data.map((item) => {
	// 		const status = item?.status;
	// 		const actions = [];

	// 		if (status !== UserConst.STATUS.DEACTIVE) {
	// 			actions.push({
	// 				data: item,
	// 				label: "Đóng tài khoản",
	// 				icon: "pi pi-lock",
	// 				command: ($event) => {
	// 					this.changeStatusUser($event.item.data, UserConst.STATUS.DEACTIVE);
	// 				},
	// 			});
	// 		}

	// 		if (status === UserConst.STATUS.DEACTIVE) {
	// 			actions.push({
	// 				data: item,
	// 				label: "Mở tài khoản",
	// 				icon: "pi pi-check",
	// 				command: ($event) => {
	// 					this.changeStatusUser($event.item.data, UserConst.STATUS.ACTIVE);
	// 				},
	// 			});
	// 		}

	// 		return actions;
	// 	});
	// }

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

