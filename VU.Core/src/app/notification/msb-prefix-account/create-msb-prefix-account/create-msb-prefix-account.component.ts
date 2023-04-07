import { Component, Injector, Input, OnInit } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PageBondPolicyTemplate } from '@shared/model/pageBondPolicyTemplate';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MSBPrefixAccountServiceProxy, WhitelistIpServiceProxy } from '@shared/service-proxies/whitelist-ip-service';
import { MSBPrefixAccountConst } from '@shared/AppConsts';

@Component({
  selector: 'app-create-msb-prefix-account',
  templateUrl: './create-msb-prefix-account.component.html',
  styleUrls: ['./create-msb-prefix-account.component.scss'],
})
export class CreateMsbPrefixAccountComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public configDialog: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private _MBSPrefixService: MSBPrefixAccountServiceProxy,
  ) {
    super(injector, messageService);
  }


  prefix: any = {
    id: 0,
    tradingBankAccountId: null,
    tId: null,
    mId: null,
    accessCode: null,
  };

  prefixAccountId

  submitted: boolean;
  view: boolean;
  //

  offset = 0;
  listBanks: any[] = [];
  MSBPrefixAccountConst = MSBPrefixAccountConst;

  ngOnInit(): void {
    this.view = this.configDialog?.data?.view;
    this.prefix.id = this.configDialog?.data?.prefixAccountId;
    //
    this.isLoading = true;
    this._MBSPrefixService.getBankList({bankId: MSBPrefixAccountConst.ID_MSB_BANK}).subscribe((res) => {
      this.isLoading = false;
			if(this.handleResponseInterceptor(res, '')) {
				if(res?.data?.length) {
					this.listBanks = res.data.map(bank => {
						bank.labelName = bank?.bankAccNo + ' - ' + bank.bankName + ' - ' + bank.bankAccName;
						return bank;
					})
				}
			}
      //
      if(this.prefix.id) {
        this.isLoading = true;
        this._MBSPrefixService.findById(this.prefix.id).subscribe((res) => {
          this.isLoading = false;
          if(this.handleResponseInterceptor(res)) {
            this.prefix = res.data;
          }
        });
      }
		}, () => {
      this.isLoading = false;
			this.messageError('Không lấy được danh sách ngân hàng');
		});
  }

  save() {
    this.submitted = true;
    if (this.prefix.id) {
      this._MBSPrefixService.update(this.prefix).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
            this.ref.close(true);
          } else {
            this.submitted = false;
          }
        }, (err) => {
          console.log('err----', err);
          this.submitted = false;
        }
      );
    } else {
      this._MBSPrefixService.create(this.prefix).subscribe((response) => {
          if (this.handleResponseInterceptor(response,"Thêm thành công")) {
            this.ref.close(true);
          } else {
            this.submitted = false;
          }
        }, (err) => {
          console.log('err----', err);
          this.submitted = false;
        }
      );
    }
  }

  close() {
    this.ref.close();
  }

  getNameBank(businessCustomerBankAccId) {
    let bank = this.listBanks.find(b => b.businessCustomerBankAccId == businessCustomerBankAccId);
    return bank ? bank.bankAccName : null;
  }

  validForm(): boolean {
    const validRequired = this.prefix?.prefixMsb && this.prefix?.mId && this.prefix?.tId && this.prefix?.accessCode;
                        
    return validRequired;
  }

}

