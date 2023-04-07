import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts, FormNotificationConst, NotificationTemplateConst } from '@shared/AppConsts';
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
  selector: 'app-notification-manager',
  templateUrl: './notification-manager.component.html',
  styleUrls: ['./notification-manager.component.scss']
})
export class NotificationManagerComponent extends CrudComponentBase implements OnInit {

  page = new Page()
  rows: any[] = [];
  actions: any[];
  currentActionData: any;
  baseUrl: string;
  notificationTemplates: [] = [];
  listAction: any[] = [];
  constructor(
    injector: Injector,
    messageService: MessageService,
    public dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private confirmationService: ConfirmationService,
    public _dialogService: DialogService,
    private notificationService: NotificationService) {
    super(injector, messageService);
    this.isLoading = false;
    this.rows = [];
    this.page = new Page();
  }

  ngOnInit(): void {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.setPage({ page: this.offset });
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Quản lý thông báo' }
    ]);

    this.actions = [
      {
        label: "Chi tiết thông báo",
        icon: "pi pi-info-circle",
        permission: this.isGranted([]),
        command: () => {
          this.notificationDetail();
        },
      },
      {
        label: "Xoá thông báo",
        icon: "pi pi-trash",
        permission: this.isGranted([]),
        command: () => {
          this.deleteNotification();
        },
      }
    ]
  }

  genListAction(data = []) {
    this.listAction = data.map((item) => {
      const status = item?.approve?.status;

      const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreQLTB_PageChiTiet])) {
        actions.push({
          data: item,
          label: "Chi tiết thông báo",
          icon: "pi pi-info-circle",
          command: ($event) => {
            this.notificationDetail();
          },
        });
      }

      if (this.isGranted([this.PermissionCoreConst.CoreQLTB_Xoa])) {
        actions.push({
          data: item,
          label: "Xoá",
          icon: "pi pi-trash",
          command: ($event) => {
            this.deleteNotification();
          },
        });
      }

      if (item?.status == NotificationTemplateConst.KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreQLTB_KichHoatOrHuy])) {
        actions.push({
          data: item,
          label: "Huỷ kích hoạt",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }

      if (item?.status == NotificationTemplateConst.HUY_KICH_HOAT && this.isGranted([this.PermissionCoreConst.CoreQLTB_KichHoatOrHuy])) {
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

  notificationDetail() {
    let id = this.currentActionData.id;
    console.log(this.currentActionData)
    this.router.navigate(['/notification/notification-detail'], { queryParams: { id } });
  }
  // deleteNotification() {
  //   this.confirmationService.confirm({
  //     message: "Bạn có muốn xoá thông báo: " + this.currentActionData.title,
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       this.notificationService.deleteNotification(this.currentActionData.id).subscribe(result => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: "Xoá thông báo thành công",
  //           detail: "",
  //           life: 3000,
  //         })
  //         this.setPage({ page: this.offset });
  //       }, err => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: "Lỗi khi xoá thông báo",
  //           detail: "Vui lòng thử lại",
  //           life: 3000,
  //         })

  //       })
  //     }
  //   });
  // }


  deleteNotification() {
    const ref = this._dialogService.open(
      FormNotificationComponent,
      {
        header: "Thông báo",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          title: "Bạn có muốn xoá thông báo: " + this.currentActionData.title,
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        this.notificationService.deleteNotification(this.currentActionData.id).subscribe(result => {
          this.messageService.add({
            severity: 'success',
            summary: "Xoá thông báo thành công",
            detail: "",
            life: 3000,
          })
          this.setPage({ page: this.offset });
        }, err => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi xoá thông báo",
            detail: "Vui lòng thử lại",
            life: 3000,
          })

        })
      }
    });
  }

  initNotificationTemplate(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    // this.page.pageSize = 20;
    this.notificationService.getAllNotificationTemplate(this.page).subscribe((res) => {
      this.page.totalItems = res.totalResults;
      this.notificationTemplates = res.results;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  clickDropdown(row) {
    this.currentActionData = row;
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    // this.page.pageSize = 20;
    this.notificationService.getAll(this.page).subscribe((res) => {
      this.isLoading = false;
      this.page.totalItems = res.totalResults;
      this.rows = res.results.map((row) => {
        row.content = decode(row.content);
        row.emailContent = decode(row.emailContent);
        row.smsContent = decode(row.smsContent);
        row.notificationContent = decode(row.notificationContent);
        return { ...row }
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
    this.router.navigate(['/notification/notification-detail']);
  }

  edit(row) {
    let modal = this.dialogService.open(AddNotificationTemplateComponent, {
      data: {
        inputData: row
      },
      header: 'Chỉnh sửa mẫu thông báo',
      width: '800px',
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

  // approve(row) {
  //   if (confirm("Bạn có muốn thay đổi trạng thái thông báo: " + row.title)) {
  //     row.status = row.status == 'ACTIVE' ? "INACTIVE" : "ACTIVE";
  //     this.notificationService.saveNotification(row).subscribe(result => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: "Cập nhật trạng thái mẫu thông báo thành công",
  //         life: 3000,
  //       })
  //     }, err => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: "Lỗi khi cập nhật trạng thái mẫu thông báo",
  //         detail: "Vui lòng thử lại",
  //         life: 3000,
  //       })
  //     })
  //   }
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
