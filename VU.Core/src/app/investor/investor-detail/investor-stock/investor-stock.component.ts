import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { FormNotificationConst, InvestorConst, KeyFilter, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
@Component({
  selector: 'app-investor-stock',
  templateUrl: './investor-stock.component.html',
  styleUrls: ['./investor-stock.component.scss'],
	providers: [ConfirmationService, MessageService],
})
export class InvestorStockComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private confirmationService: ConfirmationService,
		private routeActive: ActivatedRoute,
		private router: Router,
		private _investorService: InvestorServiceProxy,
		private breadcrumbService: BreadcrumbService,
		private _bankService: BankServiceProxy,
		private _dialogService: DialogService,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
	}

	investorId: number;
	@Input() investorDetail: any = {};
	ref: DynamicDialogRef;

	modalDialog: boolean;
	deleteItemDialog: boolean = false;

	confirmRequestDialog: boolean = false;
	rows: any[] = [];
	list: any = {};

	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
	isTemp = InvestorConst.TEMP.YES;
	KeyFilter = KeyFilter;

	investorBank: any = {};
	banks: any = {};
	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];
	bankFullName: any = {};

	page = new Page();
	offset = 0;

	ngOnInit(): void {
		this.setPage();
		// this.getAllBank();
    console.log("this.investorDetail",this.investorDetail);
    
	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}

	genListAction(data = []) {
		this.actions = data.map((item) => {
			const action = [
				// {
				// 	data: item,
				// 	label: "Sửa",
				// 	icon: "pi pi-pencil",
				// 	statusActive: [1, 2, 3, 4],
				// 	permission: this.isGranted([]),
				// 	command: ($event) => {
				// 		this.edit($event.item.data);
				// 	},
				// },
			];

			if (((this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_TKCK_SetDefault]) && this.isTemp == 1) 
			|| (this.isGranted([this.PermissionCoreConst.CoreKHCN_TKCK_SetDefault]) && this.isTemp == InvestorConst.TEMP.NO))
			&& item.isDefault !== this.YesNoConst.YES) {
				action.push({
					data: item,
					label: "Chọn mặc định",
					icon: "pi pi-check",
					statusActive: [1, 2, 3, 4],
					// permission: this.isGranted([]),
					command: ($event) => {
						this.setDefaultBank($event.item.data);
					},
				});
			}
			return action;
		});
	}

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this._investorService.getAllStock(this.page, this.isTemp, this.investorId, this.investorDetail.investorGroupId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.rows = res.data;
					this.genListAction(this.rows);
					setTimeout(() => {
					}, 2000);
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	// getAllBank() {
	// 	this.page.keyword = this.keyword;
	// 	this.isLoading = true;
	// 	this._bankService.getAllBank(this.page).subscribe(
	// 		(res) => {
	// 			this.isLoading = false;
	// 			if (this.handleResponseInterceptor(res, "")) {
	// 				this.page.totalItems = res.data.totalItems;
	// 				this.banks = res.data.items;
	// 				this.banks = this.banks.map(bank => {
	// 					bank.labelName = bank.bankName + ' - ' + bank.fullBankName;
	// 					return bank;
	// 				});
	// 				console.log("this.bankFullName",this.banks);
					
	// 				console.log({ banks: res.data.items, totalItems: res.data.totalItems });

	// 			}
	// 		},
	// 		() => {
	// 			this.isLoading = false;
	// 		}
	// 	);
	// }

	clickDropdown(row) {
		this.investorBank = { ...row };
		console.log({ investorBank: row });
		this.actionsDisplay = this.actions.filter((action) => action.statusActive.includes(+row.status) && action.permission);
	}

	setFieldError() {
		for (const [key, value] of Object.entries(this.investorBank)) {
			this.fieldErrors[key] = false;
		}
		console.log({ filedError: this.fieldErrors });
	}

	header(): string {
		return !this.investorBank?.investorId ? "Thêm tài khoản chứng khoán" : "Sửa tài khoản chứng khoán";
	}

	createBank() {
		this.investorBank = {};
		this.submitted = false;
		this.modalDialog = true;
	}

	edit(row) {
		this.investorBank = {
			...row,
		};
		console.log({ investorBank: this.investorBank });
		this.modalDialog = true;
	}

	// setDefaultBank(row) {
	// 	this.confirmationService.confirm({
	// 		message: "Bạn muốn chọn tài khoản này thành mặc định?",
	// 		header: "Thiết lập tài khoản mặc định",
	// 		acceptLabel: "Đồng ý",
	// 		rejectLabel: "Hủy",
	// 		icon: "pi pi-question-circle",
	// 		accept: () => {
	// 			const body = {
	// 				// isTemp: this.isTemp == 1 ,
	// 				isTemp: this.isTemp == 1 ? true : false,
	// 				investorBankId: row?.id,
	// 			};
	// 			this._investorService.setDefaultBank(body).subscribe((res) => {
	// 				this.handleResponseInterceptor(res, "Set thành công");
	// 				this.setPage();
	// 			});
	// 		},
	// 		reject: () => {},
	// 	});
	// }

	setDefaultBank(row) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn muốn chọn tài khoản này thành mặc định?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				// isTemp: this.isTemp == 1 ,
				isTemp: this.isTemp == InvestorConst.TEMP.YES ? true : false,
				id: row?.id,
        investorId: this.investorDetail.investorId,
        isDefault: "Y",
			};
			if (dataCallBack?.accept) {
			this._investorService.setDefaultStock(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Chọn tài khoản này thành mặc định thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	  }

	detail() {
		this.isDetail = true;
		this.investorBank = {
			...this.investorBank,
		};

		console.log({ investorBank: this.investorBank });
		this.modalDialog = true;
	}

	// confirmDelete() {
	//   this.deleteItemDialog = false;
	//   this._investorService.delete(this.investorBank.investorBankId).subscribe(
	//     (response) => {
	//       if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
	//         this.setPage({ page: this.page.pageNumber });
	//         this.investorBank = {};
	//       }
	//     }, () => {
	//       this.messageService.add({
	//         severity: 'error',
	//         summary: '',
	//         detail: `Không xóa được hợp đồng phân phối!`,
	//         life: 3000,
	//       });
	//     }
	//   );
	// }

	// delete(row) {
	//   this.confirmationService.confirm({
	//     message: 'Bạn có chắc chắn xóa tài khoản ngân hàng này?',
	//     header: 'Xóa thanh toán',
	//     icon: 'pi pi-exclamation-triangle',
	//     accept: () => {
	//       this._investorService.delete(row.investorBankId).subscribe((response) => {
	//         if (this.handleResponseInterceptor(response, "")) {
	//           this.messageService.add({ severity: 'success', summary: '', detail: 'Xóa thành công', life: 1500 });
	//           this.setPage();
	//         }
	//       });
	//     },
	//     reject: () => {

	//     },
	//   });
	// }

	changeKeyword() {
		if (this.keyword === "") {
			this.setPage({ page: this.offset });
		}
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

		console.log({ investorBank: this.investorBank });
		console.log(this.investorBank.BankId);

		if (this.investorBank.id) {
			// this.investorBank.ownerAccount = this.removeVietnameseTones(this.investorBank?.ownerAccount)?.toUpperCase( );
			this._investorService.updateBank(this.investorBank).subscribe(
				(response) => {
					this.callTriggerFiledError(response, this.fieldErrors);
					if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
						this.submitted = false;
						this.setPage({ page: this.page.pageNumber });
						this.hideDialog();
					} else {
						this.callTriggerFiledError(response, this.fieldErrors);
						this.submitted = false;
					}
				},
				() => {
					this.submitted = false;
				}
			);
		} else {
			// this.investorBank.ownerAccount = this.removeVietnameseTones(this.investorBank?.ownerAccount)?.toUpperCase( );
			const body = {
				...this.investorBank,
				investorId: this.investorDetail.investorId,
				investorGroupId: this.investorDetail.investorGroupId,
				isTemp: this.isTemp == InvestorConst.TEMP.YES,
			};
			this._investorService.createStock(body).subscribe(
				(response) => {
					if (this.handleResponseInterceptor(response, "Thêm thành công")) {
						this.submitted = false;
						// this.setPage();
						this.hideDialog();
						if (this.isTemp === 0) {
							this.viewUpdate(response.data);
						} else {
							this.setPage();
						}
					} else {
						this.callTriggerFiledError(response, this.fieldErrors);
						this.submitted = false;
					}
				},
				() => {
					this.submitted = false;
				}
			);
		}
	}

	validForm(): boolean {
		const validRequired =  this.investorBank?.stockTradingAccount?.trim();

		return validRequired;
	}
}
