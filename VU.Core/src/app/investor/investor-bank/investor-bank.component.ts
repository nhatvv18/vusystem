import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ErrorBankConst, FormNotificationConst, InvestorConst, KeyFilter, MSBPrefixAccountConst, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
@Component({
	selector: "app-investor-bank",
	templateUrl: "./investor-bank.component.html",
	styleUrls: ["./investor-bank.component.scss"],
	providers: [ConfirmationService, MessageService],
})
export class InvestorBankComponent extends CrudComponentBase {
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
	MSBPrefixAccountConst = MSBPrefixAccountConst;
	isTemp = InvestorConst.TEMP.YES;
	KeyFilter = KeyFilter;
	ErrorBankConst = ErrorBankConst;

	investorBank: any = {};
	banks: any = {};
	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];
	bankFullName: any = {};
	isMSB: any;
	page = new Page();
	offset = 0;
	subject = {
		keyword: new Subject(),
	};

	ngOnInit(): void {
		this.isLoading = true;
		this.setPage();
		this.getAllBank();
		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.investorBank.bankId) {
				this.keyupBankAccount();
			} 
				
			
		});
	}

	changeBankId(value) {
		this.investorBank.bankAccount= ''
		this.investorBank.ownerAccount= ''
		console.log("value",value);
		this.investorBank.bankId = value;
	}

	keyupBankAccount() {
		
		console.log("this.investorBank",this.investorBank);
		this.investorBank.ownerAccount ='';
			this._investorService.getBankAccount(this.investorBank.bankId,this.investorBank.bankAccount ).subscribe(
				(res) => {
					this.isLoading = false;
					if(res.code === ErrorBankConst.LOI_KET_NOI_MSB|| res.code === ErrorBankConst.SO_TK_KHONG_TON_TAI) {
						this.messageService.add({
							severity: 'error',
							summary: '',
							detail: 'Không tìm thấy thông tin chủ tài khoản, vui lòng kiểm tra lại (FE)',
							life: 3000,
						});
						this.investorBank.ownerAccount = res?.data;
					} else
					if (this.handleResponseInterceptor(res)) {
						
						console.log("res",res);
						this.investorBank.ownerAccount = res?.data;
					}
				},
				() => {
					this.isLoading = false;
				}
			);
	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}

	genListAction(data = []) {
		this.actions = data.map((item) => {
			const action = [];
			if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_TKNH_Sua]) || this.isGranted([this.PermissionCoreConst.CoreKHCN_TKNH_Sua])){
				action.push(
					{
						data: item,
						label: "Sửa",
						icon: "pi pi-pencil",
						command: ($event) => {
							this.edit($event.item.data);
						},
					},
				)
			}

			if (((this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_TKNH_SetDefault]) && this.isTemp == InvestorConst.TEMP.YES) 
			|| (this.isGranted([this.PermissionCoreConst.CoreKHCN_TKNH_SetDefault]) && this.isTemp == InvestorConst.TEMP.NO))
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
			
			if ( ((this.isGranted([this.PermissionCoreConst.CoreKHCN_TKNH_Xoa])) || (this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_TKNH_Xoa])) )&& item.isDefault !== this.YesNoConst.YES) {
				action.push({
					data: item,
					label: "Xóa",
					icon: "pi pi-trash",
					command: ($event) => {
						this.delete($event.item.data);
					},
				});
			}

			return action;
		});
	}

	delete(bankInfo) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Xóa tài khoản ngân hàng",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn có chắc chắn xóa tài khoản ngân hàng này không?",
						icon: FormNotificationConst.IMAGE_CLOSE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log('!!! bankInfo: ', bankInfo);
			let isTemp = this.isTemp == InvestorConst.TEMP.NO ? false : true;
			let body = {
				investorBankAccId: bankInfo?.id,
				investorId: bankInfo?.investorId,
				investorGroupId: bankInfo?.investorGroupId,
				isTemp: isTemp
			}
			console.log('!!! body: ', body);
	
			
			if (dataCallBack?.accept) {
				this._investorService.deleteBankAccount(body).subscribe((response) => {
				if (this.handleResponseInterceptor(response, "Xóa tài khoản ngân hàng thành công")) {
					if (this.isTemp === InvestorConst.TEMP.NO) {
						this.viewUpdate(response.data);
					} else {
						this.setPage();
					}
				}
				});
			}
		});
	  }

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this._investorService.getAllBank(this.page, this.isTemp, this.investorId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.rows = res.data.items;
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

	getAllBank() {
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this._bankService.getAllBank(this.page).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.banks = res.data.items;
					this.banks = this.banks.map(bank => {
						bank.labelName = bank.bankName + ' - ' + bank.fullBankName;
						return bank;
					});
					console.log("this.bankFullName",this.banks);
					
					console.log({ banks: res.data.items, totalItems: res.data.totalItems });

				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

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
		return !this.investorBank?.id ? "Thêm tài khoản ngân hàng" : "Sửa tài khoản ngân hàng";
	}

	createBank() {
		this.investorBank = {};
		this.submitted = false;
		this.isLoading = true;
		this.modalDialog = true;
		
	}

	edit(row) {
		this.investorBank = {
			...row,
		};
		console.log({ investorBank: this.investorBank });
		this.modalDialog = true;
		this.isLoading = true;
	}

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
				investorBankId: row?.id,
			};
			if (dataCallBack?.accept) {
			this._investorService.setDefaultBank(body).subscribe((response) => {
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
		if (this.validForm()){
			if (this.investorBank.id) {
				this.investorBank.ownerAccount = this.removeVietnameseTones(this.investorBank?.ownerAccount)?.toUpperCase( );
				let body = {
					investorBankAccId : this.investorBank.id,
					investorId : this.investorBank.investorId,
					investorGroupId : this.investorBank.investorGroupId,
					bankAccount : this.investorBank.bankAccount,
					ownerAccount : this.investorBank.ownerAccount,
					isTemp : this.isTemp == InvestorConst.TEMP.YES
				}
				
				console.log('!!! body: ', body);
				
				this._investorService.updateBank(body).subscribe(
					(response) => {
						this.callTriggerFiledError(response, this.fieldErrors);
						if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
							this.submitted = false;
							this.hideDialog();
							if (this.isTemp === InvestorConst.TEMP.NO) {
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
			} else {
				this.investorBank.ownerAccount = this.removeVietnameseTones(this.investorBank?.ownerAccount)?.toUpperCase( );
				const body = {
					...this.investorBank,
					investorId: this.investorDetail.investorId,
					investorGroupId: this.investorDetail.investorGroupId,
					isTemp: this.isTemp == InvestorConst.TEMP.YES,
				};
				this._investorService.createBank(body).subscribe(
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
		} else {
			this.messageError('Vui lòng nhập đủ thông tin cho các trường có dấu (*)');
		}

	}



	validForm(): boolean {
		const validRequired = this.investorBank?.bankAccount?.trim() && this.investorBank?.ownerAccount?.trim();

		return validRequired;
	}
}
