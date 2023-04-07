import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { decode } from 'html-entities';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit {

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
  title: string;
  inputData: any;
  postForm: FormGroup;
  actions = []
  statuses = []
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
    private dialogService: DialogService
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
    ]
   } 

   ngOnInit() { 
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl; 
    if (false) {
      this.mainImg = this.inputData.mainImg;
      this.postForm = this.fb.group({
        title: [this.inputData.title, Validators.required],
        code: [this.inputData.code, [Validators.required]], 
        actions: [this.inputData.actions, [Validators.required]],
        description: [this.inputData.description,  [Validators.required]],
        isFeatured: [this.inputData.isFeatured, []], 
        notificationContent: [decode(this.inputData.notificationContent), []],
        smsContent: [decode(this.inputData.smsContent), []],
        emailContent: [decode(this.inputData.emailContent), []],
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
        description: ['', Validators.required],
        isFeatured: [false, []], 
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
  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
      console.log("this.caretPos",this.caretPos);
    }
  }

}
