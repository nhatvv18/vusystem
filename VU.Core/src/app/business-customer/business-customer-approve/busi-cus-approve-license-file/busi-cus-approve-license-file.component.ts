import { Component, Inject, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StatusBondInfoFileConst, ContractTypeConst, SearchConst, AppConsts, PermissionCoreConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { ContractTemplateServiceProxy, DistributionContractFileServiceProxy, ProductBondInfoFileServiceProxy } from "@shared/service-proxies/bond-manager-service";
import { BusinessCustomerServiceProxy } from "@shared/service-proxies/business-customer-service";
import { API_BASE_URL } from "@shared/service-proxies/service-proxies-base";
import { AppUtilsService } from "@shared/services/utils.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";

@Component({
  selector: 'app-busi-cus-approve-license-file',
  templateUrl: './busi-cus-approve-license-file.component.html',
  styleUrls: ['./busi-cus-approve-license-file.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class BusiCusApproveLicenseFileComponent extends CrudComponentBase {

    constructor(
        injector: Injector,
        messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _contractTemplateService: ContractTemplateServiceProxy,
        private _productBondInfoFile: ProductBondInfoFileServiceProxy,
        private _utilsService: AppUtilsService,
        private routeActive: ActivatedRoute,
        private dialogService: DialogService,
        private _businessCustomerService: BusinessCustomerServiceProxy,
        @Inject(API_BASE_URL) baseUrl?: string,
    ) {
        super(injector, messageService);
        this.businessCustomerId = this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    private baseUrl: string;

    businessCustomerId: any;

    AppConsts = AppConsts;

    uploadedFiles: any[] = [];
    contractTypeId: number = -1;
    contractTypes: any[] = [...ContractTypeConst.list];
    contractTypesSearch: any[] = [
        {
            code: -1,
            name: "Chọn tất cả",
        },
        ...ContractTypeConst.list,
    ];
    modalDialog: boolean;
    modalDialogPDF: boolean;

    deleteItemDialog: boolean = false;

    StatusBondInfoFileConst = StatusBondInfoFileConst;

    rows: any[] = [];
    listAction: any[] = [];
    urlfilePDF:string = '';


    contractFile: any = {
        'juridicalFileId': 0,
        'title': null,
        'url': null,
        'businessCustomerTempId': 0,
    };

    submitted: boolean;

    actions: any[] = [];
    actionsDisplay: any[] = [];

    ngOnInit() {
        this.setPage();
       console.log("PermissionCoreConst.DuyetCoreKHDN_DKKD_ThemMoi",PermissionCoreConst.CoreDuyetKHDN_DKKD_ThemMoi);
       
    }

    genListAction(data = []) {
        this.listAction = data.map(item => {
            const actions = [];

            if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_DKKD_XemFile])) {
                actions.push({
                    data: item,
                    label: 'Xem file',
                    icon: 'pi pi-eye',
                    command: ($event) => {
                        this.viewFile($event.item.data);
                    }
                })
            }

            if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_DKKD_TaiFile])) {
                actions.push({
                    data: item,
                    label: 'Tải file',
                    icon: 'pi pi-download',
                    command: ($event) => {
                        this.downloadFile($event.item.data)
                    }
                })
            }

            if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_DKKD_CapNhat])) {
                actions.push({
                    data: item,
                    label: 'Sửa',
                    icon: 'pi pi-pencil',
                    command: ($event) => {
                        this.edit($event.item.data);
                    }
                })
            }

            if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_DKKD_XoaFile])) {
                actions.push({
                    data: item,
                    label: 'Xóa file',
                    icon: 'pi pi-trash',
                    command: ($event) => {
                        this.delete($event.item.data)
                        console.log('vafo chua',$event.item.data)
                    }
                })
            }

            return actions;
        });
    }

    edit(businessCustomerFile) {
        console.log("businessCustomerFile",businessCustomerFile);
        
        this.contractFile = { ...businessCustomerFile };
        this.submitted = false;
        this.modalDialog = true;
    }

    header(): string {
        return !this.contractFile?.id ? 'Thêm giấy phép ĐKKD' : 'Sửa giấy phép ĐKKD';
    }

    resetContractTemplateObject() {
        this.contractFile = {
            id: 0,
            title: null,
            url: null,
            businessCustomerTempId: +this.businessCustomerId,
        };
    }

    clickDropdown(row) {
        this.actionsDisplay = [];
        this.contractFile = { ...row };
        console.log({ distributionContractPayment: row });
        this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(+row.status) && action.permission);
    }

    create() {
        this.resetContractTemplateObject();
        this.submitted = false;
        this.modalDialog = true;
    }

    confirmDelete() {
        this.deleteItemDialog = false;
        this._contractTemplateService.delete(this.contractFile.id).subscribe(
            (response) => {
                if (this.handleResponseInterceptor(response, "Xóa thành công")) {
                    this.setPage();
                    this.resetContractTemplateObject();
                }
            },
            () => {
                this.messageService.add({
                    severity: "error",
                    summary: "",
                    detail: `Không xóa được hồ sơ ${this.contractFile.displayName}`,
                    life: 3000,
                });
            }
        );
    }

    changeContractType(value) {
        if (value) {
            this.setPage();
        }
    }

    setPage() {
        this.isLoading = true;

        this._businessCustomerService.getAllBusiCusLicenseFileTemp(this.businessCustomerId).subscribe(
            (res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, "")) {
                    this.rows = res.data;
                    this.genListAction(this.rows);
                    console.log("this.rows",this.rows);
                }
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    hideDialog() {
        this.modalDialog = false;
        this.submitted = false;
        this.modalDialogPDF = false;
    }

    save() {
        this.submitted = true;
        //
        if (this.contractFile.id) {
            console.log("this.contractFile",this.contractFile);
            
            this._businessCustomerService.updateBusiCusLicenseFileTemp(this.contractFile).subscribe(
                (response) => {
                    if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
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
        } else {
            this._businessCustomerService.createBusiCusLicenseFileTemp(this.contractFile).subscribe(
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
        return this.contractFile?.url?.trim() && this.contractFile?.title?.trim() ;
    }

    myUploader(event) {
        if (event?.files[0]) {
            this._contractTemplateService.uploadFileGetUrl(event?.files[0], "core").subscribe(
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
                        this.contractFile.url = response.data;
                    }
                },
                (err) => {
                    this.messageError("Có sự cố khi upload!");
                }
            );
        }
    }

    delete(file) {
        const data = file;
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn xóa hồ sơ này?',
            header: 'Xóa hồ sơ',
            acceptLabel: "Đồng ý",
			rejectLabel: "Hủy",
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._businessCustomerService.deleteBusiCusLicenseFile(data.id).subscribe((response) => {
                    console.log('----', this.contractFile.id)
                    if (this.handleResponseInterceptor(response, "Xóa thành công")) {
                        this.setPage();
                    }
                });
            },
            reject: () => {

            },
        });
    }

    downloadFile(file) {
        let fileUrl = file.url;
        const url = this.baseUrl + "/" + fileUrl;
        this._utilsService.makeDownload("", url);
    }

    viewFile(file) {
        let fileUrl = file.url;
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

