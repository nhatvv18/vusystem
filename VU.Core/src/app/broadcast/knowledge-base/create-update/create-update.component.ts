import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AppConsts, MediaConst } from '@shared/AppConsts'; 
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BroadcastService } from '@shared/service-proxies/broadcast-service';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadImageComponent } from 'src/app/components/upload-image/upload-image.component';
import { decode } from 'html-entities';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss']
})
export class CreateUpdateComponent implements OnInit {

  title: string;
  inputData: any;
  postForm: FormGroup;
  categories: any = []
  statuses: any = []
  imageFile: string = ""
  caretPos: number = 0;
  disableStatus: boolean = true;
  formatVideo:boolean;
  formatImage:boolean;
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
  baseUrl: string;

  constructor(
    private fb: FormBuilder,
    private broadcastService: BroadcastService,
    protected messageService: MessageService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private _contractTemplateService: ContractTemplateServiceProxy) {
    
  }

  ngOnInit() {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl; 
    if (this.config.data.inputData) {
      this.inputData = this.config.data.inputData;
      this.postForm = this.fb.group({
        title: [this.inputData.title, Validators.required],
        content: [decode(this.inputData.content), [Validators.required]],
        category: [this.inputData.category, [Validators.required]],
        contentType: [this.inputData.contentType, [Validators.required]],
        status: [this.inputData.status, []],
        displayText: [this.inputData.displayText, []],
        isFeatured: [this.inputData.isFeatured || false, []]
      });
      this.imageFile = this.inputData.mainImg;
      this.detectVideo();      

    } else {
      this.postForm = this.fb.group({
        title: ['', Validators.required],
        content: ['', [Validators.required]],
        contentType: ['MARKDOWN', [Validators.required]],
        category: ['FINANCE', [Validators.required]],
        status: ['DRAFT', []],
        displayText: ['', []],
        isFeatured: [false, []]
      });
    }

    // undisable chuc nang select status trong edit
    if (this.config.data.unDisableStatus) {
      this.disableStatus = false;
    }

    this.detectVideo();

    this.categories = [
      {
        key: 'FINANCE',
        value: 'Tài chính cá nhân'
      },
      {
        key: 'TRENDING',
        value: 'Xu hướng'
      },
      {
        key: 'INVESTMENT',
        value: 'Đầu tư'
      },
      {
        key: 'CAM_NANG',
        value: 'Cẩm nang'
      },
      {
        key: 'BAO_MAT',
        value: 'Bảo mật'
      },
      {
        key: 'QUY_TRINH_XU_LY',
        value: 'Quy trình xử lý'
      } 
    ]
    
    for (let key in MediaConst.mediaStatus) {
      this.statuses.push({ key: key, value: MediaConst.mediaStatus[key] });
    }
  }

  get postFormControl() {
    return this.postForm.controls;
  }

  newsMedia: any = {}
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'strikeThrough',
        'subscript',
        'superscript',
        'heading',
        'fontName'
      ],
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  header() {
    return this.title
  }
  detectVideo() {
    const images = ["jpg", "gif", "png"]
    let videos = ["mp4", "3gp", "ogg", "mkv"]
    for (var i = 0; i < videos.length; i++) {

      let position = this.imageFile.search(videos[i])
      console.log("position ", position);
      
      if (this.imageFile.search(videos[i]) > -1) {
        this.formatVideo = true;
        this.formatImage = false;
        break;
      }
      
      if(this.imageFile.search(images[i]) > -1){
        this.formatImage = true;
        this.formatVideo = false;

        break;
      }
    }
  }
  selectImg() {
    const ref = this.dialogService.open(UploadImageComponent, {
      data: {
        inputData: [this.imageFile]
      },
      header: 'Tải hình ảnh',
      width: '500px',
      footer: ""
    });
    ref.onClose.subscribe(images => { 
      if(images && images.length > 0)
        this.imageFile = images[0].data;
        this.detectVideo();

    });
  }


  onSubmit() {
    if (this.postForm.valid) {
      console.log(this.postForm.value)
      if (this.inputData) {
        this.postForm.value.mainImg = this.imageFile;
        this.postForm.value.id = this.inputData.id;
        console.log(this.postForm.value);
        this.broadcastService.saveKnowledgeBase(this.postForm.value).subscribe((result) => {
          this.ref.close(result);
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi tạo kiến thức đầu tư",
            detail: "Vui lòng thử lại",
            life: 3000,
          })
        })
      } else {
        this.postForm.value.mainImg = this.imageFile;

        console.log(this.postForm.value);
        this.broadcastService.createKnowledgeBase(this.postForm.value).subscribe((result) => {
          this.ref.close(result);
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: "Lỗi khi tạo kiến thức đầu tư",
            detail: "Vui lòng thử lại",
            life: 3000,
          });
        })
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
    
      let oldContentValue = this.postForm.value.content;
      let a = oldContentValue.slice(0, this.caretPos) + imagesUrl + oldContentValue.slice(this.caretPos); 
      this.postForm.controls['content'].setValue(a);
       
    })
  }
  getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
      console.log("this.caretPos",this.caretPos);
    }
  }
}
