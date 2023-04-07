import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppConsts, BusinessCustomerConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { MessageService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-business-customer-detail',
  templateUrl: './business-customer-detail.component.html',
  styleUrls: ['./business-customer-detail.component.scss']
})
export class BusinessCustomerDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private _businessCustomerService: BusinessCustomerServiceProxy,
    private breadcrumbService: BreadcrumbService,
    private _contractTemplateService: ContractTemplateServiceProxy,
  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Khách hàng doanh nghiệp', routerLink: ['/customer/business-customer/business-customer'] },
      { label: 'Chi tiết khách hàng doanh nghiệp'}
    ]);

    this.businessCustomerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
  }

  fieldErrors = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  imageDefault = 'assets/layout/images/image-bg-default.jpg';

  businessCustomerId: number;
  businessCustomerDetail: any = {};
  businessCustomerOriginal: any = {};
  isEdit = false;
  labelButtonEdit = "Chỉnh sửa";

  tabActive: string;
  callActiveFirstTab: boolean = false;
  tabViewActive = {
    'thongTinChung': false,
    'taiKhoanNganHang': false, 
    'cauHinhChuKySo': false,
    'giayPhepDKKD': false,
  };

  tempDigitalSign = {
    'key' : null,
    'secret' : null,
    'server' : null,
    'stampImageUrl' : null,
  };

  updateDigitalSignDetail = {
    'businessCustomerTempId': 0,
    'key' : null,
    'secret' : null,
    'server' : null,
    'stampImageUrl' : null,
  }

  BusinessCustomerConst = BusinessCustomerConst;
  NationalityConst = NationalityConst;
  AppConsts = AppConsts;

  @ViewChild(TabView) tabView: TabView;


  ngOnInit(): void {
    this.isLoading = true;
    this._businessCustomerService.get(this.businessCustomerId).subscribe(
      (res) => {
          this.isLoading = false;
          if (this.handleResponseInterceptor(res, '')) {
              this.businessCustomerDetail = res.data;
              this.businessCustomerDetail = {
                ...this.businessCustomerDetail,
                licenseDate: this.businessCustomerDetail?.licenseDate ? new Date(this.businessCustomerDetail?.licenseDate): null,
                decisionDate: this.businessCustomerDetail?.decisionDate ? new Date(this.businessCustomerDetail?.decisionDate): null,
                dateModified: this.businessCustomerDetail?.dateModified ? new Date(this.businessCustomerDetail?.dateModified): null,
              };
              this.businessCustomerOriginal = {...this.businessCustomerDetail}
              console.log({ businessCustomerDetail: this.businessCustomerDetail });
          }
      }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        this.messageError('Có lỗi xảy ra. Vui lòng thử lại sau!');
      });
    }

  changeTabView(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabActive = tabHeader;
    this.tabViewActive[tabHeader] = true;
  }

  activeFirstTabDefault(isPermission, tabName) {
    if(isPermission && !this.callActiveFirstTab) {
      this.tabActive = tabName;
      this.callActiveFirstTab = true;
      this.tabViewActive[tabName] = true;
    }
    return true;
  }

     // Update ảnh đại diện
  myUploader(event) {
    if (event?.files[0]) {
      this._contractTemplateService.uploadFileGetUrl(event?.files[0], "core").subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
          console.log("response",response);
          
          this.businessCustomerDetail.avatarImageUrl = response?.data;
        }
      }, (err) => {
        console.log('err-----', err);
        this.messageError("Có sự cố khi upload!");
      }
      );
    }
  }
  

  setFieldError() {
    for (const [key, value] of Object.entries(this.businessCustomerDetail)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  resetStatusButtonEdit() {
    this.isEdit = !this.isEdit;
  }

  checkChangeData(dataOrigin: any, dataUpdate: any): boolean {
    for (const [key, value] of Object.entries(this.businessCustomerDetail)) {
      if(this.businessCustomerOriginal[key] !== value) {
        console.log('change------------');
        console.log(this.businessCustomerOriginal[key], value);
        return true;
      }
    }
    this.resetStatusButtonEdit();
    return false;
  }

  changeEdit() {
    if(this.isEdit) {
      if(this.checkChangeData(this.businessCustomerOriginal, this.businessCustomerDetail)) {
        let body = this.formatCalendar(this.fieldDates, {...this.businessCustomerDetail});
        this._businessCustomerService.update(body).subscribe((response) => {
          if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
            this.resetStatusButtonEdit();
            this.router.navigate(["/customer/business-customer/business-customer-approve/detail/" + this.cryptEncode(response.data.businessCustomerTempId) ]);
          } 
        }, (err) => {
          console.log('err----', err);
        });
      }
    } else {
      this.resetStatusButtonEdit();
    }
  }  

  updateDigitalSignDemo(digitalSign) {
    console.log("digitalSign",digitalSign);
    
    if(digitalSign != null) {
      this.tempDigitalSign = digitalSign;
    } 
    
    console.log('updateDigitalSignDetail-----', this.tempDigitalSign);
  }

  changeEditDigitalSign() {
    console.log("businessCustomerId------",this.businessCustomerId);
    if (this.isEdit) {
      this.updateDigitalSignDetail.businessCustomerTempId = this.businessCustomerId; 
      console.log('tempDigitalSign-----', this.tempDigitalSign.key);
      if(this.tempDigitalSign.key != null) {
        this.updateDigitalSignDetail.key = this.tempDigitalSign?.key;
      }
      if(this.tempDigitalSign.secret !== null){
        this.updateDigitalSignDetail.secret = this.tempDigitalSign.secret;
      }
      if(this.tempDigitalSign.server !== null){
        this.updateDigitalSignDetail.server = this.tempDigitalSign.server;
      }
      if(this.tempDigitalSign.stampImageUrl !== null){
        this.updateDigitalSignDetail.stampImageUrl = this.tempDigitalSign.stampImageUrl
      }
      
      if(this.tabViewActive.cauHinhChuKySo == true) {
        console.log("this.updateDigitalSignDetail",this.updateDigitalSignDetail);
        
        this._businessCustomerService.updateDigitalSign(this.updateDigitalSignDetail).subscribe((response) => {
          if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
            this.isEdit = !this.isEdit;
            this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
            this.router.navigate(["/customer/business-customer/business-customer-approve/detail/" + this.cryptEncode(response.data.businessCustomerTempId) ]);
          } else {
            
          }
        });
      }
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
    }
  }

}
