import { Component, Injector, OnInit } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { BroadcastService } from '@shared/service-proxies/broadcast-service';
import { MessageService } from 'primeng/api';
import { AppConsts, MediaNewsConst, MediaConst, FormNotificationConst } from '@shared/AppConsts';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { SimpleModalService } from 'ngx-simple-modal';
import { AddNewsComponent } from './add-news/add-news.component';
import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import {decode} from 'html-entities';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';

@Component({
  selector: 'app-broadcast-news',
  templateUrl: './broadcast-news.component.html',
  styleUrls: ['./broadcast-news.component.scss']
})
export class BroadcastNewsComponent extends CrudComponentBase implements OnInit {

  page = new Page()
  rows: any[] = [];
  MediaConst = MediaConst;
  showAddNewModel: Boolean
  addNewModelSubmitted: Boolean;
  newsMedia: any;
  uploadedFiles: any[] = []
  baseImgUrl: String;
  baseUrl: string;
  listAction:any [] = []
  statusSearch: any[] = [
    {
      name: "Tất cả",
      code: ''
    },

    ...MediaNewsConst.statusList
  ]
  constructor(
    private broadcastService: BroadcastService,
    injector: Injector,
    messageService: MessageService,
    private _contractTemplateService: ContractTemplateServiceProxy,
    public dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private confirmationService: ConfirmationService,
    private _dialogService: DialogService,
  ) {
    super(injector, messageService);
    this.showAddNewModel = false;
    this.addNewModelSubmitted = false;
  }

  ngOnInit(): void {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.setPage({ page: this.offset });
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Danh sách tin tức' }
    ]);

  }

  changeStatus() {
    this.setPage({ page: this.offset })
  }

  setLengthStringInScreen(ratio) {
    return (this.screenWidth/ratio).toFixed();
  }
  
  create() {
    let modal = this.dialogService.open(AddNewsComponent, {
      data: {
        inputData: null
      },
      header: 'Thêm mới tin tức',
      width: '100%',
      style: {'max-height': '100%', 'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    })
    modal.onClose.subscribe(result => {
      if(result) {
        this.messageSuccess('Thêm thành công', '');
        this.offset = 0;
        this.setPage({ page: this.offset });
      }
    })
  }

  genListAction(data = []) {
		this.listAction = data.map((item) => {
			const status = item?.approve?.status;

			const actions = [];

      if ((item?.status == MediaConst.NHAP || item?.status == MediaConst.TRINH_DUYET) && this.isGranted([this.PermissionCoreConst.CoreTinTuc_CapNhat])) {
        actions.push({
					data: item,
					label: "Chỉnh sửa",
					icon: "pi pi-user-edit",
					command: ($event) => {
						this.edit($event.item.data);
					},
				});
      }

      if (item?.status == MediaConst.NHAP && this.isGranted([this.PermissionCoreConst.CoreTinTuc_Xoa])) {
        actions.push({
					data: item,
					label: "Xoá",
					icon: "pi pi-trash",
					command: ($event) => {
						this.remove($event.item.data);
					},
				});
      }
          
      if ((item?.status == MediaConst.NHAP || item?.status == MediaConst.TRINH_DUYET) && this.isGranted([this.PermissionCoreConst.CoreTinTuc_PheDuyetDang])) {
        actions.push({
          data: item,
          label: "Duyệt đăng",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }

      if (item?.status == MediaConst.ACTIVE && this.isGranted([this.PermissionCoreConst.CoreTinTuc_PheDuyetDang])) {
        actions.push({
          data: item,
          label: "Bỏ duyệt đăng",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }

			return actions;
		});
	}

  detectVideo(row) {
    row.content = decode(row.content);
    if (row.mainImg) {
      var isVideo = false;
      const images = ["jpg", "gif", "png"]
      let videos = ["mp4", "3gp", "ogg", "mkv"]
      for (var i = 0; i < videos.length; i++) {
        if (row.mainImg.search(videos[i]) > -1) {
          isVideo = true;
          break;
        }
      }
    }
    return { ...row, isVideo }
  }

  setPage(pageInfo?: any) {

    this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;

    this.page.keyword = this.keyword;
    this.isLoading = true;
    // this.page.pageSize = 20;
    this.broadcastService.getAll(this.page, this.status).subscribe((res) => {
      this.isLoading = false;
      this.page.totalItems = res.totalResults;
      this.rows = res.results.map(this.detectVideo);
      this.genListAction(this.rows);
      console.log("đầu ra của get all : ", this.rows);
      
      console.log("res", this.page.totalItems);

    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  hideDialog() {
    this.showAddNewModel = false;
    this.addNewModelSubmitted = false;
  }

  getTypes() {
    let keys: any = [];
    for (let key in MediaConst.newsTypes) {
      keys.push({ key: key, value: MediaConst.newsTypes[key] });
    }
    return keys;
  }

  getStatus() {
    let keys: any = [];
    for (let key in MediaConst.mediaStatus) {
      keys.push({ key: key, value: MediaConst.mediaStatus[key] });
    }
    return keys;
  }

  header() {
    return "Thêm mới tin tức"
  }


  save() {
    console.log(this.newsMedia);
  }

  edit(row) {
    let modal = this.dialogService.open(AddNewsComponent, {
      data: {
        inputData: row,
        unDisableStatus: true
      },
      header: 'Sửa tin tức',
      width: '100%',
      style: { 'max-height': '100%', 'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    })
    modal.onClose.subscribe(result => {
      if(result) {
        this.messageSuccess('Cập nhật thành công', '');
        this.offset = 0;
        this.setPage({ page: this.offset });
      }
    })
  }

  // remove(row) {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có muốn xoá tin tức?',
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       row.status = "DELETED";
  //      this.broadcastService.saveNews(row).subscribe(res => {
  //        this.messageService.add({
  //          severity: 'success',
  //          summary: "Xoá tin tức thành công",
  //          detail: "Tin tức đã được xoá thành công",
  //          life: 3000,
  //        })
  //        this.setPage({ page: 0 })
  //      }, err => {
  //        this.messageService.add({
  //          severity: 'error',
  //          summary: "Xoá tin tức thất bại",
  //          detail: "Vui lòng thử lại",
  //          life: 3000,
  //        })
  //      })
  //     }
  // });
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
          title: "Bạn có muốn xoá tin tức?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        row.status = "DELETED";
       this.broadcastService.saveNews(row).subscribe(res => {
         this.messageService.add({
           severity: 'success',
           summary: "Xoá tin tức thành công",
           detail: "Tin tức đã được xoá thành công",
           life: 3000,
         })
         this.setPage({ page: 0 })
       }, err => {
         this.messageService.add({
           severity: 'error',
           summary: "Xoá tin tức thất bại",
           detail: "Vui lòng thử lại",
           life: 3000,
         })
       })
      }
    });
  }


  // approve(row) {
  //   var message = "Bạn có muốn duyệt đăng tin tức?";
  //   if (row.status == 'ACTIVE') {
  //     message = "Bạn có muốn bỏ duyệt đăng tin tức?"
  //   }
  //   this.confirmationService.confirm({
  //     message: message,
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       row.status = row.status == 'ACTIVE' ? 'PENDING' : 'ACTIVE';
  //         this.broadcastService.saveNews(row).subscribe(res => {
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: row.status == 'PENDING' ? "Bỏ đăng thành công" : "Đăng tin tức thành công",
  //             detail: row.status == 'PENDING' ? "Bỏ đăng tin tức thành công" : "Đăng tin tức thành công",
  //             life: 3000,
  //           })
  //           this.setPage({ page: 0 })
  //         }, err => {
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: "Đăng tin tức thất bại",
  //             detail: "Vui lòng thử lại",
  //             life: 3000,
  //           })
  //         })
  //     }
  // });
  // }

  approve(row) {
    var message = "Bạn có muốn duyệt đăng tin tức?";
    if (row.status == 'ACTIVE') {
      message = "Bạn có muốn bỏ duyệt đăng tin tức?"
    }
    const ref = this._dialogService.open(
      FormNotificationComponent,
      {
        header: "Thông báo",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          title: message,
          icon: FormNotificationConst.IMAGE_APPROVE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        row.status = row.status == 'ACTIVE' ? 'PENDING' : 'ACTIVE';
          this.broadcastService.saveNews(row).subscribe(res => {
            this.messageService.add({
              severity: 'success',
              summary: row.status == 'PENDING' ? "Bỏ đăng thành công" : "Đăng tin tức thành công",
              detail: row.status == 'PENDING' ? "Bỏ đăng tin tức thành công" : "Đăng tin tức thành công",
              life: 3000,
            })
            this.setPage({ page: 0 })
          }, err => {
            this.messageService.add({
              severity: 'error',
              summary: "Đăng tin tức thất bại",
              detail: "Vui lòng thử lại",
              life: 3000,
            })
          })
      }
    });
  }
}

