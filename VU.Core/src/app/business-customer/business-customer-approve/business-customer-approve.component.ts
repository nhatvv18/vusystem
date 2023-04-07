import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessCustomerApproveConst, DistributionContractConst, SearchConst, KeyFilter, ApproveConst, ErrorBankConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { BusinessCustomerApproveServiceProxy } from '@shared/service-proxies/business-customer-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';
import { FormApproveComponent } from 'src/app/form-request-approve-cancel/form-approve/form-approve.component';
import { FormCancelComponent } from 'src/app/form-request-approve-cancel/form-cancel/form-cancel.component';
import { BankServiceProxy } from '@shared/service-proxies/bank-service';
import { NationalityConst } from '@shared/nationality-list';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { Subject } from 'rxjs';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
@Component({
    selector: 'app-business-customer-approve',
    templateUrl: './business-customer-approve.component.html',
    styleUrls: ['./business-customer-approve.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService],
})
export class BusinessCustomerApproveComponent extends CrudComponentBase {

    constructor(
        injector: Injector,
        messageService: MessageService,
        private dialogService: DialogService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private routeActive: ActivatedRoute,
        private _businessCustomerApproveService: BusinessCustomerApproveServiceProxy,
        private breadcrumbService: BreadcrumbService,
        private _bankService: BankServiceProxy,
        private _investorService: InvestorServiceProxy,
    ) {
        super(injector, messageService);
        this.breadcrumbService.setItems([
            { label: 'Trang chủ', routerLink: ['/home'] },
            { label: 'Thêm khách hàng doanh nghiệp', routerLink: ['/customer/business-customer/business-customer-approve'] },
        ]);
    }

    ref: DynamicDialogRef;

    modalDialog: boolean;
    deleteItemDialog: boolean = false;
    deleteItemsDialog: boolean = false;
    rows: any[] = [];
    row: any;
    col: any;

    cols: any[];
    _selectedColumns: any[];
    banks: any[] = [];
    statusSearch = [
        {
            name: "Tất cả",
            code: ''
        },
        ...BusinessCustomerApproveConst.statusList
    ];

    BusinessCustomerApproveConst = BusinessCustomerApproveConst;
    DistributionContractConst = DistributionContractConst;
    ApproveConst = ApproveConst;
    NationalityConst = NationalityConst;
    ErrorBankConst = ErrorBankConst;

    businessCustomer: any = {
        "bankAccName": null,
    };

    subject = {
        keyword: new Subject(),
    };

    dataFilter = {
        fieldFilter: null,
        status: '',  
    }

    fieldErrors = {};
    fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
    submitted: boolean;
    expandedRows = {};
    statuses: any[];
    KeyFilter = KeyFilter;

    listAction: any[] = [];
    //
    page = new Page();
    offset = 0;

    //
    actions: any[] = [];  // list button actions
    actionsDisplay: any[] = [];
    isLoadingBank: boolean;

    ngOnInit(): void {

        this.getAllBank();
        this.setPage({ page: this.offset });
        this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
            if (this.keyword === "") {
                this.setPage({ page: this.offset });
            } else {
                this.setPage();
            }
        });
        this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.businessCustomer.bankId) {
				this.keyupBankAccount();
			} 
				
			
		});



        this.cols = [
            { field: 'taxCode', header: 'Mã số thuế', width: '8rem' , isPin: true },
            { field: 'shortName', header: 'Tên viết tắt', width: '15rem', isPin: true },
            { field: 'name', header: 'Tên doanh nghiệp', width: '35rem', isResize: true, },
            // { field: 'address', header: 'Địa chỉ', width: '40rem', cutText: 'b-cut-text-40', position: 4 },
            { field: 'email', header: 'Thư điện tử', width: '18rem', cutText: 'b-cut-text-18', },
            // { field: 'phone', header: 'Số điện thoại', width: '12rem', cutText: 'b-cut-text-12', position: 6 },
            // { field: 'repName', header: 'Người đại diện', width: '12rem', cutText: 'b-cut-text-12', position: 7 },
            // { field: 'repPosition', header: 'Chức vụ', width: '10rem', cutText: 'b-cut-text-10', position: 8 },
            { field: 'columnResize', header: '', type:'hidden' },
        ];

        this.cols = this.cols.map((item, index) => {
            item.position = index + 1;
            return item;
        });

        // this._selectedColumns = this.cols;
        this._selectedColumns = this.getLocalStorage('busiCusAppCore') ?? this.cols;
    }

    keyupBankAccount() {
        this.isLoadingBank = true;
		console.log("this.investorBank",this.businessCustomer);
		this.businessCustomer.ownerAccount ='';
			this._investorService.getBankAccount(this.businessCustomer.bankId,this.businessCustomer.bankAccNo ).subscribe(
				(res) => {
					this.isLoadingBank = false;
                    if(res.code === ErrorBankConst.LOI_KET_NOI_MSB|| res.code === ErrorBankConst.SO_TK_KHONG_TON_TAI) {
						this.messageService.add({
							severity: 'error',
							summary: '',
							detail: 'Không tìm thấy thông tin chủ tài khoản, vui lòng kiểm tra lại (FE)',
							life: 3000,
						});
						this.businessCustomer.bankAccName = res?.data;
					} else
					if (this.handleResponseInterceptor(res)) {
						console.log("res",res);
						this.businessCustomer.bankAccName = res?.data;
					}
				},
				() => {
					this.isLoadingBank = false;
				}
			);
	}

    getLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key))
    }
    setLocalStorage(data) {
        return localStorage.setItem('busiCusAppCore', JSON.stringify(data));
    }

    setColumn(col, _selectedColumns) {
        console.log('cols:', col);

        console.log('_selectedColumns', _selectedColumns);

        const ref = this.dialogService.open(
            FormSetDisplayColumnComponent,
            this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
        );

        ref.onClose.subscribe((dataCallBack) => {
            console.log('dataCallBack', dataCallBack);
            if (dataCallBack?.accept) {
                this._selectedColumns = dataCallBack.data.sort(function (a, b) {
                    return a.position - b.position;
                });
                this.setLocalStorage(this._selectedColumns)
                console.log('Luu o local', this._selectedColumns);
            }
        });
    }

    changeBankId(value) {
		this.businessCustomer.bankAccNo= ''
		this.businessCustomer.bankAccName= ''
		console.log("value",value);
        this.businessCustomer.bankId = value
	}

    viewBusinessCustomer() {
        this.router.navigate(["/customer/business-customer/business-customer"]);
    }

    genListAction(data = []) {
        this.listAction = data.map(businessCustomerItem => {
            const actions = [];

            if (this.isGranted([this.PermissionCoreConst.CoreDuyetKHDN_ThongTinKhachHang])) {
                actions.push({
                    data: businessCustomerItem,
                    label: 'Thông tin chi tiết',
                    icon: 'pi pi-info-circle',
                    command: ($event) => {
                        this.detail($event.item.data);
                    }
                })
            }

            return actions;
        });
    }

    getAllBank() {
        this.page.keyword = this.keyword;
        this.isLoading = true;
        this._bankService.getAllBank(this.page).subscribe(
            (res) => {
                this.isLoading = false;
                if (this.handleResponseInterceptor(res, "")) {
                    this.page.totalItems = res.data.totalItems;
                    this.banks = res.data.items;
                    console.log({ banks: res.data.items, totalItems: res.data.totalItems });
                }
            },
            (err) => {
                this.isLoading = false;
                console.log('Error-------', err);
                
            }
        );
    }

    request(businessCustomer) {

        const data = {
            id: businessCustomer.businessCustomerTempId,
            summary: businessCustomer.name + ' - ' + businessCustomer.taxCode,
            actionType: businessCustomer.businessCustomerId ? this.ApproveConst.ACTION_UPDATE : this.ApproveConst.ACTION_ADD,
        }
        //
        const ref = this.dialogService.open(
            FormRequestComponent,
            this.getConfigDialogServiceRAC("Trình duyệt", data)
        );
        ref.onClose.subscribe((dataCallBack) => {
            if (dataCallBack?.accept) {
                this._businessCustomerApproveService.request(dataCallBack.data).subscribe((response) => {
                    if (this.handleResponseInterceptor(response, "Trình duyệt thành công!")) {
                        this.setPage();
                    }
                });
            }
        });
    }

    clickDropdown(row) {
        this.businessCustomer = { ...row };
        this.actionsDisplay = this.actions.filter(action => action.statusActive.includes(row.status) && action.permission);
        console.log({ businessCustomer: row });
    }

    detail(businessCustomer) {
        this.router.navigate(['/customer/business-customer/business-customer-approve/detail/' + this.cryptEncode(businessCustomer?.businessCustomerTempId)]);
    }

    partnerApprove(businessCustomer) {
        console.log("businessCustomer?.businessCustomerTempId", businessCustomer?.businessCustomerTempId);

        const ref = this.dialogService.open(
            FormApproveComponent,
            this.getConfigDialogServiceRAC("Phê duyệt", businessCustomer?.businessCustomerTempId)
        );
        //
        ref.onClose.subscribe((dataCallBack) => {
            const body = {
                id: businessCustomer.businessCustomerTempId,
                approveNote: dataCallBack?.data?.approveNote,
                approveID: dataCallBack?.data?.approveID,
            };
            if (dataCallBack?.accept) {
                this._businessCustomerApproveService.partnerApprove(body).subscribe((response) => {
                    if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
                        this.viewBusinessCustomer();
                    }
                });
            }
        });
    }

    partnerCancel(businessCustomer) {
        const ref = this.dialogService.open(
            FormCancelComponent,
            this.getConfigDialogServiceRAC("Hủy phê duyệt", businessCustomer?.businessCustomerTempId)
        );
        //
        ref.onClose.subscribe((dataCallBack) => {
            const body = {
                id: businessCustomer.businessCustomerTempId,
                cancelNote: dataCallBack?.data?.cancelNote,
            };
            if (dataCallBack?.accept) {
                this._businessCustomerApproveService.partnerCancel(body).subscribe((response) => {
                    if (this.handleResponseInterceptor(response, "Hủy phê duyệt thành công")) {
                        this.setPage();
                    }
                });
            }
        });
    }

    setFieldError() {
        for (const [key, value] of Object.entries(this.businessCustomer)) {
            this.fieldErrors[key] = false;
        }
        console.log({ filedError: this.fieldErrors });
    }

    create() {
        this.isLoadingBank = true;
        this.businessCustomer = {};
        this.submitted = false;
        this.modalDialog = true;
    }

    deleteSelectedItems() {
        this.deleteItemsDialog = true;
    }

    edit(businessCustomer) {
        this.businessCustomer = {
            ...businessCustomer,
            licenseDate: businessCustomer?.licenseDate ? new Date(businessCustomer?.licenseDate) : null,
            decisionDate: businessCustomer?.decisionDate ? new Date(businessCustomer?.decisionDate) : null,
            dateModified: businessCustomer?.dateModified ? new Date(businessCustomer?.dateModified) : null,
        };
        console.log("Hello my friend", businessCustomer);
        this.modalDialog = true;
    }

    delete() {
        this.deleteItemDialog = true;
    }

    confirmDelete() {
        this.deleteItemDialog = false;
        this._businessCustomerApproveService.delete(this.businessCustomer.businessCustomerTempId).subscribe(
            (response) => {
                if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
                    this.setPage({ page: this.page.pageNumber });
                    this.businessCustomer = {};
                }
            }, () => {
                this.messageService.add({
                    severity: 'error',
                    summary: '',
                    detail: `Không xóa được khách hàng doanh nghiệp ${this.businessCustomer.name}`,
                    life: 3000,
                });
            }
        );
    }

    confirm() {
        this.businessCustomer = true;
    }

    // changeKeyword() {
    //     if (this.keyword === '') {
    //         this.setPage({ page: this.offset });
    //     }
    // }

    changeStatus() {
        this.setPage({ page: this.offset });
    }

    changeFieldFilter() {
        if(this.keyword) {
            this.setPage();
        }
    }

    setPage(pageInfo?: any) {
        this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
        this.page.keyword = this.keyword;
        //
        this.isLoading = true;
        this._businessCustomerApproveService.getAll(this.page, this.dataFilter).subscribe((res) => {
            this.isLoading = false;
            if (this.handleResponseInterceptor(res, '')) {
                this.page.totalItems = res.data.totalItems;
                this.rows = res.data.items;
                if (res.data?.items?.length) {
                    this.genListAction(this.rows);
                }
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
    }

    resetValid(field) {
        this.fieldErrors[field] = false;
    }

    save() {
        this.submitted = true;
        console.log({ businessCustomerBBB: this.businessCustomer });
        this.businessCustomer.bankAccName = this.removeVietnameseTones(this.businessCustomer.bankAccName).toUpperCase();

        let body = this.formatCalendar(this.fieldDates, {...this.businessCustomer});
        if (this.businessCustomer.businessCustomerTempId) {
            this._businessCustomerApproveService.update(body).subscribe((response) => {
                if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
                    this.submitted = false;
                    this.setPage({ page: this.page.pageNumber });
                    this.hideDialog();
                } else {
                    this.submitted = false;
                }
            }, () => {
                this.submitted = false;
                }
            );
        } else {
            console.log("aaa",body);
            
            this._businessCustomerApproveService.create(body).subscribe(
                (response) => {
                    if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
                        this.submitted = false;
                        this.hideDialog();
                        this.isLoadingPage = true;
                        setTimeout(() => {
                            this.router.navigate(['/customer/business-customer/business-customer-approve/detail', this.cryptEncode(response.data.businessCustomerTempId)]);
                        }, 1000);
                    } else {
                        this.submitted = false;
                    }
                }, () => {
                    this.submitted = false;
                }
            );
        }
    }

    validForm(): boolean {
        const validRequired = this.businessCustomer?.code?.trim() && this.businessCustomer?.taxCode?.trim()
                            && this.businessCustomer?.licenseIssuer?.trim() && this.businessCustomer?.tradingAddress?.trim()
                            && this.businessCustomer?.name?.trim() && this.businessCustomer?.shortName?.trim()
                            && this.businessCustomer?.email?.trim() && this.businessCustomer?.address?.trim()
                            && this.businessCustomer?.nation && this.businessCustomer?.repName?.trim()
                            && this.businessCustomer?.repPosition?.trim() && this.businessCustomer?.bankAccNo?.trim()
                            && this.businessCustomer?.bankAccName?.trim() && this.businessCustomer?.bankId;

        return validRequired;
    }

    header(): string {
        return this.businessCustomer?.businessCustomerTempId > 0 ? 'Sửa khách hàng doanh nghiệp' : 'Thêm khách hàng doanh nghiệp';
    }
}