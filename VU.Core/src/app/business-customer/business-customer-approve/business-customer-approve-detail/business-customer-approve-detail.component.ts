import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { AppConsts, ApproveConst, BusinessCustomerApproveConst, BusinessCustomerConst, PermissionCoreConst, SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { BusinessCustomerApproveServiceProxy } from '@shared/service-proxies/business-customer-service';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '@shared/model/page';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormApproveComponent } from 'src/app/form-request-approve-cancel/form-approve/form-approve.component';
import { FormCancelComponent } from 'src/app/form-request-approve-cancel/form-cancel/form-cancel.component';
import { BankServiceProxy } from '@shared/service-proxies/bank-service';
import { NationalityConst } from '@shared/nationality-list';
import { FormShowChangeComponent } from 'src/app/business-customer/business-customer-approve/business-customer-approve-detail/form-show-change/form-show-change.component';
import { FormApproveBusinessComponent } from './form-approve-business/form-approve-business.component';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';
import { TabView } from 'primeng/tabview';


@Component({
  selector: 'app-business-customer-approve-detail',
  templateUrl: './business-customer-approve-detail.component.html',
  styleUrls: ['./business-customer-approve-detail.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService, MenuModule],
})
export class BusinessCustomerApproveDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private location: Location,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private _businessCustomerApproveService: BusinessCustomerApproveServiceProxy,
    private breadcrumbService: BreadcrumbService,
    private _bankService: BankServiceProxy,
    private _contractTemplateService: ContractTemplateServiceProxy,

  ) {
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Thêm khách hàng doanh nghiệp', routerLink: ['/customer/business-customer/business-customer-approve'] },
      { label: 'Chi tiết khách hàng doanh nghiệp' },
    ]);

    this.approveId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
    this.isApprove = this.routeActive.snapshot.paramMap.get("isApprove");
  }

  /* Check isApprove */
  isApprove = null;

  fieldErrors: any = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  baseUrl: string;

  approveId: number;
  businessCustomerInfo: any = {};
  digitalSign: any = {}

  isEdit = false;
  labelButtonEdit = "Chỉnh sửa";
  imageDefault = 'assets/layout/images/image-bg-default.jpg';

  tabViewActive = {
    'thongTinChung': false,
    'taiKhoanNganHang': false,
    'cauHinhChuKySo' : false,
    'giayPhepDKKD': false,
  };

  @ViewChild(TabView) tabView: TabView;

  BusinessCustomerApproveConst = BusinessCustomerApproveConst;
  BusinessCustomerConst = BusinessCustomerConst;
  ApproveConst = ApproveConst;
  NationalityConst = NationalityConst;
  AppConsts = AppConsts;

  banks: any = {};
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

  tabActive: string;

  rows: any[] = [];
  actions: any[] = [];  // list button actions

  callActiveFirstTab: boolean = false;

  ngOnInit(): void {
    console.log("hiển thị approveID ", this.approveId);
    this.getDetail();
    this.getAllBank();
    console.log("123",PermissionCoreConst.CoreDuyetKHDN_DKKD);
    
  }

  activeFirstTabDefault(isPermission, tabName) {
    if(isPermission && !this.callActiveFirstTab) {
      this.tabActive = tabName;
      this.callActiveFirstTab = true;
      this.tabViewActive[tabName] = true;
    }
    return true;
  }

  updateDigitalSignDemo(digitalSign) {
    console.log("digitalSign",digitalSign);
    
    if(digitalSign != null) {
      this.tempDigitalSign = digitalSign;
    } 
   
		console.log('updateDigitalSignDetail-----', this.tempDigitalSign);
	}

  // viewUpdate(idTemp) {
  //   this.router
  //     .navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"])
  //     .then(() => {
  //       window.location.reload();
  //     });
  // }

  changeEditDigitalSign() {
    console.log("approveId------",this.approveId);
    if (this.isEdit) {
      this.updateDigitalSignDetail.businessCustomerTempId = this.approveId; 
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

        this._businessCustomerApproveService.updateDigitalSign(this.updateDigitalSignDetail).subscribe((response) => {
          if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
            this.isEdit = !this.isEdit;
          this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
  
          } else {
      
          }
        });
      }
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
    }
  }

  changeTabview(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabActive = tabHeader;
    this.tabViewActive[tabHeader] = true;
  }

  // Update ảnh đại diện
  myUploader(event) {
    if (event?.files[0]) {
      this._contractTemplateService.uploadFileGetUrl(event?.files[0], "core").subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {

          this.businessCustomerInfo.avatarImageUrl = response?.data;
        }
      }, (err) => {
        console.log('err-----', err);
        this.messageError("Có sự cố khi upload!");
      }
      );
    }
  }

  viewBusinessCustomer() {
    this.router.navigate(["/customer/business-customer/business-customer"]);
  }

  getAllBank() {
    this.page.keyword = this.keyword;
    this.isLoading = true;
    this._bankService.getAllBank(this.page).subscribe(
      (res) => {
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, "")) {
          this.page.totalItems = res.data.totalItems;
          this.banks = res.data.items;
          console.log({ banks: res.data.items, totalItems: res.data.totalItems });
        }
      },
      (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
      }
    );
  }

  genActions(businessCustomerInfo) {
    this.actions = [];
    //
    if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_TrinhDuyet]) && (businessCustomerInfo.status == this.BusinessCustomerApproveConst.status.KHOI_TAO)) {
      this.actions.push({
        data: businessCustomerInfo,
        label: 'Trình duyệt',
        icon: 'pi pi-check',
        statusActive: [BusinessCustomerApproveConst.status.KHOI_TAO],
        permission: this.isGranted([]),
        command: ($event) => {
          this.request($event.item.data);
        }
      })
    }

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
    console.log("updateDigitalSignDemo",this.businessCustomerInfo);
    if (this.isEdit) {
      if(this.tabViewActive.thongTinChung == true) {
      let body = this.formatCalendar(this.fieldDates, {...this.businessCustomerInfo});
      this._businessCustomerApproveService.update(body).subscribe((response) => {
        if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.isEdit = !this.isEdit;
          this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
          // this.location.back();
        }
      });
      }
      
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
    }
  }
  //
  request(businessCustomer) {
    const data = {
      id: businessCustomer.businessCustomerTempId,
      summary: businessCustomer.name + ' - ' + businessCustomer.taxCode,
      actionType: businessCustomer.businessCustomerId ? this.ApproveConst.ACTION_UPDATE : this.ApproveConst.ACTION_ADD,
    }
    //
    const ref = this.dialogService.open(
      FormRequestComponent,
      this.getConfigDialogServiceRAC("Trình duyệt", data)
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log('dataCallBack', dataCallBack);
      if (dataCallBack?.accept) {
        this._businessCustomerApproveService.request(dataCallBack.data).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Trình duyệt thành công!")) {
            setTimeout(() => {
              this.getDetail();
            }, 500);
          }
        });
      }
    });
  }

  //
  partnerCancel(businessCustomerInfo) {
    const ref = this.dialogService.open(
      FormCancelComponent,
      this.getConfigDialogServiceRAC("Hủy duyệt", { id: businessCustomerInfo.businessCustomerTempId })
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log('dataCallBack', dataCallBack);
      if (dataCallBack?.accept) {
        this._businessCustomerApproveService.partnerCancel(dataCallBack.data).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Hủy duyệt thành công!")) {
            this.getDetail();
            // this.viewBusinessCustomer();
          }
        });
      }
    });
  }

  partnerApprove(businessCustomerInfo) {
    console.log("đầu vào của phê duyệt", businessCustomerInfo);

    const ref = this.dialogService.open(
      FormApproveBusinessComponent,
      {
        header: "Xử lý yêu cầu",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          businessCustomer: businessCustomerInfo,
          investorId: this.approveId
        },
      }
    );

    ref.onClose.subscribe((dataCallBack) => {
      console.log('dataCallBack', dataCallBack);
      if (dataCallBack?.checkApprove == true) {
        this._businessCustomerApproveService.partnerApprove(dataCallBack.data).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Phê duyệt thành công!")) {
            // this.viewBusinessCustomer();
            this.router.navigate(["/approve-manager/approve/3"]);

          }
        });
      } else if (dataCallBack?.checkApprove == false) {
        this._businessCustomerApproveService.partnerCancel(dataCallBack.data).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
            // this.viewBusinessCustomer();
            this.router.navigate(["/approve-manager/approve/3"]);
          }
        });
      }
    });
  }

  showChange(businessCustomerInfo) {
    const ref = this.dialogService.open(
      FormShowChangeComponent,
      this.getConfigDialogServiceRAC("Thay đổi sau khi chỉnh sửa", { id: businessCustomerInfo.businessCustomerTempId })
    );
  }

  // approveSharing(businessCustomerInfo){
  //   console.log("businessCustomerInfo", businessCustomerInfo);
    
  //   const ref = this.dialogService.open(
  //     FormApproveBusinessComponent,
  //     {
  //       header: "Xử lý yêu cầu",
  //       width: '600px',
  //       contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
  //       styleClass: 'p-dialog-custom',
  //       baseZIndex: 10000,
  //       data: {
  //         businessCustomer: businessCustomerInfo,
  //         investorId: businessCustomerInfo.referIdTemp
  //       },
  //     }
  //   );

    // ref.onClose.subscribe((dataCallBack) => {
    //   if (dataCallBack?.accept) {
    //     const body1 = {
    //       notice: dataCallBack?.data?.approveNote,
    //       investorId: businessCustomerInfo.referIdTemp,
    //       // investorGroupId: investor.investorGroupId,
    //     }
    //     const body2 = {
    //       notice: dataCallBack?.data?.approveNote,
    //       id: businessCustomerInfo?.referIdTemp,
    //       approveID: dataCallBack?.data?.approveID,
    //       cancelNote: dataCallBack?.data?.requestNote,
    //       approveNote: dataCallBack?.data?.requestNote,
    //     }
    //     if (businessCustomerInfo.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER && dataCallBack?.checkApprove == true) {

    //       this._businessCustomerApproveService.partnerApprove(body2).subscribe((response) => {
    //         if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
    //           // this.setPage(null, this.dataType);
    //         }
    //       });
    //     } else if (businessCustomerInfo.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER && dataCallBack?.checkApprove == false) {
    //       this._businessCustomerApproveService.partnerCancel(body2).subscribe((response) => {
    //         if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
    //           // this.setPage(null, this.dataType);
    //         }
    //       });
    //     }
    //   }
    // });
    
  // }

  getDetail() {
    this.isLoadingPage = true;
    this._businessCustomerApproveService.get(this.approveId).subscribe((res) => {
      if (this.handleResponseInterceptor(res, '')) {
        this.businessCustomerInfo = res.data;
        this.businessCustomerInfo = {
          ...this.businessCustomerInfo,
          licenseDate: this.businessCustomerInfo?.licenseDate ? new Date(this.businessCustomerInfo?.licenseDate) : null,
          decisionDate: this.businessCustomerInfo?.decisionDate ? new Date(this.businessCustomerInfo?.decisionDate) : null,
          dateModified: this.businessCustomerInfo?.dateModified ? new Date(this.businessCustomerInfo?.dateModified) : null,
        };

        this.genActions(this.businessCustomerInfo);
        console.log({ businessCustomerInfo: this.businessCustomerInfo });
      }
      setTimeout(() => {
        this.isLoadingPage = false;
      }, 300);
    }, (err) => {
      this.isLoadingPage = false;
      
      console.log('Error-------', err);
    });
  }
}
