import { Component, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CrudComponentBase } from "@shared/crud-component-base";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { BreadcrumbService } from "../layout/breadcrumb/breadcrumb.service";
import { ProductBondInfoConst, InvestorConst, ApproveConst, SearchConst, BusinessCustomerApproveConst, PermissionCoreConst } from "@shared/AppConsts";
import { Page } from "@shared/model/page";
import { DialogService } from "primeng/dynamicdialog";
import { FormRequestComponent } from "../form-request-approve-cancel/form-request/form-request.component";
import { FormApproveComponent } from "../form-request-approve-cancel/form-approve/form-approve.component";
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from "../form-set-display-column/form-set-display-column.component";
import { Subject } from "rxjs";

@Component({
	selector: "app-investor-approve",
	templateUrl: "./investor-approve.component.html",
	styleUrls: ["./investor-approve.component.scss"],
	providers: [DialogService, ConfirmationService],
})
export class InvestorApproveComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private _investorService: InvestorServiceProxy,
		private dialogService: DialogService,
		private breadcrumbService: BreadcrumbService,
		private router: Router,
		private _dialogService: DialogService
	) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: 'Trang chủ', routerLink: ['/home'] },
			{ label: 'Thêm mới khách hàng cá nhân' },
		]);
	}

	InvestorConst = InvestorConst;
	BusinessCustomerApproveConst = BusinessCustomerApproveConst;
	PermissionCoreConst = PermissionCoreConst;

	statusSearch: any[] = [
		{
			name: "Tất cả",
			code: ''
		},
		...InvestorConst.statusListApprove
	];

	subject = {
		keyword: new Subject(),
	};

	modalDialog: boolean;
	modalDialogUpdate: boolean;

	deleteItemDialog: boolean = false;

	deleteItemsDialog: boolean = false;

	dataFilter = {
		fieldFilter: null,
		status: '',
	}

	rows: any[] = [];
	row: any;
	col: any;

	cols: any[];
	_selectedColumns: any[];

	selectedInvestor: any = {
		phone: "",
		email: "",
		address: "",
		idType: InvestorConst.ID_TYPES.CMND,
		idNo: "",
		fullname: "",
		dateOfBirth: null,
		nationality: "",
		personalIdentification: "",
		idIssuer: "",
		idDate: null,
		idExpiredDate: null,
		placeOfOrigin: "",
		placeOfResidence: "",
		sex: "",
		idFrontImageUrl: "",
		idBackImageUrl: "",
		idExtraImageUrl: "",
		faceImageUrl: "",
		faceVideoUrl: "",
		bankAccount: "",
		bankName: "",
	};

	investor: any = {};

	fieldErrors = {};

	fieldDates = ["issueDate", "dueDate"];

	submitted: boolean;
	page = new Page();
	offset = 0;
	issuers: any = [];
	depositProviders: any = [];
	bondTypes: any = [];
	bondInfos: any = [];
	listInvestor: any = [];
	//
	issuer = {};
	depositProvider = {};

	// Menu otions thao
	listAction: any[] = [];

	ngOnInit() {
		// this.status = this.InvestorConst.STATUS.KHOI_TAO;
		
		this.setPage({ page: this.offset });
		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.keyword === "") {
				this.setPage({ page: this.offset });
			} else {
				this.setPage();
			}
		});

		this.cols = [
			{ field: 'cifCode', header: 'Mã KH', width: '10rem', class: 'justify-content-left', isPin: true },
			{ field: 'fullname', header: 'Họ tên', width: '16rem', cutText: 'b-cut-text-16',class: 'justify-content-left', isPin: true },
			{ field: 'dateOfBirth', header: 'Ngày sinh',class: 'justify-content-center', width: '10rem' },
			{ field: 'nameSex', header: 'Giới tính', class: 'justify-content-left',width: '6rem' },
			// { field: 'nationality', header: 'Quốc tịch', width: '10rem' },
			{ field: 'phone', header: 'Điện thoại',class: 'justify-content-left', width: '10rem' },
			{ field: 'email', header: 'Email', width: '18rem', class: 'justify-content-left', cutText: 'b-cut-text-18' },
			{ field: 'source', header: 'Nguồn', width: '5rem' },
			{ field: 'columnResize', header: '', type:'hidden' },
		];
		// Sắp xếp vị trị hiển thị trên table từ trên xuống dưới
		this.cols = this.cols.map((item, index) => {
			item.position = index + 1;
			return item;
		});
		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('investorApproveCore') ?? this.cols;  
	}



	edit(investor) {
		this.router.navigate([`/customer/investor/${this.cryptEncode(investor?.investorId)}/temp/1`]);
	}

	getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('investorApproveCore', JSON.stringify(data));
	}

	setColumn(col, _selectedColumns) {

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

	showData(rows) {
		for (let row of rows) {
			row.cifCode = row.cifCode;
			row.nameSex = this.InvestorConst.getSexName(row.defaultIdentification?.sex),
			row.dateOfBirth = this.formatDate(row.defaultIdentification?.birthDay);
			row.fullname = row.defaultIdentification?.fullName;
			// row.nationality = row.defaultIdentification?.nationality;
			row.phone = row.phone;
			row.email = row.email;
		};
		console.log('showData', rows);
	}

	/**
	 * XEM THÔNG TIN CHI TIẾT INVESTOR TẠM
	 * @param investor
	 */
	view(investor) {
		this.router.navigate([`/customer/investor/${this.cryptEncode(investor?.investorId)}/temp/1`]);
	}

	/**
	 * MỞ EKYC MODAL
	 */
	openEkycModal() {
		this.submitted = false;
		this.modalDialog = true;
	}

	/* ACTION BUTTON */
	genListAction(data = []) {
		this.listAction = data.map((item) => {
			const actions = [];

			if (true) {
				actions.push({
					data: item,
					label: "Thông tin chi tiết",
					icon: "pi pi-info-circle",
					command: ($event) => {
						this.view($event.item.data);
					},
				})
			}
			return actions;
		});

		console.log(this.listAction);
	}

	approve(investor) {
		const ref = this._dialogService.open(
			FormApproveComponent,
			this.getConfigDialogServiceRAC("Phê duyệt", investor?.investorId)
		);
		console.log("abc", investor?.investorId);
		//
		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				const body = {
					investorId: investor.investorId,
					investorGroupId: investor?.investorGroupId,
					notice: dataCallBack?.data?.notice,
				}
				this._investorService.approve(body).subscribe((response) => {
					if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
						this.viewInvestor();
					}
				});
			}
		});
	}

	viewInvestor() {
		this.router.navigate(["/customer/investor"]);
	}

	deleteSelectedItems() {
		this.deleteItemsDialog = true;
	}

	delete() {
		this.deleteItemDialog = true;
	}

	confirmDelete() {
		this.deleteItemDialog = false;
	}

	// changeKeyword() {
	// 	if (this.keyword == "") {
	// 		this.setPage({ page: this.offset });
	// 	}
	// }

	changeStatus() {
		console.log("status");
		
		this.setPage({ page: this.offset });
	}

	changeFieldFilter(){
		if(this.keyword) {
			this.setPage();
		}
	}

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
		this.page.keyword = this.keyword;
		//
		//
		this.isLoading = true;
		this._investorService.getInvestorTemporary(this.page, this.dataFilter).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, "")) {
				this.page.totalItems = res.data.totalItems;
				this.rows = res.data.items;
				this.investor = res.data;
				console.log("investor", res);
				//
				if (res.data?.items?.length) {
					this.genListAction(this.rows);
					this.showData(this.rows);
				}
				console.log({ rows: res.data.items, totalItems: res.data.totalItems });
			}
		},(err) => {
				this.isLoading = false;
				console.log('Error-------', err);
				

			}
		);
	}

	/**
	 * CALLBACK SAU KHI THEM MOI INVESTOR THANH CONG
	 */
	onSaveInvestor() {
		this.setPage(0);
	}
	header(): string {
		return this.investor?.investorId > 0 ? 'Sửa thông tin khách hàng ' : 'Thêm thông tin khách hàng ';
	}
}

