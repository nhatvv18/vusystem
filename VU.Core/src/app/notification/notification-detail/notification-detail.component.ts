import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConsts, SendNotifySizeConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { AddPersonListComponent } from '../add-person-list/add-person-list.component';
import { decode } from 'html-entities';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent extends CrudComponentBase implements OnInit {

  currentNotificationId: any
  currentNotification: any;
  page = new Page()
  personListPage = new Page()

  isLoadingPersonList: boolean = false;
  isLoading: boolean = false;
  initLoading: boolean = false;

  selectedCustomers: any[] = [];
  filters: {
    pushAppStatus: any,
    sendEmailStatus: any,
    sendSMSStatus: any,
    sendNotifySize: any,
  }
  selectedHtmlMarkdown: any;
  htmlMarkdownOptions: any = [
    {
      value: 'MARKDOWN',
      name: 'MARKDOWN'
    },
    {
      value: 'HTML',
      name: 'HTML'
    }
  ];
  
  pushSMSStatus: any = [
    {
      value: 'DRAFT',
      name: 'Nháp'
    },
    {
      value: 'PENDING',
      name: 'Chờ gửi'
    },
    {
      value: 'SENT',
      name: 'Đã gửi'
    },
    {
      value: 'SEND_ERROR',
      name: 'Gửi lỗi'
    }
  ];

  SendNotifySizeConst = SendNotifySizeConst;

  selectedTopic: any;
  title: string;
  inputData: any;
  postForm: FormGroup;
  actions = [];
  statuses = [];
  topicList = [];
  mainImg: any;
  types: any[];
  checkDropdown: any;
  deleteArr: any;
  caretPos: number = 0;

  listOfReciever: any[] = [];
  baseUrl: string;
  notificationTemplates: any[] = [];

  typeList: any = {
    'kham_pha': "Trang khám phá",
    'dau_tu': 'Trang đầu tư',
    'tai_san': 'Trang tài sản'
  }

  positions = [];

  actionsList: any = {
    PUSH_NOTIFICATION: 'Đẩy thông báo trên app',
    SEND_SMS: 'Gửi SMS',
    SEND_EMAIL: 'Gửi email'
  }

  notificationAdd: any;

  constructor(private fb: FormBuilder,
    private notificationService: NotificationService,
    protected messageService: MessageService,
    public dialogService: DialogService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    injector: Injector,
    private route: ActivatedRoute

  ) {
    super(injector, messageService);
    this.statuses = [
      {
        value: 'ACTIVE',
        name: 'Hoạt động'
      },
      {
        value: 'INACTIVE',
        name: 'Không hoạt động'
      }
    ];

    this.filters = {
      pushAppStatus: null,
      sendEmailStatus: null,
      sendSMSStatus: null,
      sendNotifySize: SendNotifySizeConst.PAGE,
    }
    // this.approveId = +this.route.snapshot.paramMap.get('id');
    this.topicList = [
      {
        value: 'Thông báo nghỉ tết dương lịch',
        name: 'Thông báo nghỉ tết dương lịch'
      },
      {
        value: 'Thông báo nghỉ tết âm lịch',
        name: 'Thông báo nghỉ tết âm lịch'
      },
      {
        value: 'Thông báo nghỉ ngày quốc khánh 2/9',
        name: 'Thông báo nghỉ ngày quốc khánh 2/9'
      },
      {
        value: 'Thông báo nghỉ 30/4 - 1/5',
        name: 'Thông báo nghỉ 30/4 - 1/5'
      },
      {
        value: 'Thông báo nghỉ giỗ tổ Hùng Vương',
        name: 'Thông báo nghỉ giỗ tổ Hùng Vương'
      },
      {
        value: 'Thông báo nghỉ tết âm lịch',
        name: 'Thông báo nghỉ tết âm lịch'
      },
      {
        value: 'Thông báo chúc mừng sinh nhật',
        name: 'Thông báo chúc mừng sinh nhật'
      },
      {
        value: 'Thông báo chúc mừng 8/3',
        name: 'Thông báo chúc mừng 8/3'
      },
      {
        value: 'Thông báo chúc mừng 20/10 ',
        name: 'Thông báo chúc mừng 20/10 '
      },
      {
        value: 'Thông báo Chúc mừng năm mới',
        name: 'Thông báo Chúc mừng năm mới'
      },
      {
        value: 'Thông báo ngày gia đình Việt Nam',
        name: 'Thông báo ngày gia đình Việt Nam'
      },
    ];
  }

  ngOnInit() {
    this.initNotificationTemplate({ page: this.offset });

    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.selectedCustomers = []

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Quản lý thông báo', routerLink: ['/notification/notification-manager'] },
      { label: 'Chi tiết thông báo' }
    ]);

    this.types = [
      {
        type: 'HE_THONG',
        name: "Hệ thống"
      },
      {
        type: 'UU_DAI',
        name: "Ưu đãi"
      },
      {
        type: 'CHINH_SACH',
        name: "Khuyến mại"
      },
      {
        type: 'GIAO_DICH',
        name: "Giao dịch"
      },
    ];

    this.route.queryParamMap.subscribe((dataParams) => {
        if ((<any>dataParams).params.id) {
          this.initLoading = true;
          this.isLoadingPersonList = true;
          this.currentNotificationId = (<any>dataParams).params.id;

          this.notificationService.getNotificationDetail(this.currentNotificationId).subscribe(notification => {
              this.selectedTopic = notification.description;
              this.currentNotification = notification;
              this.mainImg = notification.mainImg;
              //
              this.postForm = this.fb.group({
                title: [notification.title, Validators.required],
                actions: [notification.actions, [Validators.required]],
                description: [notification.description, [Validators.required]],
                isFeatured: [notification.isFeatured, []],
                appNotificationDesc: [decode(notification.appNotificationDesc), [Validators.required]],
                notificationContent: [decode(notification.notificationContent), []],
                smsContent: [decode(notification.smsContent), []],
                emailContent: [decode(notification.emailContent), []],
                type: [notification.type, []],
                status: [notification.status, []],
                actionView: [notification.actionView, []],
                emailContentType: [notification.emailContentType, []],
                externalEvent: [notification.externalEvent, []],
                externalParams: [notification.externalParams, []],
                appNotifContentType: [notification.appNotifContentType, []],
              });
            }, err => {
              this.messageService.add({
                severity: 'error',
                summary: "Lỗi khi lấy thông tin thông báo",
                detail: "Vui lòng thử lại",
                life: 3000,
              })
          })

          this.setPersonList(this.personListPage);
        } else {
          this.currentNotificationId == null;
          this.checkDropdown == null;
          this.postForm = this.fb.group({
            title: ["", Validators.required],
            actions: ["", [Validators.required]],
            description: ["", [Validators.required]],
            isFeatured: [false, []],
            appNotificationDesc: ['', [Validators.required]],
            notificationContent: ['', []],
            smsContent: ['', []],
            emailContent: ['', []],
            type: ['HE_THONG', []],
            status: ['ACTIVE', []],
            actionView: ["", []],
            emailContentType: ["MARKDOWN", []],
            externalEvent: ["", []],
            externalParams: ["", []],
            appNotifContentType: ["HTML", []],
          });
        }
      });
    for (let key in this.actionsList) {
      this.actions.push({ key: key, value: this.actionsList[key] });
    }
  }

  initNotificationTemplate(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    this.notificationService.getAllNotificationTemplate(this.page).subscribe((res) => {
      this.page.totalItems = res.totalResults;
      this.notificationTemplates = res?.results;
      const listNotificationTemplates = this.notificationTemplates
      if (listNotificationTemplates?.length) {
        this.notificationTemplates = listNotificationTemplates.map(notification => {
          notification.id = notification.id;
          notification.labelName = notification.code + (notification.type ? ' - ' + notification.type : '') + (notification.title ? (' - ' + notification.title) : '');
          return notification;
        });
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  changeNotification(notificationTemplateId) {
    const notification = this.notificationTemplates.find(notificationTemplate => notificationTemplate.id == notificationTemplateId);
    this.mainImg = notification.mainImg;
    this.postForm = this.fb.group({
      title: [notification.title, Validators.required],
      actions: [notification.actions, [Validators.required]],
      description: [notification.description, [Validators.required]],
      isFeatured: [notification.isFeatured, []],
      appNotificationDesc: [decode(notification.appNotificationDesc), []],
      notificationContent: [decode(notification.notificationContent), []],
      smsContent: [decode(notification.smsContent), []],
      emailContent: [decode(notification.emailContent), []],
      type: [notification.type, []],
      status: [notification.status, []],
      actionView: [notification.actionView, []],
      emailContentType: [notification.contentType, []],
      externalEvent: [notification.externalEvent, []],
      externalParams: [notification.externalParams, []],
      appNotifContentType: ["HTML", []],
    });
  }

  get postFormControl() {
    return this.postForm?.controls;
  }

  newsMedia: any = {}

  header() {
    return this.title
  }

  selectImg() {
    const ref = this.dialogService.open(UploadImageComponent, {
      data: {
        inputData: []
      },
      header: 'Tải hình ảnh',
      width: '500px',
      footer: ""
    });
    ref.onClose.subscribe(images => {
      if (images && images.length > 0) {
        this.mainImg = images[0].data;
      }
    });
  }

  removeFile(file) {
    this.mainImg = null;
  }

  onSubmit() {
    if (this.postForm.valid) {
      if (this.currentNotification) {
        this.postForm.value.id = this.currentNotification.id;

        this.postForm.value.mainImg = this.mainImg;
        this.notificationService.saveNotification(this.postForm.value).subscribe((result) => {
          this.messageService.add({
            severity: 'success',
            summary: "Cập nhật thông báo thành công",
            life: 2000,
          })
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi cập nhật thông báo",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        })
      } else {
        this.postForm.value.mainImg = this.mainImg;
        this.notificationService.createNotification(this.postForm.value).subscribe((result) => {
          this.currentNotification = result;
          console.log(result);
          this.currentNotificationId = result.id;
          let id = this.currentNotificationId;
          this.messageService.add({
            severity: 'success',
            summary: "Tạo mới thông báo thành công",
            life: 2000,
          })
          setTimeout(() => {
            this.router.navigate(['/notification/notification-detail'], { queryParams: { id } });
        }, 100);
         
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi tạo thông báo",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        });
      }
      this.initNotificationTemplate();
    }
  }

  close() {
    if (confirm("Bạn có muốn huỷ thay đổi")) {
      this.router.navigate(['/notification/notification-manager']);
    }
  }

  insertImageEmailContent() {
    const ref = this.dialogService.open(UploadImageComponent, {
      data: {
        inputData: [],
        showOrder: false
      },
      header: 'Chèn hình ảnh',
      width: '600px',
      footer: ""
    });
    ref.onClose.subscribe(images => {
      let imagesUrl = "";

      console.log("đầu ra của ảnh", images);
      
      images.forEach(image => {
        imagesUrl += `![](${this.baseUrl}/${image.data}) \n`;
      })
      let oldEmailContentValue = this.postForm.value.emailContent;
      let a = oldEmailContentValue.slice(0, this.caretPos) + imagesUrl + oldEmailContentValue.slice(this.caretPos);
      this.postForm.controls['emailContent'].setValue(a);

    })
  }

  insertImageNotificationContent() {
    const ref = this.dialogService.open(UploadImageComponent, {
      data: {
        inputData: [],
        showOrder: false
      },
      header: 'Chèn hình ảnh',
      width: '600px',
      footer: ""
    });
    ref.onClose.subscribe(images => {
      let imagesUrl = "";

      console.log("đầu ra của ảnh", images);
      
      images.forEach(image => {
        imagesUrl += `![](${this.baseUrl}/${image.data}) \n`;
      })
      let oldNotificationContent = this.postForm.value.notificationContent;
      let b = oldNotificationContent.slice(0, this.caretPos) + imagesUrl + oldNotificationContent.slice(this.caretPos);
      this.postForm.controls['notificationContent'].setValue(b);
    })
  }

  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
      console.log("this.caretPos", this.caretPos);
    }
  }

  resetSendNotifySize() {
    this.filters.sendNotifySize =  SendNotifySizeConst.PAGE;
  }

  setPersonList(pageInfo?: any) {
    this.personListPage.pageNumber = pageInfo?.page ?? this.offset;
    this.personListPage.keyword = this.keyword;
    if (pageInfo?.rows) this.personListPage.pageSizeNotify = pageInfo?.rows;
    
    this.isLoadingPersonList = true;
    let filters = {
      'sendSMSStatus': this.filters.sendSMSStatus?.map(status => { return status.value }),
      'pushAppStatus': this.filters.pushAppStatus?.map(status => { return status.value }),
      'sendEmailStatus': this.filters.sendEmailStatus?.map(status => { return status.value }),
    }
    //
    this.notificationService.getPersonList(this.currentNotificationId, this.personListPage, filters).subscribe((res) => {
      this.personListPage.totalItems = res.totalResults;
      this.isLoadingPersonList = false;
      this.initLoading = false;
      this.listOfReciever = res.results;
    }, () => {
      this.isLoadingPersonList = false;
    });
  }

  toggleCheckboxAll(event) {
    console.log('eventCheckbox', event);
  }

  getStatusName(status) {
    let statusesWithLabel = {
      'DRAFT': "Nháp",
      'NOT_AVAILABLE': "N/A",
      'PENDING': "Đang chờ gửi",
      'SENT': "Đã gửi",
      'SENDING': "Đang gửi",
      'SEND_ERROR': "Gửi lỗi",
    }
    return statusesWithLabel[status];
  }

  getStatusSeverity(status) {
    let statusesWithLabel = {
      'DRAFT': "info",
      'NOT_AVAILABLE': "secondary",
      'PENDING': "info",
      'SENT': "success",
      'SENDING': "info",
      'SEND_ERROR': "danger",
    }
    return statusesWithLabel[status];
  }

  applyFilter() {
    this.setPersonList({ page: this.offset })
  }


  addPeopleToSendingList() {
    if (!this.currentNotification) {
      return this.messageService.add({
        severity: 'error',
        summary: "Vui lòng thử lại",
        detail: "Bạn cần phải lưu thông báo trước khi thiết lập danh sách gửi",
        life: 3000,
      })
    }

    this.dialogService.open(AddPersonListComponent, {
      data: {
        inputData: this.currentNotification
      },
      header: 'Cài đặt danh sách thông báo',
      width: '70%',
      footer: ""
    }).onClose.subscribe(result => {
      this.offset = 0;
      this.setPersonList({ page: this.offset });
    })
  }

  sendNotification() {
    if (this.selectedCustomers.length > 0) {
      this.isLoading = true;
      this.notificationService.pushNotification({
        notificationId: this.currentNotificationId,
        receivers: this.selectedCustomers
      }).subscribe(result => {
        this.isLoading = false;
        this.resetSendNotifySize();
        this.selectedCustomers = [];
        this.messageService.add({
          severity: 'success',
          summary: "Thiết lập gửi thông báo thành công.",
          detail: "Thông báo đã được đưa vào danh sách gửi.",
          life: 3000,
        });
        //
        this.peopleToSendingList();
        //
      }, err => {
        this.messageService.add({
          severity: 'error',
          summary: "Lỗi khi gửi thông báo",
          life: 3000,
        })
        this.isLoading = false;
      });
      //
      this.initNotificationTemplate();
      this.setPersonList();
    }
  }

  changeSendNotifySize(type) {
    let filters = {
      'sendSMSStatus': this.filters.sendSMSStatus?.map(status => { return status.value }),
      'pushAppStatus': this.filters.pushAppStatus?.map(status => { return status.value }),
      'sendEmailStatus': this.filters.sendEmailStatus?.map(status => { return status.value }),
    }
    //
    if(type == SendNotifySizeConst.FULL) {
      this.isLoadingPersonList = true;
      this.notificationService.getPersonList(this.currentNotificationId, this.personListPage, filters, true).subscribe((res) => {
        this.isLoadingPersonList = false;
        this.selectedCustomers = [...res.results];
      }, () => {
        this.isLoadingPersonList = false;
      });
    } else {
      this.resetSendNotifySize();
      this.selectedCustomers = [];
    }
  }

  peopleToSendingList() {
    let customers = this.selectedCustomers.map(customer => {
      return {
        fullName: customer.name,
        personCode: customer?.defaultIdentification?.id,
        phoneNumber: customer.phone,
        email: customer.email,
        notification: this.inputData?.id
      }
    });
    //
    if(this.inputData?.id) {
      this.isLoadingPersonList = false;
      this.notificationService.addPeopleToNotification({ sendingList: customers }, this.inputData.id).subscribe(results => {
          this.isLoadingPersonList = false;
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thành công', detail: 'Cập nhật danh sách người nhận thành công' });
          // this.ref.close(null); 
        }, error => {
          this.isLoadingPersonList = false;
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra. Vui lòng thử lại!' });
        });
      //
      this.initNotificationTemplate();
    }
  }

  deleteKH() {
    if (this.selectedCustomers.length > 0) {
      this.isLoading = true;
      const temp = [];
      Object.keys(this.selectedCustomers).forEach((key) => {
      })
      this.selectedCustomers.forEach((element1) => {
        if (element1.id) {
          temp.push(element1.id);
        }
      })
      this.deleteArr = temp.toString();

      this.notificationService.deleteKH(this.deleteArr).subscribe(result => {
        this.isLoading = false;
        this.selectedCustomers = [];
        this.messageService.add({
          severity: 'success',
          summary: "Xóa danh sách gửi thông báo thành công.",
          detail: "Thông báo đã được đưa vào danh sách hủy.",
          life: 3000,
        });
        //
        this.peopleToSendingList();
        //
        this.initNotificationTemplate();
        this.setPersonList();
      }, err => {
        this.messageError('Không thể xóa KH. Vui lòng thử lại sau!');
        this.isLoading = false;
      });
    }
  }

  moveToUserList() {
    let element = document.querySelector('#p-tabpanel-1-label');
    if (element != undefined) {
      (<HTMLElement>element).click();
    }
  }

  create() {
    window.location.href = 'notification/notification-manager';
  }

}
