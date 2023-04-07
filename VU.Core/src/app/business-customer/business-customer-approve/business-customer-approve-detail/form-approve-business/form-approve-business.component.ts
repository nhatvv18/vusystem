import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';
import { BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { FormShowChangeComponent } from '../form-show-change/form-show-change.component';

@Component({
  selector: 'app-form-approve-business',
  templateUrl: './form-approve-business.component.html',
  styleUrls: ['./form-approve-business.component.scss']
})
export class FormApproveBusinessComponent extends CrudComponentBase {

  constructor(
    public ref: DynamicDialogRef,
    private routeActive: ActivatedRoute,
    messageService: MessageService,
    injector: Injector,
    private dialogService: DialogService,
    public configDialog: DynamicDialogConfig,
    private _businessCustomerService: BusinessCustomerServiceProxy
  ) {
    super(injector, messageService)
    // this.approveId = +this.routeActive.snapshot.paramMap.get('id');
  }

  count = 0;
  countBankNull = 0;
  countBankTemp = 0;
  businessCustomer: any = {}
  businessCustomerTemp: any = {}
  isLoadingPage: boolean = false;
  soLan = 9;
  title: string;
  submitted = false;
  approveId: number;
  businessCustomerData: any = {}
  acceptStatus: boolean = true;
  businessCustomerBank: any[] = []
  businessCustomerBankTemp: any[] = [];
  check_approve: boolean;
  dataRequest = {
    id: 0,
    actionType: 0,
    userApproveId: 1,
    requestNote: null,
    summary: null,
  }

  ngOnInit(): void {

    this.approveId = this.configDialog.data.investorId;
    this.businessCustomerData = this.configDialog.data.businessCustomer;
    this.dataRequest.id = this.approveId;
    this.check_approve = true;
    this.dataRequest.summary = this.configDialog.data.summary;
    this.dataRequest.actionType = this.configDialog.data.actionType;
    this.showData();

  }

  showData() {
    this.isLoadingPage = true;

    this._businessCustomerService.showCheckUpdate(this.approveId).subscribe((res) => {
      
      if (this.handleResponseInterceptor(res, '')) {
        this.businessCustomer = res?.data?.businessCustomer;
        this.businessCustomerTemp = res?.data?.businessCustomerTemp;
        this.diffDataShow(this.businessCustomer, this.businessCustomerTemp)
        this.diffDataBank(res?.data?.businessCustomer?.businessCustomerBank ?? [], res?.data?.businessCustomerTemp?.businessCustomerBankTemps ?? []);
      };
    });
  }

  diffDataShow(businessCustomer, businessCustomerTemp) {
    for (var keyBusi in businessCustomer) {
      for (var keyBusiTemp in businessCustomerTemp) {
        console.log("Trường thay đổi : ", keyBusiTemp);
        if (keyBusiTemp == keyBusi && keyBusiTemp != 'businessCustomerId'
          && keyBusiTemp != 'businessCustomerBankTemps' && keyBusiTemp != 'businessCustomerBanks' &&
          keyBusiTemp != 'cifCode' && keyBusiTemp != 'isCheck' && keyBusiTemp != 'dateModified' && keyBusiTemp != 'status') {
          if (businessCustomer[keyBusiTemp] != businessCustomerTemp[keyBusiTemp]) {
            this.count++;
          }
        }
      }
    }
  }
  diffDataBank(businessCustomerBank, businessCustomerBankTemp) {
    console.log("businessCustomerBank", businessCustomerBank);
    console.log("businessCustomerBankTemp", businessCustomerBankTemp);
    
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

  showDiffChange() {
    const ref = this.dialogService.open(
      FormShowChangeComponent,
      {
        header: 'So sánh thay đổi',
        width: '68%',
        styleClass: 'p-dialog-custom filter-business-customer customModal',
        data: {
          investorId: this.approveId,
        }
      }
    );
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
    this.dataRequest.id = this.approveId;
    this.ref.close({ data: this.dataRequest, accept: this.acceptStatus, checkApprove:this.check_approve  });
  }

  validForm(): boolean {
    const validRequired = this.dataRequest?.requestNote?.trim();
    return validRequired;
  }

}