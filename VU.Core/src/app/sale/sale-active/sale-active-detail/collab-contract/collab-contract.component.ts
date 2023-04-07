import { Component, Inject, Injector, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConsts, BusinessTypeConst, IsSignPdfConst, OrderConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { CollabContractService } from '@shared/service-proxies/collab-contract-service';
import { SaleService } from '@shared/service-proxies/sale-service';

import { API_BASE_URL } from '@shared/service-proxies/service-proxies-base';
import { OrderServiceProxy } from '@shared/service-proxies/trading-contract-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-collab-contract',
    templateUrl: './collab-contract.component.html',
    styleUrls: ['./collab-contract.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class CollabContractComponent extends CrudComponentBase {

    constructor(
        injector: Injector,
        messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private routeActive: ActivatedRoute,
        private _saleService: SaleService,
        private _collabContractService: CollabContractService,
        @Inject(API_BASE_URL) baseUrl?: string,
    ) {
        super(injector, messageService);
        //
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
        this.saleId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
    }

    collabContractTemplate: any = {
        id: 0,
        title: "",
        collabContractId: null,
        fileScanUrl: null,
        fileTempUrl: null,
        fileSignatureUrl: null
    };

    saleCollabContract: any = {
        collabContractId: 0,
        saleId: 0,
        collabContractTempId: 0,
        fileScanUrl: null
    };

    private baseUrl: string;

    AppConsts = AppConsts;
    IsSignPdfConst = IsSignPdfConst;
    saleId: number;
    @Input() orderDetail: any = {};
    modalDialog: boolean;
    modalDialogPDF: boolean;
    urlfilePDF:string = '';
    ref: DynamicDialogRef;
    rows: any[] = [];

    hideDialog() {
        this.modalDialog = false;
        this.submitted = false;
        this.modalDialogPDF = false;
    }

    ngOnInit() {
        this.setPage();
    }
    //
    updateSaleCollabContract() {
        this.isLoading = true;
        this._saleService.updateSaleCollabContract(this.saleId).subscribe((res) => {
            console.log('res', res);
            this.isLoading = false;
            if (this.handleResponseInterceptor(res, 'Update thành công')) {
                this.setPage();
            }
        }, (err) => {
            this.isLoading = false;
            console.log('Error-------', err);
            
        });
    }

    signSaleCollabContract() {
        this.isLoading = true;
        this._saleService.signSaleCollabContract(this.saleId).subscribe((res) => {
            console.log('res', res);
            this.isLoading = false;
            if (this.handleResponseInterceptor(res, 'Ký điện tử thành công')) {
                this.setPage();
            }
        }, (err) => {
            this.isLoading = false;
            console.log('Error-------', err);
            
        });
    }
    //
    downloadFileTempContract(collabContract) {
        if (collabContract.collabContractId > 0) {
            this._saleService.downloadFileTempContract(collabContract.collabContractId).subscribe((res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, '')) {
                    console.log({ "Tải xuống": res });
                }
            }, (err) => {
                this.isLoading = false;
                console.log('Error-------', err);
                

            });
        } else {
            this.messageError("Chưa cập nhật hồ sơ!");
        }

    }
    //
    downloadFileScanContract(collabContract) {
        if (collabContract.collabContractId > 0) {
            this._saleService.downloadFileScanContract(collabContract.collabContractId).subscribe((res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, '')) {
                    console.log({ "Tải xuống": res });
                }
            }, (err) => {
                this.isLoading = false;
                console.log('Error-------', err);
                
            });
        } else {
            this.messageError("File scan không tồn tại!");
        }

    }
    //
    downloadFileSignatureContract(collabContract) {
        if (collabContract.collabContractId > 0) {
            this._saleService.downloadFileSignatureContract(collabContract.collabContractId).subscribe((res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, '')) {
                    console.log({ "Tải xuống": res });
                }
            }, (err) => {
                this.isLoading = false;
                console.log('Error-------', err);
                
            });
        } else {
            this.messageError("Chưa cập nhật hồ sơ!");
        }

    }

    saveCollabContractFile() {
        this.submitted = true;
        if (this.collabContractTemplate.collabContractId > 0) {
            this._saleService.updateCollabContractFileScan(this.saleCollabContract).subscribe(
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
            this._saleService.createCollabContractFileScan(this.saleCollabContract).subscribe(
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

    saveFile(row) {
        this.submitted = false;
        this.modalDialog = true;
        this.collabContractTemplate = { ...row };
        this.saleCollabContract = {
            collabContractId: this.collabContractTemplate.collabContractId,
            saleId: this.saleId,
            collabContractTempId: this.collabContractTemplate.id,
            fileScanUrl: this.collabContractTemplate.fileScanUrl
        };
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

    setPage() {
        this.isLoading = true;
        this._saleService.getAllSaleCollabContract(this.saleId).subscribe((res) => {
            this.isLoading = false;
            if (this.handleResponseInterceptor(res, '')) {
                this.page.totalItems = res.data.totalItems;
                this.rows = res.data.items.map((item) => {
                    item.isFileUrl = item.fileScanUrl ? true : false;
                    item.isSign = item.isSign == IsSignPdfConst.YES ? true : false;
                    return item;
                });
                console.log("data", res.data);
                console.log({ rowsContractTemplate: res.data.items, totalItems: res.data.totalItems });
            }
        }, (err) => {
            this.isLoading = false;
            console.log('Error-------', err);
            
        });
    }

    validForm(): boolean {
        return this.saleCollabContract?.fileScanUrl?.trim() !== "";
    }

    myUploader(event) {
        if (event?.files[0]) {
            this._collabContractService.uploadFileGetUrl(event?.files[0], "collabContract").subscribe((response) => {
                    console.log({ response});
                    if(this.handleResponseInterceptor(response, 'Upload thành công!')) {
                        this.saleCollabContract.fileScanUrl = response.data;
                    }
                },
                (err) => {
                    this.messageError("Có sự cố khi upload!");
                }
            );
        }
    }
}
