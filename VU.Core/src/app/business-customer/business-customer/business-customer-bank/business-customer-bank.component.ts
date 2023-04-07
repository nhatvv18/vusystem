import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BusinessCustomerConst, ErrorBankConst, FormNotificationConst, KeyFilter, MSBPrefixAccountConst, SearchConst, YesNoConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { BankServiceProxy } from '@shared/service-proxies/bank-service';
import { ContractTemplateServiceProxy, DistributionContractFileServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { BusinessCustomerBankServiceProxy } from '@shared/service-proxies/business-customer-service';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';

@Component({
  selector: 'app-business-customer-bank',
  templateUrl: './business-customer-bank.component.html',
  styleUrls: ['./business-customer-bank.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class BusinessCustomerBankComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _contractTemplateService: ContractTemplateServiceProxy,
    private _businessCustomerBankService: BusinessCustomerBankServiceProxy,
    private _investorService: InvestorServiceProxy,
    private routeActive: ActivatedRoute,
    private router: Router,
    private _bankService: BankServiceProxy,
    private _dialogService: DialogService,
  ) {
    super(injector, messageService);

    this.businessCustomerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
  }

  businessCustomerId: number;
  @Input() businessCustomerDetail: any = {};

  ref: DynamicDialogRef;

  modalDialog: boolean;
  deleteItemDialog: boolean = false;

  confirmRequestDialog: boolean = false;
  rows: any[] = [];
  banks: any = {};
  isLoadingBank: boolean;
  BusinessCustomerConst = BusinessCustomerConst;
  MSBPrefixAccountConst = MSBPrefixAccountConst;
  YesNoConst = YesNoConst;
  ErrorBankConst = ErrorBankConst;
  KeyFilter = KeyFilter;

  businessCustomerBank: any = {
    "id": 0,
    "businessCustomerId": null,
    "bankId": null,
    "bankBranchName": null,
    "bankAccNo": null,
    "bankAccName": null,
    "isTemp": false,
  }

  itemTradingProviderInfo = {};
  fieldErrors = {};
  submitted: boolean;

  isDetail = false;
  actionsDisplay: any[] = [];
  actions: any[] = [];

  page = new Page();
  offset = 0;

  ngOnInit() {
    this.setPage();
    this.getAllBank();
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.businessCustomerBank.bankId) {
				this.keyupBankAccount();
			} 
				
			
		});
  }

  keyupBankAccount() {
    this.isLoadingBank = true;
		console.log("this.investorBank",this.businessCustomerBank);
		this.businessCustomerBank.ownerAccount ='';
			this._investorService.getBankAccount(this.businessCustomerBank.bankId,this.businessCustomerBank.bankAccNo ).subscribe(
				(res) => {
					this.isLoadingBank = false;
          if(res.code === ErrorBankConst.LOI_KET_NOI_MSB|| res.code === ErrorBankConst.SO_TK_KHONG_TON_TAI) {
						this.messageService.add({
							severity: 'error',
							summary: '',
							detail: 'Không tìm thấy thông tin chủ tài khoản, vui lòng kiểm tra lại (FE)',
							life: 3000,
						});
						this.businessCustomerBank.bankAccName = res?.data;
					} else
					if (this.handleResponseInterceptor(res)) {
						console.log("res",res);
						this.businessCustomerBank.bankAccName = res?.data;
					}
				},
				() => {
					this.isLoadingBank = false;
				}
			);
	}

  changeBankId(value) {
		this.businessCustomerBank.bankAccNo= ''
		this.businessCustomerBank.bankAccName= ''
		console.log("value",value);
    this.businessCustomerBank.bankId = value
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
          console.log({ banks: res.data.items, totalItems: res.data.totalItems });
        }
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  genListAction(data = []) {
    this.actions = data.map(item => {
      const action = [
        // {
        //   data: item,
        //   label: 'Sửa',
        //   icon: 'pi pi-pencil',
        //   statusActive: [1, 2, 3, 4],
        //   permission: this.isGranted([]),
        //   command: ($event) => {
        //     this.edit($event.item.data);
        //   }
        // },
      ];

      if (this.isGranted([this.PermissionCoreConst.CoreKHDN_TKNH_SetDefault]) && item.isDefault !== this.YesNoConst.YES) {
        action.push({
          data: item,
          label: 'Chọn mặc định',
          icon: 'pi pi-check',
          statusActive: [1, 2, 3, 4],
          permission: this.isGranted([]),
          command: ($event) => {
            this.setDefault($event.item.data);

          }
        });
      }
      // {
      //   data: item,
      //   label: 'Xóa',
      //   icon: 'pi pi-trash',
      //   statusActive: [1, 2, 3, 4],
      //   permission: this.isGranted([]),
      //   command: ($event) => {
      //     this.delete($event.item.data);
      //   }
      // }
      return action;
    });
  }


  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    //
    this._businessCustomerBankService.getAll(this.businessCustomerId, this.page).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data.totalItems;
        this.rows = res.data.items;
        this.genListAction(this.rows);
        setTimeout(() => {
          console.log('----', this.actions);
        }, 2000);
        console.log({ rowsPayment: res.data.items, totalItems: res.data.totalItems });
      }
    }, () => {
      this.isLoading = false;
    });
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.businessCustomerBank)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  header(): string {
    return !this.businessCustomerBank?.businessCustomerId ? 'Thêm tài khoản ngân hàng' : 'Sửa tài khoản ngân hàng';
  }

  create() {
    this.isLoadingBank = true;
    this.businessCustomerBank = {};
    this.submitted = false;
    this.modalDialog = true;
  }

  edit(row) {
    this.businessCustomerBank = {
      ...row,
    };
    console.log({ businessCustomerBank: this.businessCustomerBank });
    this.modalDialog = true;
  }

  setDefault(row) {
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
			if (dataCallBack?.accept) {
			this._businessCustomerBankService.setDefault(row).subscribe((response) => {
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
    this.businessCustomerBank = {
      ...this.businessCustomerBank,
    };

    console.log({ businessCustomerBank: this.businessCustomerBank });
    this.modalDialog = true;
  }

  confirmDelete() {
    this.deleteItemDialog = false;
    this._businessCustomerBankService.delete(this.businessCustomerBank.businessCustomerBankId).subscribe(
      (response) => {
        if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
          this.setPage({ page: this.page.pageNumber });
          this.businessCustomerBank = {};
        }
      }, () => {
        this.messageService.add({
          severity: 'error',
          summary: '',
          detail: `Không xóa được hợp đồng phân phối!`,
          life: 3000,
        });
      }
    );
  }

  delete(row) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn xóa tài khoản ngân hàng này?',
      header: 'Xóa thanh toán',
      acceptLabel: "Đồng ý",
			rejectLabel: "Hủy",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._businessCustomerBankService.delete(row.businessCustomerBankId).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "")) {
            this.messageService.add({ severity: 'success', summary: '', detail: 'Xóa thành công', life: 1500 });
            this.setPage();
          }
        });
      },
      reject: () => {

      },
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
    console.log({ businessCustomerBank: this.businessCustomerBank });
    this.businessCustomerBank.bankAccName = this.removeVietnameseTones(this.businessCustomerBank.bankAccName).toUpperCase();
    //
    if (this.businessCustomerBank.businessCustomerBankId) {
      this._businessCustomerBankService.update(this.businessCustomerBank).subscribe((response) => {
        //
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
      this.businessCustomerBank.businessCustomerId = this.businessCustomerDetail.businessCustomerId
      this._businessCustomerBankService.create(this.businessCustomerBank).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
            this.submitted = false;
            setTimeout(() => {
              this.router.navigate(["/customer/business-customer/business-customer-approve/detail/" + this.cryptEncode(response.data.businessCustomerTempId)]);
            }, 800);
            // this.setPage();
            this.hideDialog();
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
    const validRequired = this.businessCustomerBank?.bankAccNo?.trim()
      && this.businessCustomerBank?.bankAccName?.trim()
      && this.businessCustomerBank?.bankId;
    return validRequired;
  }

}
