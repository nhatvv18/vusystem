import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppConsts, BusinessCustomerConst, FormNotificationConst, SearchConst, YesNoConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { BankServiceProxy } from '@shared/service-proxies/bank-service';
import { ContractTemplateServiceProxy, DistributionContractFileServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { BusinessCustomerApproveServiceProxy, BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';

@Component({
  selector: 'app-business-customer-digital-sign',
  templateUrl: './business-customer-digital-sign.component.html',
  styleUrls: ['./business-customer-digital-sign.component.scss']
})
export class BusinessCustomerDigitalSignComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _contractTemplateService: ContractTemplateServiceProxy,
    private _businessCustomerService: BusinessCustomerServiceProxy,
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
  @Input() isEdit: any = {};
  @Output() updateDigitalSignDemo = new EventEmitter<any>();
  ref: DynamicDialogRef;

  modalDialog: boolean;
  deleteItemDialog: boolean = false;

  confirmRequestDialog: boolean = false;

  rows: any[] = [];
  banks: any = {};

  BusinessCustomerConst = BusinessCustomerConst;
  YesNoConst = YesNoConst;
  AppConsts = AppConsts;
  imageDefault = 'assets/layout/images/image-bg-default.jpg';

  businessCustomerInfo : any = {
    // 'key' : null,
    // 'secret' : null,
    // 'server' : null,
    // 'stampImageUrl' : null,
  }
  fieldErrors = {};
  submitted: boolean;

  isDetail = false;
  actionsDisplay: any[] = [];
  actions: any[] = [];

  page = new Page();
  offset = 0;



  ngOnInit() {
    this.setPage();
    
  }

  myUploaderStamp(event) {
    if (event?.files[0]) {
      this._contractTemplateService.uploadFileGetUrl(event?.files[0], "core").subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
          console.log("response", response);

          this.businessCustomerInfo.stampImageUrl = response?.data;
        }
      }, (err) => {
        console.log('err-----', err);
        this.messageError("Có sự cố khi upload!");
      }
      );
    }
  }

  changeValue() {
    console.log("businessCustomerInfo change ",this.businessCustomerInfo);
    this.updateDigitalSignDemo.emit(this.businessCustomerInfo);
    console.log("isEditnnnn", this.updateDigitalSignDemo);
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    this._businessCustomerService.getDigitalSign(this.businessCustomerId).subscribe((res) => {
      if (this.handleResponseInterceptor(res, '')) {
        this.businessCustomerInfo = res.data;
        console.log("businessCustomerInfo",this.businessCustomerInfo);
        this.updateDigitalSignDemo.emit(this.businessCustomerInfo);
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.businessCustomerInfo)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  changeKeyword() {
    if (this.keyword === '') {
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

}


