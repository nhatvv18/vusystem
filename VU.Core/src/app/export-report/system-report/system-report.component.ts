import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ExportReportConst, PermissionCoreConst } from '@shared/AppConsts';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies-base';
import { ExportReportService } from '@shared/services/export-report.service';
import { PermissionsService } from '@shared/services/permissions.service';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-system-report',
  templateUrl: './system-report.component.html',
  styleUrls: ['./system-report.component.scss']
})
export class SystemReportComponent extends AppComponentBase {

  permissionName: PermissionCoreConst;
  private permissions: PermissionsService;
  PermissionCoreConst = PermissionCoreConst;

  constructor(
    injector: Injector,
    messageService: MessageService,
    private _exportReportService: ExportReportService,
    private breadcrumbService: BreadcrumbService,
    private _userService: UserServiceProxy,
    @Inject(API_BASE_URL) baseUrl?: string
  ) { 
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Báo cáo quản trị" },
    ]);
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
  }
  private baseUrl: string;
  title: string;
  submitted = false;
  isSend: boolean;

  showApproveBy: boolean = false;
  acceptStatus: boolean = true;
  isInvestorProf: boolean;
  check_approve: boolean;

  isLoadingPage = false;

  dataApprove = {
    id: 0,
    userApproveId: 1,
    approveNote: null,
    startDate: null,
    endDate: null,
  };

  startDate: any;
  endDate: any; 

  status: any = null;
  permission: any;

  statusSearch: any[] = [];

  actions: any;
  ExportReportConst = ExportReportConst;
  ngOnInit(): void {
    this.isLoadingPage = true;
    this._userService.getAllPermission().subscribe(res => {
      this.isLoadingPage = false;
      this.permission = res.data;
      this.statusSearch = [];

      if (this.isGranted([this.PermissionCoreConst.Core_BaoCao_HeThong_DSKhachHangRoot])) {
        this.statusSearch.push(
          {
            name: "BÁO CÁO DANH SÁCH KHÁCH HÀNG ROOT",
            code: this.ExportReportConst.BC_DS_KHACH_HANG_ROOT,
          }
        )
      }

      if (this.isGranted([this.PermissionCoreConst.Core_BaoCao_QuanTri_TDTTKhachHangRoot])) {
        this.statusSearch.push(
          {
            name: "BÁO CÁO THAY ĐỔI THÔNG TIN KHÁCH HÀNG ROOT",
            code: this.ExportReportConst.BC_THAY_DOI_TT_KHACH_HANG_ROOT,
          }
        )
      }
    }, () => {

    });
  }

  isGranted(permissionNames = []): boolean {

    return this.isGrantedRootReport(permissionNames);

  }

  isGrantedRootReport(permissionNames = []): boolean {
    for(let permissionName of permissionNames) {
        if(this.permission?.includes(permissionName)) return true;
    }
    return false;
  }

  formatDateTimeView(value) {
    return (moment(value).isValid() && value) ? moment(value).format('YYYY-MM-DDTHH:mm:ss') : '';
  }

  onAccept() {
    console.log("this.status", this.status);
    this.isSend = true;
    this.dataApprove.startDate = this.formatDateTimeView(this.startDate);
    this.dataApprove.endDate = this.formatDateTimeView(this.endDate);
    if (this.status == this.ExportReportConst.BC_DS_SALER) {
      this._exportReportService.getExportListSaler(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    } else if (this.status == this.ExportReportConst.BC_DS_KHACH_HANG) {
      this._exportReportService.getExportListCustomer(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    } else if (this.status == this.ExportReportConst.BC_DS_KHACH_HANG_ROOT) {
      this._exportReportService.getExportListCustomerRoot(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    } else if (this.status == this.ExportReportConst.BC_DS_NGUOI_DUNG) {
      this._exportReportService.getExportListUser(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    } else if (this.status == this.ExportReportConst.BC_DS_KHACH_HANG_HVF) {
      this._exportReportService.getExportListCustomerHVF(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    } else if (this.status == this.ExportReportConst.BC_DS_SKTK_NHA_DAU_TU) {
      this._exportReportService.getExportAccountStatement(this.dataApprove.startDate, this.dataApprove.endDate).subscribe();
      this.isSend = false;
    }
    else if (this.status == null) {
      this.isSend = false;
      this.messageError("Vui lòng chọn loại hình thông báo");
    }
  }

  validForm(): boolean {
    let validRequired;
    validRequired = this.startDate && this.endDate;

    return validRequired;
  }

}
