import { Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CrudComponentBase } from "@shared/crud-component-base";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { BreadcrumbService } from "../layout/breadcrumb/breadcrumb.service";
import { ProductBondInfoConst, ProductBondDetailConst, InvestorConst, SearchConst, FormNotificationConst } from "@shared/AppConsts";
import { Page } from "@shared/model/page";
import { DialogService } from "primeng/dynamicdialog";
import { TrinhDuyetInvestorComponent } from "./trinh-duyet-investor/trinh-duyet-investor.component";
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from "../form-set-display-column/form-set-display-column.component";
import { Subject } from "rxjs";
import { FormNotificationComponent } from "../form-notification/form-notification.component";

@Component({
	selector: "app-investor",
	templateUrl: "./investor.component.html",
	styleUrls: ["./investor.component.scss"],
	providers: [DialogService, ConfirmationService],
})
export class InvestorComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private _investorService: InvestorServiceProxy,
		private dialogService: DialogService,
		private breadcrumbService: BreadcrumbService,
		private router: Router,
		private _dialogService: DialogService,
		private confirmationService: ConfirmationService
	) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: 'Trang chủ', routerLink: ['/home'] },
			{ label: 'Danh sách khách hàng cá nhân' },
		]);
	}

	InvestorConst = InvestorConst;

	statusSearch: any[] = [...ProductBondInfoConst.statusConst];

	isCheckSearch: any[] = [
		{
			name: 'Tất cả',
			code: ''
		},
		...InvestorConst.isCheckConst
	];

	isProSearch: any[] = [
		{
			name: 'Tất cả',
			code: ''
		},
		...InvestorConst.isProConst
	];

	statuses: any[] = [
		{
			name: 'Tất cả',
			code: ''
		},
		...InvestorConst.statusApproved
	];

	expandedRows = {};

	modalDialog: boolean;

	deleteItemDialog: boolean = false;

	deleteItemsDialog: boolean = false;

	rows: any[] = [];
	row: any;
	col: any;

	cols: any[];
	_selectedColumns: any[];

	subject = {
		keyword: new Subject(),
	};

	dataFilter = {
		fieldFilter: null,
		isCheck: null,
		isPro: null,
		status: null
	}

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

	approve: any = {};

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
		this.setPage({ page: this.offset });
		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.keyword === "") {
				this.setPage({ page: this.offset });
			} else {
				this.setPage();
			}
		});

		this.cols = [
			{ field: 'cifCode', header: 'Mã KH', width: '10rem', class: 'justify-content-left' },
			{ field: 'fullname', header: 'Họ tên', width: '16rem',class: 'justify-content-left' },
			{ field: 'phone', header: 'Điện thoại',class: 'justify-content-left', width: '10rem' },
			{ field: 'sex', header: 'Giới tính',class: 'justify-content-left', width: '6.5rem' },
			{ field: 'dateOfBirth', header: 'Ngày sinh',class: 'justify-content-left', width: '8rem' },
			// { field: 'nationality', header: 'Quốc tịch', width: '10rem' },
			{ field: 'email', header: 'Email', width: '18rem',class: 'justify-content-left', cutText: 'b-cut-text-18'},
			{ field: '_isProf', header: 'Nhà ĐTCN', width: '10rem', class: 'justify-content-center', pTooltip: 'Nhà đầu tư chuyên nghiệp', tooltipPosition: 'top' },
			// { field: 'profStartDate', header: 'Ngày bắt đầu chuyên nghiệp', width: '16rem', class: 'justify-content-left'},
			// { field: 'profDueDate', header: 'Ngày đáo hạn chuyên nghiệp', width: '16rem', class: 'justify-content-left'},
			// { field: 'profFileUrl', header: 'Hồ sơ', width: '50rem'0, cutText: 'b-cut-text-50' },
			{ field: 'isCheck', header: 'Kiểm tra', width: '10rem', class: 'justify-content-center' },
			{ field: 'source', header: 'Nguồn khởi tạo', width: '12rem',class: 'justify-content-left', cutText: 'b-cut-text-18'},
			{ field: 'columnResize', header: '', type:'hidden' },
		];

		this.cols = this.cols.map((item, index) => {
			item.position = index + 1;
			return item;
		})


		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('investorCore') ?? this.cols;
	}

	restPin(investor) {
		this.confirmationService.confirm({
			message: "Bạn có chắc chắn đặt lại mã Pin khách hàng này không?",
			acceptLabel: "Đồng ý",
			rejectLabel: "Hủy",
			header: "Đặt lại mã Pin",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				const body = {
					investorId: investor?.investorId,
				};

				this._investorService.resetPin(body).subscribe((response) => {
					if (this.handleResponseInterceptor(response, "Đặt lại mã Pin thành công")) {
						this.setPage();
					}
				});
			},
			reject: () => { },
		});
	}

	getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('investorCore', JSON.stringify(data));
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

	showData(rows) {
		for (let row of rows) {
			row.cifCode = row.cifCode;
			row.sex = this.InvestorConst.getSexName(row.defaultIdentification?.sex),
			row.dateOfBirth = this.formatDate(row?.defaultIdentification?.dateOfBirth);
			row.fullname = row.defaultIdentification?.fullname;
			// row.nationality = row.defaultIdentification?.nationality;
			row.phone = row.phone;
			row.source = InvestorConst.getSourceCreate(row?.source,'name');
			row.email = row.email;
			row.profStartDate = this.formatDate(row.profStartDate);
			row.profDueDate = this.formatDate(row.profDueDate);
			row.profFileUrl = row.profFileUrl;
		};
		console.log('showData', rows);
	}

	/**
	 * XAC MINH
	 * @param approve
	 */
	// check(investor) {
	// 	console.log("CHECK");
	// 	this.confirmationService.confirm({
	// 		message: "Bạn có chắc chắn xác minh khách hàng này không?",
	// 		header: "Phê duyệt",
	// 		icon: "pi pi-exclamation-triangle",
	// 		acceptLabel: 'Đồng ý',
	// 		rejectLabel: 'Hủy',
	// 		accept: () => {
	// 			const body = {
	// 				investorId: investor?.investorId,
	// 				investorGroupId: investor?.investorGroupId,
	// 			};

	// 			this._investorService.checkInvestor(body).subscribe((response) => {
	// 				if (this.handleResponseInterceptor(response, "Xác minh thành công")) {
	// 					this.setPage();
	// 				}
	// 			});
	// 		},
	// 		reject: () => { },
	// 	});
	// }

	check(investor) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn có chắc chắn xác minh khách hàng này không?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				investorId: investor?.investorId,
				investorGroupId: investor?.investorGroupId,
			};
			if (dataCallBack?.accept) {
			this._investorService.checkInvestor(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Xác minh khách hàng thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	}

	/**
	 * XEM THÔNG TIN CHI TIẾT INVESTOR
	 * @param investor
	 */
	view(investor) {
		let cryptEncodeId = encodeURIComponent(this.cryptEncode(investor?.investorId));
		let url = `/customer/investor/${cryptEncodeId}/temp/0`;
		window.open(url, "_blank");
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
			const status = item?.approve?.status;

			const actions = [];

			if (this.isGranted([this.PermissionCoreConst.CoreKHCN_ThongTinKhachHang])) {
				actions.push({
					data: item,
					label: "Thông tin chi tiết",
					icon: "pi pi-info-circle",
					command: ($event) => {
						this.view($event.item.data);
					},
				})
			}

			if (status == InvestorConst.STATUS.KHOI_TAO && this.isGranted([])) {
				actions.push({
					data: item,
					label: "Trình duyệt",
					icon: "pi pi-arrow-up",
					command: ($event) => {
						this.openModalTrinhDuyet($event.item.data);
					},
				});
			}

			if (status == InvestorConst.STATUS.TRINH_DUYET && this.isGranted([])) {
				actions.push({
					data: item,
					label: "Duyệt",
					icon: "pi pi-check",
					command: ($event) => {
						this.view($event.item.data);
					},
				});
			}

			// if ( (item?.isCheck != "Y" ) && this.isGranted([this.PermissionCoreConst.CoreKHCN_XacMinh])) {
			// 	actions.push({
			// 		data: item,
			// 		label: "Xác minh",
			// 		icon: "pi pi-check",
			// 		command: ($event) => {
			// 			this.check($event.item.data);
			// 		},
			// 	});
			// }

			return actions;
		});
	}

	/**
	 * MỞ MODAL TRÌNH DUYỆT
	 * @param data
	 */
	openModalTrinhDuyet(data) {
		const ref = this._dialogService.open(TrinhDuyetInvestorComponent, {
			header: "Trình duyệt khách hàng",
			// styleClass: 'p-dialog-custom customModal',
			data,
		});

		ref.onClose.subscribe((res) => {
			this.setPage({ page: this.offset });
		});
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

	changeStatus() {
		this.setPage({ page: this.offset });
	}

	changeFieldFilter() {
		if (this.keyword) {
			this.setPage();
		}
	}

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
		this.page.keyword = this.keyword;
		//
		this.isLoading = true;
		this._investorService.getAll(this.page, this.dataFilter).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, "")) {
				this.page.totalItems = res.data.totalItems;
				if (Array.isArray(res.data?.items)) {
					this.rows = res.data?.items.map(o => ({
						...o,
						_isChecked: o.isCheck === 'Y',
						_isProf: o.profStatus == 3
					}));
				}
				if (this.rows?.length) {
					this.genListAction(this.rows);
					this.showData(this.rows);
				}
				console.log({ rows: res.data.items, totalItems: res.data.totalItems });
			}
		},
			(err) => {
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
}
