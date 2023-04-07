import { map } from 'rxjs/operators';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ApproveConst, BusinessCustomerApproveConst, InvestorConst, SaleConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';
import { FormCancelComponent } from 'src/app/form-request-approve-cancel/form-cancel/form-cancel.component';
import { NationalityConst } from '@shared/nationality-list';
import { SaleService } from '@shared/service-proxies/sale-service';
import { forkJoin } from 'rxjs';
import { OBJECT_INVESTOR_EKYC } from '@shared/base-object';
import { TabView } from 'primeng/tabview';

const { DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;
@Component({
  selector: 'app-sale-active-detail',
  templateUrl: './sale-active-detail.component.html',
  styleUrls: ['./sale-active-detail.component.scss']
})
export class SaleActiveDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private _saleService: SaleService,

  ) {
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Danh sách sale', routerLink: ['/sale-manager/sale-active'] },
    ]);

    this.saleId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));

  }

  fieldErrors: any = {};

  avatarDefault: any = DEFAULT_IMAGE.IMAGE_AVATAR;

  saleId: number;
  saleInfo: any = {};
  investorInfo: any = {};
  businessCustomerInfo: any = {};
  //
  isEdit = false;

  tabViewActive = {
    'thongTinChung': true,
    'hopDongCongTac': false,
    'lichSu': false
  };

  @ViewChild(TabView) tabView: TabView;


  InvestorConst = InvestorConst;
  SaleConst = SaleConst;
  ApproveConst = ApproveConst;
  NationalityConst = NationalityConst;

  banks: any = {};
  rows: any[] = [];
  actions: any[] = [];  // list button actions

  managers: any[] = [];
  departments: any[] = [];
  

  ngOnInit(): void {
    this.getDetail();
  }

  changeTabview(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabViewActive[tabHeader] = true;
  }

  changeSaleType(saleType) {
    if(saleType == SaleConst.TYPE_MANAGER) {
      this.saleInfo.saleParentId = null;
    } 
  }

  redirectSaleActive() {
    this.router.navigate(["/sale-manager/sale-active"]);
  }
 
  setFieldError() {
    for (const [key, value] of Object.entries(this.saleInfo)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  getDetail(isLoading = true) {
    this.isLoadingPage = isLoading;
    forkJoin([this._saleService.get(this.saleId),this._saleService.getAllDepartment()]).subscribe(([resSale, resDepartment]) => {
      this.isLoadingPage = false;
      this.departments = resDepartment.data?.items ?? [];

      if (this.handleResponseInterceptor(resSale, '')) {
        if (resSale.data?.departmentId) this.changeDepartment(resSale.data?.departmentId);
        if (resSale?.data?.avatarImageUrl) {
          this.avatarDefault = `${this._saleService.getBaseApiUrl()}/${
            resSale.data.avatarImageUrl
          }`;
        }

        this.saleInfo = resSale?.data;
        this.saleInfo.avatar = this.saleInfo?.investor?.avatarImageUrl ? `${this._saleService.getBaseApiUrl()}/${this.saleInfo.investor.avatarImageUrl}` : this.avatarDefault;
        this.saleInfo.saleParentId = this.saleInfo?.saleParentId;
        if(this.saleInfo?.investorId) {
          this.investorInfo = this.saleInfo?.investor;
          this.banks = this.saleInfo?.investor?.listBank;

          if(this.saleInfo?.investor?.listBank?.length) {
            this.banks = this.saleInfo.investor.listBank.map(bank => {
              bank.labelName = bank.bankAccount + ' - ' + (bank?.coreBankName ?? bank?.bankName);
              return bank;
            });
          }
        } else 
        if(this.saleInfo?.businessCustomerId) {
          this.businessCustomerInfo = this.saleInfo?.businessCustomer;
          this.banks = this.businessCustomerInfo?.businessCustomerBanks;

          if(this.businessCustomerInfo?.businessCustomerBanks?.length) {
            this.banks = this.businessCustomerInfo.businessCustomerBanks.map(bank => {
              bank.labelName = bank.bankAccName + ' - ' + bank?.bankAccNo + ' - ' + bank?.bankName;
              bank.id = bank.businessCustomerBankId;
              return bank;
            });
          }
          } 
        
        
        console.log({ saleInfo: this.saleInfo });
      }
    }, (err) => {
      this.isLoadingPage = false;
      console.log('Error-------', err);
      
    });
  }

  changeDepartment(departmentId) {
    this._saleService.getAllSale(departmentId).subscribe((res) => {
      if(this.handleResponseInterceptor(res, '')) {
        if(res.data?.items?.length) {
          this.managers = res.data.items.map(item => {
              item.fullName = item?.investor?.investorIdentification?.fullname ?? item?.businessCustomer?.name ;
              item.saleParentId = item?.saleId;
              return item;
          });
        } else {
          this.managers = [];
        }
      }
      console.log('quan ly', this.managers);
    });
  }

  changeEdit() {
    console.log(this.saleInfo);
    if(this.isEdit) {
      let body = {
        ...this.saleInfo,
        investor: null,
      }
      this._saleService.update(body).subscribe((response) => {
        if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.isEdit = !this.isEdit;
          this.getDetail(false);
        } 
      });
    } else {
      this.isEdit = !this.isEdit;
    }
  }

}
