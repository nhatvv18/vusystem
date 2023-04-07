import { Component, Injector, OnInit } from '@angular/core';
import { AppConsts, FormNotificationConst, InvestorConst, MediaNewsConst, NotificationTemplateConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { AddNotificationTemplateComponent } from '../add-notification-template/add-notification-template.component';
import { decode } from 'html-entities'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
@Component({
  selector: 'app-notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.scss']
})
export class NotificationTemplateComponent extends CrudComponentBase implements OnInit {

  page = new Page()
  rows: any[] = [];
  baseUrl: string;
  listAction: any[] = []
  constructor(
    injector: Injector,
    messageService: MessageService,
    public dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private confirmationService: ConfirmationService,
    public _dialogService: DialogService,
    private notificationService: NotificationService) {
    super(injector, messageService);
    this.isLoading = false;
    this.rows = [];
    this.page = new Page();
  }

  statusSearch: any[] = [
    {
      name: "Tất cả",
      code: ''
    },

    ...NotificationTemplateConst.status
  ]

  ngOnInit(): void {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.setPage({ page: this.offset });
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Quản lý mẫu thông báo' }
    ]);
  }

  genListAction(data = []) {
    this.listAction = data.map((item) => {
      const status = item?.approve?.status;

      const actions = [];

      if (item?.status == NotificationTemplateConst.KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreMauThongBao_CapNhat])) {
        actions.push({
          data: item,
          label: "Chỉnh sửa",
          icon: "pi pi-user-edit",
          command: ($event) => {
            this.edit($event.item.data);
          },
        });
      }

      if (item?.status == NotificationTemplateConst.KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreMauThongBao_Xoa])) {
        actions.push({
          data: item,
          label: "Xoá",
          icon: "pi pi-trash",
          command: ($event) => {
            this.remove($event.item.data);
          },
        });
      }

      if (item?.status == NotificationTemplateConst.KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreMauThongBao_KichHoatOrHuy])) {
        actions.push({
          data: item,
          label: "Huỷ kích hoạt",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }

      if (item?.status == NotificationTemplateConst.HUY_KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreMauThongBao_KichHoatOrHuy])) {
        actions.push({
          data: item,
          label: "Kích hoạt",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }

      return actions;
    });
  }

  changeStatus() {
    this.setPage({ page: this.offset })
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    // this.page.pageSize = 20;
    this.notificationService.getAllNotificationTemplate(this.page,this.status).subscribe((res) => {
      this.isLoading = false;
      this.page.totalItems = res.totalResults;
      this.rows = res.results.map((row) => {
        row.emailContent = decode(row.emailContent);
        row.smsContent = decode(row.smsContent);
        row.notificationContent = decode(row.notificationContent);
        row.createdAt= this.formatDateTime(row?.createdAt);
        return row
      });
      this.genListAction(this.rows);
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  setLengthStringInScreen(ratio) {
    return (this.screenWidth/ratio).toFixed();
  }

  create() {
    const ref = this.dialogService.open(AddNotificationTemplateComponent, {
      data: {
        inputData: null
      },
      header: 'Thêm mới mẫu thông báo',
      width: '100%',
      height: '100%',
      style: {'max-height': '100%', 'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    }).onClose.subscribe(result => {
      this.offset = 0;
      this.setPage({ page: this.offset });
    })
  }

  edit(row) {
    console.log("row", row);
    
    let modal = this.dialogService.open(AddNotificationTemplateComponent, {
      data: {
        inputData: row
      },
      header: 'Chỉnh sửa mẫu thông báo',
      width: '100%',
      height: '100%',
      style: {'max-height': '100%',  'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    })
    modal.onClose.subscribe(result => {
      this.offset = 0
      this.setPage({ page: this.offset })
    });
  }

  getStatusSeverity(status) {
    let statusesWithLabel = {
      'ACTIVE': "success",
      'INACTIVE': "danger"
    }
    return statusesWithLabel[status];
  }
  getStatusName(status) {
    let statusesWithLabel = {
      'ACTIVE': "Kích hoạt",
      'INACTIVE': "Không kích hoạt"
    }
    return statusesWithLabel[status];
  }
  // remove(row) {
  //   this.confirmationService.confirm({
  //     message: "Bạn có muốn xoá mẫu thông báo: " + row.title,
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       this.notificationService.deleteNotificationTemplate(row.id).subscribe(result => {

  //         this.messageService.add({
  //           severity: 'success',
  //           summary: "Xoá mẫu thông báo thành công",
  //           detail: "",
  //           life: 3000,
  //         })
  //         this.setPage();
  //       }, err => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: "Lỗi khi xoá mẫu thông báo",
  //           detail: "Vui lòng thử lại",
  //           life: 3000,
  //         })
  //       })
        
  //     }

  //   }
  //   );
  // }


  remove(row) {
    const ref = this._dialogService.open(
      FormNotificationComponent,
      {
        header: "Thông báo",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          title: "Bạn có muốn xoá mẫu thông báo này?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        this.notificationService.deleteNotificationTemplate(row.id).subscribe(result => {

          this.messageService.add({
            severity: 'success',
            summary: "Xoá mẫu thông báo thành công",
            detail: "",
            life: 3000,
          })
          this.setPage();
        }, err => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi xoá mẫu thông báo",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        });
      }
    });
  }

  // approve(row) {
  //   this.confirmationService.confirm({
  //     message: "Bạn có muốn thay đổi trạng thái thông báo: " + row.title,
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       row.status = row.status == 'ACTIVE' ? "INACTIVE" : "ACTIVE";
  //       this.notificationService.saveNotificationTemplate(row).subscribe(result => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: "Cập nhật trạng thái mẫu thông báo thành công",
  //           life: 3000,
  //         })
  //       }, err => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: "Lỗi khi cập nhật trạng thái mẫu thông báo",
  //           detail: "Vui lòng thử lại",
  //           life: 3000,
  //         })
  //       })
  //     }
  //   });
  // }

  approve(row) {
    const ref = this._dialogService.open(
      FormNotificationComponent,
      {
        header: "Thông báo",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          title: "Bạn có muốn thay đổi trạng thái thông báo: " + row.title,
          icon: FormNotificationConst.IMAGE_APPROVE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        row.status = row.status == 'ACTIVE' ? "INACTIVE" : "ACTIVE";
        this.notificationService.saveNotificationTemplate(row).subscribe(result => {
          this.messageService.add({
            severity: 'success',
            summary: "Cập nhật trạng thái mẫu thông báo thành công",
            life: 3000,
          })
        }, err => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi cập nhật trạng thái mẫu thông báo",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        })
      }
    });
  }

}