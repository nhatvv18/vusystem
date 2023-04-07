import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartnerConst, PermissionCoreConst } from '@shared/AppConsts';
import { OBJECT_INVESTOR_EKYC } from '@shared/base-object';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { DigitalSignServiceProxy } from '@shared/service-proxies/digital-sign-service';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TabView } from 'primeng/tabview';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';


const { DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;

@Component({
  selector: 'app-digital-sign',
  templateUrl: './digital-sign.component.html',
  styleUrls: ['./digital-sign.component.scss']
})
export class DigitalSignComponent extends CrudComponentBase implements OnInit {

  constructor(
    injector: Injector,
    
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private partnerService: PartnerServiceProxy,
    private breadcrumbService: BreadcrumbService,
    private _notificationService: DigitalSignServiceProxy,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private _contractTemplateService: ContractTemplateServiceProxy,
    
  ) { 
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Chữ ký số', routerLink: ['/establish/digital-sign'] },
    ]);
    // this.partnerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id')); 
  }

  fieldErrors = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];

  // partnerId: number;
  businessCustomerInfo: any = {
    stmpConfig: {
      "SMTP_HOST" : null,
    },
    smsConfig: {
      "USERNAME" : null
    },
    "pushAppTitle": null,
    
  }
 
  PermissionCoreConst = PermissionCoreConst;
  isEdit = false;
  labelButtonEdit = "Cập nhật";
  labelButton = "Thêm mới";

  imageDefault: any = DEFAULT_IMAGE.IMAGE_AVATAR;

  tabViewActive = {
    'thongTinChung': true,
    'taiKhoanDangNhap': false,
  };

  @ViewChild(TabView) tabView: TabView;

  PartnerConst=PartnerConst;
  NationalityConst = NationalityConst;

  ngOnInit(): void {
    // console.log("this.isPermission(PermissionCoreConst.CoreMenu_CauHinhNCC",this.isGranted(PermissionCoreConst.CoreCauHinhNCC_DanhSach);
    
    this.getProviderConfiguration();
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

  getProviderConfiguration(){
    console.log("pushAppTitle",this.businessCustomerInfo);
    this._notificationService.getDigitalSignTradingProvider().subscribe((res) => {
        if(res != null) {
          this.businessCustomerInfo = res.data;
          this.businessCustomerInfo = {
            ...this.businessCustomerInfo};
        }
        console.log('Res get-----',this.businessCustomerInfo);
    }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
    });
  }

  changeTabview(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabViewActive[tabHeader] = true;
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.businessCustomerInfo)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  changeEdit() {
    console.log(this.businessCustomerInfo);
    if(this.isEdit) {
      this._notificationService.updateDigitalSignTradingProvider(this.businessCustomerInfo).subscribe((res) => {
        if (this.handleResponseInterceptor(res, 'Cập nhật thành công')) {
          
          // this.messageService.add({severity:'success', summary: 'Thành công',detail: 'Cập nhật thành công', life: 1000,});
          
            this.isEdit = !this.isEdit;
            this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Cập nhật";
            this.labelButton = this.isEdit ? "Lưu lại" : "Thêm mới";
            setTimeout(() => {
              this.getProviderConfiguration();
            }, 1000);
        }
          
      }, error => {
   
        this.messageService.add({  severity: 'error', summary: 'Lỗi', detail: 'Còn dữ liệu bắt buộc đang bỏ trống!', life: 1000, });
      });
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
      this.labelButton = this.isEdit ? "Lưu lại" : "Thêm mới";

    }
  }
}


