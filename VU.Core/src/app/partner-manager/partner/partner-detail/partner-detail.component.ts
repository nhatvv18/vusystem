import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartnerConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';

import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabView } from 'primeng/tabview';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-partner-detail',
  templateUrl: './partner-detail.component.html',
  styleUrls: ['./partner-detail.component.scss']
})
export class PartnerDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private partnerService: PartnerServiceProxy,
    private breadcrumbService: BreadcrumbService
  ) { 
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Đối tác', routerLink: ['/partner-manager/partner']  },
      { label: 'Chi tiết đối tác',},
    ]);

    this.partnerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id')); 
  }

  fieldErrors = {};
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];

  partnerId: number;
  partnerDetail: any = {
    capital: 0
  };
  isEdit = false;
  labelButtonEdit = "Chỉnh sửa";

  tabViewActive = {
    'thongTinChung': true,
    'taiKhoanDangNhap': false,
  };

  @ViewChild(TabView) tabView: TabView;

  PartnerConst=PartnerConst;
  NationalityConst = NationalityConst;

  ngOnInit(): void {
    this.isLoading = true;
    this.partnerService.get(this.partnerId).subscribe(
      (res) => {
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, '')) {
            this.partnerDetail = res.data;
            this.partnerDetail = {
              ...this.partnerDetail,
              licenseDate: this.partnerDetail?.licenseDate ? new Date(this.partnerDetail?.licenseDate): null,
              decisionDate: this.partnerDetail?.decisionDate ? new Date(this.partnerDetail?.decisionDate): null,
              dateModified: this.partnerDetail?.dateModified ? new Date(this.partnerDetail?.dateModified): null,
            };
            console.log({ partnerDetail: this.partnerDetail });
        }
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
    for (const [key, value] of Object.entries(this.partnerDetail)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  changeEdit() {
    console.log(this.partnerDetail);
    if(this.isEdit) {
      let body = this.formatCalendar(this.fieldDates, {...this.partnerDetail});
      this.partnerService.update(body).subscribe((response) => {
        this.callTriggerFiledError(response, this.fieldErrors);
        if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.isEdit = !this.isEdit;
          this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
        } 
      });
    } else {
      this.isEdit = !this.isEdit;
      this.labelButtonEdit = this.isEdit ? "Lưu lại" : "Chỉnh sửa";
    }
  }
}
