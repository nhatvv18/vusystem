import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConsts, CollabContractConst, FormNotificationConst, SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { CollabContractService } from '@shared/service-proxies/collab-contract-service';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies-base';
import { AppUtilsService } from '@shared/services/utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-collab-contract-template',
  templateUrl: './collab-contract-template.component.html',
  styleUrls: ['./collab-contract-template.component.scss']
})
export class CollabContractTemplateComponent extends CrudComponentBase {
  
  constructor(
    injector: Injector,
    messageService: MessageService,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private _utilsService: AppUtilsService,
    private _collabContractService: CollabContractService,
    @Inject(API_BASE_URL) baseUrl?: string,
  ) {
    super(injector, messageService);
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Hợp đồng cộng tác' },
    ]);
  }

  ref: DynamicDialogRef;

  headerTitle: string;
  private baseUrl: string;
  tradingProviderId: string;
  modalDialog: boolean;
  modalDialogPDF: boolean;
  urlfilePDF: string = '';
  FormNotificationConst = FormNotificationConst;
  deleteItemDialog: boolean = false;
  deleteItemsDialog: boolean = false;
  rows: any[] = [];
  row: any;
  col: any;

  cols: any[];
  _selectedColumns: any[];
  banks: any[] = [];

  collabContract: any = {
    'tradingProviderId': 0,
    'title': null,
    'fileUrl': null,
    'type' : null
  };
  uploadedFiles: any[] = [];
  CollabContractConst = CollabContractConst;
  types: any[] = CollabContractConst.type;
  AppConsts = AppConsts;

  submitted: boolean;
  expandedRows = {};
  statuses: any[];
  listAction: any[] = [];

  //
  page = new Page();
  offset = 0;

  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];
  ngOnInit(): void {
    this.actions = [
      // {
      //     label: 'Sửa',
      //     icon: 'pi pi-pencil',
      //     acceptLabel: 'Đồng ý',
		  // 	  rejectLabel: 'Hủy',
      //     statusActive: [this.CollabContractConst.RESPONSE_TRUE],
      //     permission: this.isGranted([]),
      //     command: () => {
      //         this.edit();
      //     }
      // },
      // {
      //     label: 'Xóa',
      //     icon: 'pi pi-trash',
      //     acceptLabel: 'Đồng ý',
		  // 	  rejectLabel: 'Hủy',
      //     statusActive: [this.CollabContractConst.RESPONSE_TRUE],
      //     permission: this.isGranted([]),
      //     command: () => {
      //         this.delete();
      //     }
      // },
  ];
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    })
  }

  genListAction(data = []) {
		this.listAction = data.map(orderItem => {
			const actions = [];
	
			if (this.isGranted([this.PermissionCoreConst.CoreHDCT_Template_CapNhat])) {
			  actions.push({
          data: orderItem,
          label: 'Sửa',
          icon: 'pi pi-pencil',
          command: ($event) => {
            this.edit($event.item.data);
          }
				});
		  }	

      if (this.isGranted([this.PermissionCoreConst.CoreHDCT_Template_CapNhat])) {
				actions.push({
					data: orderItem,
					label: 'Test fill data word',
					icon: 'pi pi-download',
					command: ($event) => {
						this.downloadFileWord($event.item.data);
					}
				})
			}
			if (this.isGranted([this.PermissionCoreConst.CoreHDCT_Template_CapNhat])) {
				actions.push({
					data: orderItem,
					label: 'Test fill data pdf',
					icon: 'pi pi-download',
					command: ($event) => {
						this.downloadFilePdf($event.item.data);
					}
				})
			}
      
      if (this.isGranted([this.PermissionCoreConst.CoreHDCT_Template_Xoa])) {
			  actions.push({
				  data: orderItem,
				  label: 'Xóa',
				  icon: 'pi pi-trash',
				  command: ($event) => {
					this.delete($event.item.data);
				  }
        });
		  }	

			return actions;
		});
	}

  downloadFileWord(contractTemplate) {
    this._collabContractService.downloadContractTemplateWord(contractTemplate.tradingProviderId, contractTemplate.id).subscribe((res) => {
        console.log(res);
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, '')) {
            console.log({ "Tải xuống": res });
        }
    }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
    });
}

downloadFilePdf(contractTemplate) {
    this._collabContractService.downloadContractTemplatePdf(contractTemplate.tradingProviderId, contractTemplate.id).subscribe((res) => {
        console.log(res);
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, '')) {
            console.log({ "Tải xuống": res });
        }
    }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
    });
}
  resetContractTemplateObject() {
    this.collabContract = {
      id: 0,
      title: null,
      fileUrl: null,
      tradingProviderId: +this.tradingProviderId,
    };
  }

  clickDropdown(row) {
    this.actionsDisplay = [];
    this.collabContract = {...row};
    console.log('file', row);
    
    this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(row.status) && action.permission);
  }

  create() {
    this.resetContractTemplateObject();
    this.submitted = false;
    this.modalDialog = true;
    this.headerTitle = 'Thêm mới';
  }

  confirmDelete(collabContract) {
    this.deleteItemDialog = false;
    this._collabContractService.delete(collabContract.id).subscribe(
      (response) => {
        if (this.handleResponseInterceptor(response, "Xóa thành công")) {
          this.setPage({ offset: this.page.pageNumber });
          this.resetContractTemplateObject();
        }
      },
      () => {
        this.messageService.add({
          severity: "error",
          summary: "",
          detail: `Không xóa được hồ sơ`,
          life: 3000,
        });
      }
    );
  }

  edit(collabContract) {
    this.collabContract = {
      ...collabContract
    }
    this.modalDialog = true;
    this.headerTitle = 'Cập nhật';
}

  changeContractType(value) {
    if (value) {
      this.setPage({ page: this.offset });
    }
  }

  // delete(collabContract) {
  //   this.confirmationService.confirm({
  //     message: 'Bạn có chắc chắn xóa mẫu hợp đồng cộng tác này?',
  //     header: 'Xóa hồ sơ',
  //     icon: 'pi pi-exclamation-triangle',
  //     acceptLabel: 'Đồng ý',
	// 		rejectLabel: 'Hủy',
  //     accept: () => {
  //         this._collabContractService.delete(collabContract.id).subscribe((response) => {
  //             if (this.handleResponseInterceptor(response, "Xóa thành công")) {
  //                 // this.messageService.add({ severity: 'success', summary: '', detail: '', life: 1500 });
  //                 this.setPage();
  //             }
  //         });
  //     },
  //     reject: () => {

  //     },
  // });
  // }

  delete(collabContract) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Thông báo",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa mẫu hợp đồng cộng tác này?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
        this._collabContractService.delete(collabContract.id).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Xóa mẫu hợp đồng cộng tác thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }


  setPage(collabContract?: any) {
    this.page.pageNumber = collabContract?.page ?? this.offset;
    if(collabContract?.rows) this.page.pageSize = collabContract?.rows;

    this.page.keyword = this.keyword;
    this.isLoading = true;

    this._collabContractService.getAll(this.page, this.status).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data.totalItems;
        this.rows = res.data.items;
        this.genListAction(this.rows);
        console.log({ rows: res.data.items, totalItems: res.data.totalItems });
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  hideDialog() {
    this.modalDialog = false;
    this.submitted = false;
    this.modalDialogPDF = false;
  }

  save() {
    this.submitted = true;
    console.log('collabContract', this.collabContract);

    if (this.collabContract.id) {
      this._collabContractService.update(this.collabContract).subscribe((response) => {
        if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
          this.submitted = false;
          this.setPage({ page: this.page.pageNumber });
          this.hideDialog();
        } else {
          this.submitted = false;
        }
      },
        () => {
          this.submitted = false;
        }
      );
    } else {
      this._collabContractService.create(this.collabContract).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, "Thêm thành công")) {
            this.submitted = false;
            this.setPage();
            this.hideDialog();
          } else {
            this.submitted = false;
          }
        },
        () => {
          this.submitted = false;
        }
      );
    }
  }

  validForm(): boolean {
    return this.collabContract?.fileUrl?.trim() && this.collabContract?.title?.trim()&& this.collabContract?.type?.trim();
  }

  myUploader(event) {
    if (event?.files[0]) {
      this._collabContractService.uploadFileGetUrl(event?.files[0], "collabContract").subscribe(
        (response) => {
          console.log({
            response,
          });
          if (response?.code === 0) {
            switch (response?.status) {
              case 200:
                break;
              case 0:
                this.messageError(response?.message || "");
                break;
              default:
                this.messageError("Có sự cố khi upload!");
                break;
            }
          } else if (response?.code === 200) {
            this.collabContract.fileUrl = response.data;
          }
        },
        (err) => {
          this.messageError("Có sự cố khi upload!");
        }
      );
    }
  }

  downloadFile(fileUrl) {
    const url = this.baseUrl + "/" + fileUrl;
    this._utilsService.makeDownload("", url);
    
  }

  viewFile(fileUrl) {
    const url = this.AppConsts.redicrectHrefOpenDocs + this.baseUrl + '/' + fileUrl;
    this.urlfilePDF = this.baseUrl + '/' + fileUrl;
    if(!fileUrl){
        this.messageError("Không có file hồ sơ", "")
    }else{
        if(this.utils.isPdfFile(fileUrl)){
            console.log('file truyen', this.urlfilePDF);
            this.modalDialogPDF = true;
        } else {
            this.messageError("Hệ thống hiện tại chỉ hỗ trợ xem file PDF", "")
        }
    }
  }

}
