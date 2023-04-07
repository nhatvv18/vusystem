import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { decode } from 'html-entities';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
@Component({
  selector: 'app-add-notification-template',
  templateUrl: './add-notification-template.component.html',
  styleUrls: ['./add-notification-template.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class AddNotificationTemplateComponent implements OnInit {
  
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
  ]
  selectedTopic: any;
  topicTest: any;
  title: string;
  inputData: any;
  postForm: FormGroup;
  actions = []
  statuses = []
  topicList = []
  mainImg: any;
  baseUrl: string;
  caretPos: number = 0;
   
  typeList: any = {
    'kham_pha': "Trang khám phá",
    'dau_tu': 'Trang đầu tư',
    'tai_san': 'Trang tài sản'
  }
  positions = [];
   
  actionsList: any = {
    PUSH_NOTIFICATION : 'Đẩy thông báo trên app',
    SEND_SMS: 'Gửi SMS',
    SEND_EMAIL: 'Gửi email'
  }

  constructor( private fb: FormBuilder,
    private notificationService: NotificationService,
    protected messageService: MessageService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
   
   ) {
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
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl; 
    if (this.config.data.inputData) {
      
      
      this.inputData = this.config.data.inputData;
      this.mainImg = this.inputData.mainImg;
      this.postForm = this.fb.group({
        title: [this.inputData.title, Validators.required],
        code: [this.inputData.code, [Validators.required]], 
        actions: [this.inputData.actions, [Validators.required]],
        description: [this.inputData.description, []],
        isFeatured: [this.inputData.isFeatured, []], 
        appNotificationDesc: [this.inputData.appNotificationDesc, [Validators.required]],
        notificationContent: [decode(this.inputData.notificationContent ), []],
        smsContent: [decode(this.inputData.smsContent ), []],
        emailContent: [decode(this.inputData.emailContent ), []],
        type: [this.inputData.type, []],
        status: [this.inputData.status, []],
        actionView: [this.inputData.actionView, []],
        contentType: [this.inputData.contentType, []],
        externalEvent: [this.inputData.externalEvent, []],
        externalParams: [this.inputData.externalParams, []],
      });
    } else {
      this.postForm = this.fb.group({
        title: ['', Validators.required],
        code: ['', [Validators.required]], 
        actions: ['', [Validators.required]],
        description: ['', []],
        isFeatured: [false, []], 
        appNotificationDesc: ['', [Validators.required]],
        notificationContent: ['', []],
        smsContent: ['', []],
        emailContent: ['', []],
        type: ['HE_THONG', []],
        status: ['ACTIVE', []],
        actionView: ["", []],
        contentType: ["MARKDOWN", []],
        externalEvent: ["", []],
        externalParams: ["", []],
      });

    
    }
    this.selectedTopic = this.inputData?.description;
    console.log("this.selectedTopic ",this.inputData );
 
    for (let key in this.actionsList) {
      this.actions.push({ key: key, value: this.actionsList[key] });
    } 
  } 
  get postFormControl() {
    return this.postForm.controls;
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
      if(images && images.length > 0) { 
        this.mainImg = images[0].data; 
      }
    });
  }
  removeFile(file) {
    this.mainImg = null;
  }

  onSubmit() {
    if (this.postForm.valid) {
      if (this.inputData) {
        this.postForm.value.mainImg = this.mainImg;
        this.postForm.value.id = this.inputData.id;

        this.postForm.value.mainImg = this.mainImg;
        this.notificationService.saveNotificationTemplate(this.postForm.value).subscribe((result) => {
            this.ref.close(result);
          
          }, () => {
            this.messageService.add({
              severity: 'error',
              summary: "Lỗi khi cập nhật mẫu thông báo",
              detail: "Vui lòng thử lại",
              life: 3000,
            })
          })
      } else { 
        this.postForm.value.mainImg = this.mainImg;
        this.notificationService.createNotificationTemplate(this.postForm.value).subscribe((result) => {
            this.ref.close(result);
          }, () => {
            this.messageService.add({
              severity: 'error',
              summary: "Lỗi khi tạo mẫu thông báo",
              detail: "Vui lòng thử lại",
              life: 3000,
            })
          });
      }
    }
  }
  close() { 
    this.ref.close();
  }

  insertImage() {
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
      images.forEach(image => {
        imagesUrl +=  `![](${this.baseUrl}/${image.data}) \n`;
      })
      console.log(imagesUrl)
      let oldEmailContentValue = this.postForm.value.emailContent;
      let a = oldEmailContentValue.slice(0, this.caretPos) + imagesUrl + oldEmailContentValue.slice(this.caretPos); 
      this.postForm.controls['emailContent'].setValue(a);
    })
  }

  insertImageApp() {
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
      images.forEach(image => {
        imagesUrl +=  `![](${this.baseUrl}/${image.data}) \n`;
      })
      console.log(imagesUrl)
      let oldAppContentValue = this.postForm.value.notificationContent;
      let a = oldAppContentValue.slice(0, this.caretPos) + imagesUrl + oldAppContentValue.slice(this.caretPos); 
      this.postForm.controls['notificationContent'].setValue(a);
    })
  }

  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
      console.log("this.caretPos",this.caretPos);
    }
  }
    
}
