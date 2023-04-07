import { Component, Injector, OnInit } from '@angular/core';
import { AppConsts, MediaNewsConst, MediaConst, SearchConst, FormNotificationConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { BroadcastService } from '@shared/service-proxies/broadcast-service';
import { SimpleModalService } from 'ngx-simple-modal';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { AddMediaComponent } from '../add-media/add-media.component';
import { debounceTime } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';
import {decode} from 'html-entities';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent extends CrudComponentBase implements OnInit {

  page = new Page()
  rows: any[] = [];
  MediaConst = MediaConst;
  MediaNewsConst = MediaNewsConst;
  showAddNewModel: Boolean
  addNewModelSubmitted: Boolean;
  newsMedia: any;
  uploadedFiles: any[] = []
  baseImgUrl: String;
  baseUrl: string;
  position: any;
  type: any;
  listAction:any[] = [];
  rowExcute:any[] = [];
  listFormatMedia: any[] = [];
  formatVideo: boolean;
  statusSearch = [
    {
      name: "Tất cả",
      code: ''
    },
    ...MediaNewsConst.statusList];
  positionSearch = [
    {
      name: "Tất cả",
      code: ''

    },
    ...MediaNewsConst.positionList];
  typeSearch = [
    {
      name: "Tất cả",
      code: ''
    },
    ...MediaNewsConst.typeList
  ];

  constructor(
    private broadcastService: BroadcastService,
    injector: Injector,
    messageService: MessageService,
    private _contractTemplateService: ContractTemplateServiceProxy,
    public dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private routeActive: ActivatedRoute,
    public _dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    super(injector, messageService);
    this.showAddNewModel = false;
    this.addNewModelSubmitted = false;
  }

  ngOnInit(): void {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Danh sách hình ảnh hiển thị' }
    ]);
  }

  genListAction(data = []) {
    this.listAction = data.map((item) => {
      const status = item?.approve?.status;

      const actions = [];

      if ( item?.status != MediaConst.ACTIVE && this.isGranted([this.PermissionCoreConst.CoreHinhAnh_CapNhat])) {
        actions.push({
          data: item,
          label: "Chỉnh sửa",
          icon: "pi pi-user-edit",
          command: ($event) => {
            this.edit($event.item.data);
          },
        });
      }

      if (this.isGranted([this.PermissionCoreConst.CoreHinhAnh_Xoa])) {
        actions.push({
          data: item,
          label: "Xoá",
          icon: "pi pi-trash",
          command: ($event) => {
            this.remove($event.item.data);
          },
        });
      }

      if (item?.status == MediaConst.ACTIVE && this.isGranted([this.PermissionCoreConst.CoreHinhAnh_PheDuyetDang])) {
        actions.push({
          data: item,
          label: "Bỏ duyệt đăng",
          icon: "pi pi-check-circle",
          command: ($event) => {
            this.approve($event.item.data);
          },
        });
      }
      
      if ((item?.status == MediaConst.TRINH_DUYET || item?.status == MediaConst.NHAP) && this.isGranted([this.PermissionCoreConst.CoreHinhAnh_PheDuyetDang])) {
        actions.push({
          data: item,
          label: "Duyệt đăng",
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
    this.setPage({ page: this.offset });
  }

  changeType() {
    this.setPage({ page: this.offset });
  }

  changePosition() {
    this.setPage({ page: this.offset });
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;

    this.page.keyword = this.keyword;
    this.isLoading = true;
    // this.page.pageSize = 20;
    this.broadcastService.getAllMedia(this.page, this.status, this.type, this.position).subscribe((res) => {
      this.page.totalItems = res.totalResults;
      this.rows = res.results.map(this.detectVideo);
      this.genListAction(this.rows);
      console.log("đầu ra phần tử", this.rows);
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      console.log('Error', err);
      
    });
  }

  setLengthStringInScreen(ratio) {
    return (this.screenWidth/ratio).toFixed();
  }

  detectVideo(row) {
    // console.log("Đầu ra khi đã decode xong",row.content);
    row.content = decode(row.content);
    console.log("Đầu ra khi đã decode xong",decode(row.content));

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

  genListFormatMedia(data = []) {
    this.listFormatMedia = data.map((item) => {
      const isVideo = false;
      if (item) {

      }
      const actions = [
        {
          data: item,
          label: "Thông tin chi tiết",
          icon: "pi pi-info-circle",
          command: ($event) => {
            console.log("check-check-check");
          },
        }
      ];
      return actions;
    });

  }

  create() {
    const ref = this.dialogService.open(AddMediaComponent, {
      data: {
        inputData: null
      },
      header: 'Thêm mới hình ảnh',
      width: '100%',
      style: {'max-height': '100%', 'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    }).onClose.subscribe(result => {
      if(result) {
        this.messageSuccess('Thêm mới thành công', '');
        this.offset = 0;
        this.setPage({ page: this.offset });
      }
    })
  }
  //
  edit(row) {
    console.log("đầu vào dữ liệu hiện tại là :", row);
    const ref = this.dialogService.open(AddMediaComponent, {
      data: {
        inputData: row,
        unDisableStatus: true
      },
      header: 'Chỉnh sửa hình ảnh',
      width: '100%',
      style: {'max-height': '100%', 'border-radius': '0px'},
      contentStyle: { "overflow": "auto", "margin-bottom": "60px" },
      baseZIndex: 10000,
      footer: ""
    }).onClose.subscribe((result) => {
      if(result) {
        this.messageSuccess('Cập nhật thành công', '');
        this.offset = 0;
        this.setPage({ page: this.offset });
      }
    })
  }
  //
  // remove(row) {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có muốn xoá hình ảnh?',
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       row.status = "DELETED";
  //     this.broadcastService.saveMedia(row).subscribe(res => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: "Xoá hình ảnh thành công",
  //         detail: "Hình ảnh đã được xoá thành công",
  //         life: 3000,
  //       })
  //       this.setPage({ page: 0 })
  //     }, err => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: "Xoá hình ảnh thất bại",
  //         detail: "Vui lòng thử lại",
  //         life: 3000,
  //       })
  //     })
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
          title: "Bạn có muốn xoá hình ảnh?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      }
    );
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });
      if (dataCallBack?.accept) {
        row.status = "DELETED";
        this.broadcastService.saveMedia(row).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: "Xoá hình ảnh thành công",
            detail: "Hình ảnh đã được xoá thành công",
            life: 3000,
          })
          this.setPage({ page: 0 })
        }, err => {
          this.messageService.add({
            severity: 'error',
            summary: "Xoá hình ảnh thất bại",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        })
      }
    });
  }

  // approve(row) {
  //   var message = "Bạn có muốn duyệt đăng hình ảnh?";
  //   if (row.status == 'ACTIVE') {
  //     message = "Bạn có muốn bỏ duyệt đăng hình ảnh?"
  //   }
  //   this.confirmationService.confirm({
  //     message: message,
  //     acceptLabel: "Đồng ý",
  //     rejectLabel: "Hủy",
  //     accept: () => {
  //       row.status = row.status == 'ACTIVE' ? 'PENDING' : 'ACTIVE';
  //     this.broadcastService.saveMedia(row).subscribe(res => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: row.status == 'PENDING' ? "Bỏ đăng thành công" : "Đăng hình ảnh thành công",
  //         detail: row.status == 'PENDING' ? "Bỏ đăng tin tức thành công" : "Đăng hình ảnh thành công",
  //         life: 3000,
  //       })
  //       this.setPage({ page: 0 })
  //     }, err => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: "Đăng hình ảnh thất bại",
  //         detail: "Vui lòng thử lại",
  //         life: 3000,
  //       })
  //     })
  //     }
  // });
  // }

  approve(row) {
    var message = "Bạn có muốn duyệt đăng hình ảnh?";
    if (row.status == 'ACTIVE') {
      message = "Bạn có muốn bỏ duyệt đăng hình ảnh?"
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
      this.broadcastService.saveMedia(row).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: row.status == 'PENDING' ? "Bỏ đăng thành công" : "Đăng hình ảnh thành công",
          detail: row.status == 'PENDING' ? "Bỏ đăng tin tức thành công" : "Đăng hình ảnh thành công",
          life: 3000,
        })
        this.setPage({ page: 0 })
      }, err => {
        this.messageService.add({
          severity: 'error',
          summary: "Đăng hình ảnh thất bại",
          detail: "Vui lòng thử lại",
          life: 3000,
        })
      })
      }
    });
  }
}
