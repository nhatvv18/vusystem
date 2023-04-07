


import { debounceTime } from 'rxjs/operators';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { Component, Injector, OnInit } from '@angular/core';
import { OrderService } from '@shared/service-proxies/shared-data-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrderServiceProxy } from '@shared/service-proxies/trading-contract-service';
import * as moment from 'moment';
import { InvestorConst, SearchConst } from '@shared/AppConsts';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-investor-diff',
  templateUrl: './investor-diff.component.html',
  styleUrls: ['./investor-diff.component.scss']
})

export class InvestorDiffComponent extends CrudComponentBase {

  customerInformation: any = {};

  activeIndex = 0;

  keyword: string;

  page = new Page;

  customers: any[] = [];
  businiessCustomers: any[] = [];
  sales: any[] = [];

  listBank: any[] = [];

  diffDetail: any = {};
  diff
  investorIdTemp: number;
  diffListIdentification: any = [];
  diffListBank: any = [];
  diffListBankDelete: any = [];
  diffListBankUpdate: any = [];
  diffListStock: any = [];
  diffListContactAddress: any = [];
  diffDefaultIdentification: any = {};
  viewImage = {
    url: "",
    modalVisible: false,
  };
  requestDate: any;
  approveDate: any;
  statusCheck: any;
  isPhoneEmail: boolean;
  isEmail: boolean;
  isPhone: boolean;
  getApprove: any;
  isDiffEmailPhone: any;

  InvestorConst = InvestorConst;
  

  constructor(
    injector: Injector,
    messageService: MessageService,
    public orderService: OrderService,
    private router: Router,
    private _orderService: OrderServiceProxy,
    public _investorService: InvestorServiceProxy,
    public configDialog: DynamicDialogConfig,
  ) {
    super(injector, messageService);
  }

  ngOnInit() {
    this.investorIdTemp = this.configDialog?.data?.investorIdTemp;
    this.requestDate = this.configDialog?.data?.requestDate;
    this.approveDate = this.configDialog?.data?.approveDate || this.configDialog?.data?.cancelDate;
    this.statusCheck = this.configDialog?.data?.statusCheck;
    this.isPhoneEmail = this.configDialog?.data?.isPhoneEmail;
    this.isEmail =  this.configDialog?.data?.isEmail;
    this.isPhone =  this.configDialog?.data?.isPhone;
    this.getApprove =  this.configDialog?.data?.getApprove;
    console.log("this.getAppvove", this.getApprove);

    this.getDiff(this.investorIdTemp);
  }

  getDiff(investor) {
    console.log("investor diff", investor);

    this.isLoading = true;
    this._investorService.getDiff(this.investorIdTemp).subscribe(
      (res) => {
        if (this.handleResponseInterceptor(res, "")) {
         // XU LY Identification
          this.page.totalItems = res.data.totalItems;
          this.diffDetail = res.data;
          console.log("res---------------", this.diffDetail);

          this.diffDetail.listIdentification.forEach((element1) => {
            if(element1.newObject != null) {

              this.diffListIdentification.push(element1.newObject);
            } else if(element1.history != null) {
              this.diffDefaultIdentification = element1.history;
            }
            console.log("diffListIdentification",this.diffListIdentification);
            console.log("diffDefaultIdentification",this.diffDefaultIdentification);
          });

          // XU LY CONTACT ADDRESS
          this.diffDetail.listContactAddress.forEach((element1) => {
            if(element1.newObject != null) {

              this.diffListContactAddress.push(element1.newObject);
            } else if(element1.history != null) {
              // this.diffDefaultIdentification = element1.history;
            }
     
          });

          // XU LY BANK
          this.diffDetail.listBank.forEach((element1) => {
            if(element1.newObject != null) {

              this.diffListBank.push(element1.newObject);
            } else if (element1.deletedObject){
              this.diffListBankDelete.push(element1.deletedObject);
            } else if (element1?.history && element1?.id){
              this.diffListBankUpdate.push(element1.history);
            }
          });
          console.log('!!! bank: ', this.diffListBankUpdate);
          

          // xu ly stock
          this.diffDetail.listStock.forEach((element1) => {
            if(element1.newObject != null) {

              this.diffListStock.push(element1.newObject);
            } else if(element1.history != null) {
              // this.diffDefaultIdentification = element1.history;
            }
     
          });

        }
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  openModalViewImage(url) {
    this.viewImage = {
      url,
      modalVisible: true,
    };
  }

  changeTabview(indexTab) {
    console.log({ indexTab: indexTab });
    this.keyword = '';
    this.businiessCustomers = [];
    this.customers = [];
  }

  resetData() {
    this.keyword = '';
    this.businiessCustomers = [];
    this.customers = [];
  }
}
