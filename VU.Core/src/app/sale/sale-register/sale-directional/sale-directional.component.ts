import { Component, OnInit } from '@angular/core';
import { AppConsts, FormNotificationConst, SaleConst } from '@shared/AppConsts';
import { OBJECT_CONFIRMATION_DIALOG } from '@shared/base-object';
import { SaleService } from '@shared/service-proxies/sale-service';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

const { DEFAULT_IMAGE } = OBJECT_CONFIRMATION_DIALOG;

@Component({
  selector: 'app-sale-directional',
  templateUrl: './sale-directional.component.html',
  styleUrls: ['./sale-directional.component.scss']
})
export class SaleDirectionalComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig,
    private _saleService: SaleService,
  ) { 

  }

  default: any;
  submitted = false;


  showApproveBy: boolean = false;
  acceptStatus: boolean = true;

  AppConsts = AppConsts;
  DEFAULT_IMAGE = DEFAULT_IMAGE;

  data = {
    saleManagerId: null,
  }
  SaleConst = SaleConst;
  SaleTypes = SaleConst.types;
  tradingProviders: any;
  directionalBody: any = {
		"saleRegisterIds": [],
		"isCancel": null,
		"tradingProviders": [],
		"saleType": 0,
	};

  ngOnInit(): void {
    this.data.saleManagerId = this.configDialog.data.saleManagerId;
    
    this._saleService.tradingProviderByManagerSale(this.data.saleManagerId).subscribe((response) => {
        if(response?.data?.length) {
          this.tradingProviders = response.data.map(tradingProvider => {
            tradingProvider.labelName = tradingProvider.tradingProviderAliasName || tradingProvider.tradingProviderName;
            return tradingProvider;
          });
        }
        console.log("responseee",this.tradingProviders);
    });
  } 

  hideDialog() {
  }

  accept() {
    this.acceptStatus = true;
    this.onAccept();
    
    
  }

  cancel() {
    this.acceptStatus = false;
    this.onAccept();
  }

  onAccept() {
    this.ref.close({data: this.directionalBody,accept: this.acceptStatus});
  }

  validate(): boolean {
    return this.directionalBody?.tradingProviders?.trim() ;
  }
}

