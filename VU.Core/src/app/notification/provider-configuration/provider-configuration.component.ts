import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartnerConst, PermissionCoreConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { TabView } from 'primeng/tabview';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-provider-configuration',
  templateUrl: './provider-configuration.component.html',
  styleUrls: ['./provider-configuration.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class ProviderConfigurationComponent extends CrudComponentBase implements OnInit {

  constructor(
    injector: Injector,
    
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private partnerService: PartnerServiceProxy,
    private breadcrumbService: BreadcrumbService,
    private _notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    
  ) { 
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Cấu hình nhà cung cấp', routerLink: ['/notification/provider-config'] },
    ]);

    // this.partnerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id')); 
  }

  fieldErrors = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];

  // partnerId: number;
  providerConfig: any = {
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
  labelButtonEdit = "Cấu hình thông tin";
  labelButton = "Cấu hình thông tin";

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

  getProviderConfiguration(){
    
    console.log("pushAppTitle",this.providerConfig);
    
    this.isLoading = true;
    this._notificationService.getProviderConfiguration().subscribe(
      (res) => {
       
        this.isLoading = false;
        if(res != null) {

          this.providerConfig = res;
          this.providerConfig = {
            ...this.providerConfig};
        }
        console.log('Res get-----',this.providerConfig);
        // if(this.providerConfig.pushAppTitle != null) {
        //   this.providerConfig.pushAppTitle.temp = this.providerConfig?.pushAppTitle;

        // }
        
        
    }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
    });
  }

  // create() {
  //     let modal = this.dialogService.open(CreateProviderConfigurationComponent, {
  //       data: {
          
  //       },
  //       header: "Thêm đối tác",
  //       width: '1000px',
  //     })
  //     modal.onClose.subscribe(result => {
        
  //     });
    
  // }

  changeTabview(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabViewActive[tabHeader] = true;
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.providerConfig)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  changeEdit() {
    console.log(this.providerConfig);
    
    // this.providerConfig.pushAppTitle.temp = this.providerConfig?.pushAppTitle;

    if(this.isEdit) {
      this._notificationService.createProviderConfiguration(this.providerConfig).subscribe((response) => {
        this.messageService.add({severity:'success', summary: '',detail: 'Cập nhật thành công', life: 1000,});
        
          this.isEdit = !this.isEdit;
          this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Cấu hình thông tin";
          this.labelButton = this.isEdit ? "Lưu lại" : "Cấu hình thông tin";
          setTimeout(() => {
            this.getProviderConfiguration();
          }, 1000);
      }, error => {
   
        this.messageService.add({  severity: 'error', summary: '', detail: 'Vui lòng nhập đủ dữ liệu!', life: 1000, });
      });
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Cấu hình thông tin";
      this.labelButton = this.isEdit ? "Lưu lại" : "Cấu hình thông tin";

    }
  }
}

