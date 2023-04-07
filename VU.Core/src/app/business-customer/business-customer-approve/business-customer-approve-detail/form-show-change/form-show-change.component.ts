import { ThisReceiver } from '@angular/compiler';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudComponentBase } from '@shared/crud-component-base';
import { BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-show-change',
  templateUrl: './form-show-change.component.html',
  styleUrls: ['./form-show-change.component.scss']
})
export class FormShowChangeComponent extends CrudComponentBase {

  constructor(
    public ref: DynamicDialogRef,
    private routeActive: ActivatedRoute,
    messageService: MessageService,
    injector: Injector,
    public configDialog: DynamicDialogConfig,
    private _businessCustomerService: BusinessCustomerServiceProxy
  ) {
    super(injector, messageService)
  }

  countChangeOfAll = 0;
  countBankNull = 0;
  countBankTemp = 0;
  businessCustomer: any = {}
  businessCustomerTemp: any = {}
  userRequest: any = {}
  data: any = {};
  title: string;
  submitted = false;
  approveId: number;
  acceptStatus: boolean = true;
  isLoadingPage: boolean = false;
  rows: any[] = [];
  dataRequest = {
    id: 0,
    actionType: 0,
    userApproveId: 1,
    requestNote: null,
    summary: null,
  }
  businessCustomerData: any = {}
  businessCustomerTempData: any = {}
  businessCustomerBank: any[] = []
  businessCustomerBankTemp: any[] = []

  ngOnInit(): void {
    this.approveId = this.configDialog.data.investorId;
    this.showData();
    this.isLoadingPage = false;
  }

  showData() {
    this.isLoadingPage = true;
    this._businessCustomerService.showCheckUpdate(this.approveId).subscribe((res) => {

      if (this.handleResponseInterceptor(res, '')) {
        console.log("thay đổi sau khi update", res);
        this.businessCustomer = res?.data?.businessCustomer;
        this.businessCustomerTemp = res?.data?.businessCustomerTemp;
        this.userRequest = res?.data?.userRequest;
        this.data = res?.data;
        this.diffDataShow(this.businessCustomer, this.businessCustomerTemp);
        this.diffDataBank(res?.data?.businessCustomer?.businessCustomerBanks, res?.data?.businessCustomerTemp?.businessCustomerBankTemps);
      };
    });
  }

  diffDataBank(businessCustomerBank, businessCustomerBankTemp) {
    businessCustomerBank.forEach((element1) => {
      businessCustomerBankTemp.forEach((element2) => {
        Object.keys(element1).forEach((key) => {
          if ((key == 'bankAccName' || key == 'bankAccNo' ||
            key == 'bankName' || key == 'bankBranchName' || key == 'bankId')
            && element1[key] == element2[key]) {
            delete element1[key];
            delete element2[key];
            this.businessCustomerBankTemp = businessCustomerBankTemp;
          }
        })
      })
    })
    businessCustomerBankTemp.forEach((item) => {
      this.countBankTemp++
      if (item.bankAccName == null && item.bankAccNo == null
        && item.bankName == null && item.bankBranchName == null) {
        this.countBankNull++;
      }
    })
  }

  diffDataShow(businessCustomer, businessCustomerTemp) {
    for (var keyBusi in businessCustomer) {
      for (var keyBusiTemp in businessCustomerTemp) {
        if (keyBusiTemp == keyBusi && keyBusiTemp != 'businessCustomerId'
          && keyBusiTemp != 'businessCustomerBankTemps' && keyBusiTemp != 'businessCustomerBanks' &&
          keyBusiTemp != 'cifCode' && keyBusiTemp != 'isCheck' && keyBusiTemp != 'dateModified') {
          if (businessCustomer[keyBusiTemp] != businessCustomerTemp[keyBusiTemp]) {
            this.countChangeOfAll++;
          }
          if (businessCustomer[keyBusiTemp] === businessCustomerTemp[keyBusiTemp]) {
            delete businessCustomerTemp[keyBusiTemp];
            delete businessCustomer[keyBusiTemp];
            this.businessCustomerData = businessCustomer;
            this.businessCustomerTempData = businessCustomerTemp;
          }
        }
      }
    }
  }

  onAccept() {
    this.dataRequest.id = this.approveId;
    this.ref.close({ data: this.dataRequest, accept: this.acceptStatus });
  }
}
