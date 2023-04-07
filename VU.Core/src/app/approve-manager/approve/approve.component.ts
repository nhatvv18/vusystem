import { Component, Injector, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IssuerConst, DistributionContractConst, SearchConst, ApproveConst, BusinessCustomerApproveConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { ApproveServiceProxy } from "@shared/service-proxies/approve-service";

import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormSetDisplayColumnComponent } from "src/app/form-set-display-column/form-set-display-column.component";
import { FormApproveComponent } from "src/app/form-request-approve-cancel/form-approve/form-approve.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { BusinessCustomerApproveServiceProxy } from "@shared/service-proxies/business-customer-service";
import { FormCancelComponent } from "src/app/form-request-approve-cancel/form-cancel/form-cancel.component";
import * as moment from "moment";
import { FormApproveInvestorComponent } from "src/app/investor/form-approve-investor/form-approve-investor.component";
import { FormApproveBusinessComponent } from "src/app/business-customer/business-customer-approve/business-customer-approve-detail/form-approve-business/form-approve-business.component";
import { FormApproveSaleComponent } from "src/app/sale/sale-temporary/sale-temporary-detail/form-approve-sale/form-approve-sale.component";
import { SaleService } from "@shared/service-proxies/sale-service";
import { InvestorDiffComponent } from "src/app/investor/investor-diff/investor-diff.component";


@Component({
	selector: "app-approve",
	templateUrl: "./approve.component.html",
	styleUrls: ["./approve.component.scss"],
	providers: [DialogService, ConfirmationService, MessageService],
})
export class ApproveComponent extends CrudComponentBase implements OnDestroy {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private dialogService: DialogService,
		private confirmationService: ConfirmationService,
		private router: Router,
		private routeActive: ActivatedRoute,
		private approveService: ApproveServiceProxy,
		private breadcrumbService: BreadcrumbService,
		public _investorService: InvestorServiceProxy,
		private _businessCustomerApproveService: BusinessCustomerApproveServiceProxy,
		private _saleService: SaleService,

	) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: "Trang chủ", routerLink: ["/home"] },
			{ label: "Quản lý duyệt", routerLink: ["/approve-manager/approve/2"] },
		]);
	}

	ref: DynamicDialogRef;

	modalDialog: boolean;
	deleteItemDialog: boolean = false;
	deleteItemsDialog: boolean = false;
	rows: any[] = [];
	row: any;
	col: any;
	actionType: any;
	cols: any[];
	_selectedColumns: any[];

	ApproveConst = ApproveConst;
	IssuerConst = IssuerConst;
	DistributionContractConst = DistributionContractConst;
	BusinessCustomerApproveConst = BusinessCustomerApproveConst;

	approveId: number;
	approve: any = {};
	dataType: number;
	routeSubcribe: any = null;

	fieldErrors = {};
	fieldDates = ["licenseDate", "decisionDate", "dateModified"];
	submitted: boolean;
	expandedRows = {};
	requestDate: any;
	approveDate: any;
	checkApprovePage: any;

	//
	page = new Page();
	offset = 0;

	//
	actionTypeSearch = [
		{
			name: "Tất cả",
			code: ''
		},
		...ApproveConst.actionType];
	actions: any[] = []; // list button actions
	actionsDisplay: any[] = [];
	listAction: any[] = [];
	statusSearch: any[] = [
		{
			name: "Tất cả",
			code: ''

		},
		...ApproveConst.statusConst
	];

	obj = {
		[this.ApproveConst.STATUS_USER]: () => {
			this.router.navigate(["/user/detail/" + this.approve.referIdTemp]);
		},
		[this.ApproveConst.STATUS_BUSINESS_CUSTOMER]: () =>{
			this.router.navigate(["/customer/business-customer/business-customer-approve/detail/" + this.cryptEncode(this.approve.referIdTemp)]);
		}
	};

	ngOnInit(): void {
		this.isLoading = true;
		this.routeSubcribe = this.routeActive.params.subscribe((params) => {
			this.checkApprovePage = params.dataType;
			if(params.dataType == 2 || params.dataType == 3){
				this.actionTypeSearch = [
					{
						name: "Tất cả",
						code: ''
					},
					...ApproveConst.actionTypeApprove];
			} else {
				this.actionTypeSearch = [
					{
						name: "Tất cả",
						code: ''
					},
					...ApproveConst.actionType];
			}
			if (params.dataType) {
				this.status = '';
				this.actionType = '';
				this.requestDate = '';
				this.approveDate = '';
				this.setPage({ page: this.offset }, params.dataType);

			}
		});

		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.keyword === "") {
				this.setPage({ page: this.offset });
			} else {
				this.setPage();
			}
		});
		this.cols = [
			{ field: 'summary', header: 'Thông tin duyệt', width: '20rem' },
			{ field: 'confirmDate', header: 'Ngày duyệt/ hủy', width: '10rem' },
			{ field: 'userRequest', header: 'Người trình duyệt', width: '20rem' },
			// { field: 'approveDate', header: 'Ngày duyệt', width: '10rem' },
			// { field: 'cancelDate', header: 'Ngày hủy', width: '10rem' },
			{ field: 'note', header: 'Ghi chú trình duyệt', width: '15rem'},
			{ field: 'userApprove', header: 'Người phê duyệt', width: '20rem' },
			// { field: 'requestNote', header: 'Ghi chú yêu cầu', width: '20rem' },
			// { field: 'approveNote', header: 'Ghi chú duyệt', width: '20rem', cutText: 'b-cut-text-20' },
			// { field: 'cancelNote', header: 'Ghi chú hủy duyệt', width: '20rem', cutText: 'b-cut-text-20' },
			{ field: 'columnResize', header: '', type:'hidden' },
		];

		this.cols = this.cols.map((item, index) => {
			item.position = index + 1;
			return item;
		  });
		  
		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('approveCore') ?? this.cols;
	}


	getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('approveCore', JSON.stringify(data));
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
			row.summary = row?.summary,
			row.note = row.requestNote || row.approveNote;
			row.confirmDate = (row.approveDate || row.cancelDate) ? this.formatDateTime(row?.approveDate || row.cancelDate) : null;
			row.userRequest = row?.userRequest?.userName + ' - ' + row?.userRequest?.displayName;
			if(row?.userApprove?.userName) {
				row.userApprove = row?.userApprove?.userName + ' - ' + row?.userApprove?.displayName;
			}
		};
		console.log('showData', rows);
	}

	genListAction(data = []) {
		this.listAction = data.map((item) => {

			const actions = [];

			if ((this.isGranted([this.PermissionCoreConst.CoreQLPD_KHCN_ThongTinChiTiet]) && this.checkApprovePage == 2)
				|| (this.isGranted([this.PermissionCoreConst.CoreQLPD_KHDN_ThongTinChiTiet]) && this.checkApprovePage == 3)
				|| (this.isGranted([this.PermissionCoreConst.CoreQLPD_NDTCN_ThongTinChiTiet]) && this.checkApprovePage == 10)
				|| (this.isGranted([this.PermissionCoreConst.CoreQLPD_Sale_ThongTinChiTiet]) && this.checkApprovePage == 8)) {
					actions.push({
					data: item,
					label: "Thông tin chi tiết",
					icon: "pi pi-info-circle",
					command: ($event) => {
						this.detail($event.item.data);
					},
				});
			}

			if (item?.status != 1 && (item?.dataType == ApproveConst.STATUS_INVESTOR) && this.isGranted([this.PermissionCoreConst.CoreQLPD_KHCN_XemLichSu])) {
				actions.push({
					data: item,
					label: "Xem lịch sử",
					icon: "pi pi-eye",
					command: ($event) => {
						this.showDiff($event.item.data);
					},
				});
			}
		
			if (item?.status == 1 && (item?.dataType == ApproveConst.STATUS_INVESTOR || item?.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER) && ((this.isGranted([this.PermissionCoreConst.CoreQLPD_KHCN_PheDuyetOrHuy]) && this.checkApprovePage == 2)
			|| (this.isGranted([this.PermissionCoreConst.CoreQLPD_KHDN_PheDuyetOrHuy]) && this.checkApprovePage == 3))) {
				actions.push({
					data: item,
					label: "Xử lý yêu cầu",
					icon: "pi pi-check",
					command: ($event) => {
						this.approveSharing($event.item.data);
					},
				});
			}
			

			if (item?.status == 1 && item?.dataType == ApproveConst.STATUS_SALE && this.isGranted([this.PermissionCoreConst.CoreQLPD_Sale_PheDuyetOrHuy])) {
				actions.push({
					data: item,
					label: "Xử lý yêu cầu",
					icon: "pi pi-check",
					command: ($event) => {
						this.approveSale($event.item.data);
					},
				});
			}

			if (item?.status == 1 && item?.dataType == ApproveConst.STATUS_INVESTOR_PRO && this.isGranted([this.PermissionCoreConst.CoreQLPD_NDTCN_PheDuyetOrHuy])) {
				actions.push({
					data: item,
					label: "Xử lý yêu cầu",
					icon: "pi pi-check",
					command: ($event) => {
						this.approveInvestorPro($event.item.data);
					},
				});
			}

			// if (item?.status == 1 &&
			// 	(
			// 		item?.dataType == ApproveConst.STATUS_SALE ||
			// 		item?.dataType == ApproveConst.STATUS_INVESTOR_PRO) && this.isGranted([this.PermissionCoreConst.CoreQLPD_KHCN_PheDuyetOrHuy])) {
			// 	actions.push({
			// 		data: item,
			// 		label: "Hủy duyệt",
			// 		icon: "pi pi-times",
			// 		command: ($event) => {
			// 			this.cancelSharing($event.item.data);
			// 		},
			// 	});
			// }

			return actions;
		});

		console.log(this.listAction);
	}

	showDiff(approve) {
		console.log("approveiddd",approve?.cancelDate);
		
		const ref = this.dialogService.open(InvestorDiffComponent, {
		  header: "So sánh thay đổi",
		  width: "70%",
		  styleClass: "p-dialog-custom",
		  contentStyle: { overflow: "auto" },
		  style: { height: "80%" },
		  data: {
			investorIdTemp: approve?.approveID,
			requestDate: approve?.requestDate ,
			approveDate: approve?.approveDate,
			statusCheck: approve?.status,
			cancelDate: approve?.cancelDate,
			getApprove: approve,
		  },
		});
	  }

	approveSharing(investor) {
		console.log("approveSharing",investor);
		
		if (investor.dataType == ApproveConst.STATUS_INVESTOR) {
			const ref = this.dialogService.open(
				FormApproveInvestorComponent,
				{
					header: "Xử lý yêu cầu",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto","padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						investorId: investor.approveID,
						actionType: investor.actionType,
						requestDate: investor.requestDate,
						approveDate: investor.approveDate,
						getApprove: investor,
					},
				}
			);
			console.log("abc", investor?.referIdTemp);

			ref.onClose.subscribe((dataCallBack) => {
				if (dataCallBack?.accept) {
					console.log("dataCallBack",dataCallBack);
					
					
					const body1 = {
						notice: dataCallBack?.data?.approveNote,
						//approve truyen len investorId
						investorId: investor.referIdTemp,
						//unapprove truyen len investorIdTemp
						investorIdTemp: investor.referIdTemp,
						incorrectFields: dataCallBack?.cancelHistory,
					}
					console.log("  dataCallBack?.checkApprove ", dataCallBack?.checkApprove);
					
					if (investor.dataType == ApproveConst.STATUS_INVESTOR && dataCallBack?.checkApprove == true) {

						this._investorService.approve(body1).subscribe((response) => {
							if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
								this.setPage(null, this.dataType);
							}
						});
					} else if (investor.dataType == ApproveConst.STATUS_INVESTOR && dataCallBack?.checkApprove == false) {
						this._investorService.cancel(body1).subscribe((response) => {
							console.log("data cô bách: " + dataCallBack.data.approveNote);
							if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
								this.setPage(null, this.dataType);
							}
						});
					}
				}
			});
		} else if (investor.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER){
			
			const ref = this.dialogService.open(
				FormApproveBusinessComponent,
				{
					header: "Xử lý yêu cầu",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						businessCustomer: investor,
						investorId: investor.referIdTemp
					},
				}
			);

			ref.onClose.subscribe((dataCallBack) => {
				if (dataCallBack?.accept) {
					const body1 = {
						notice: dataCallBack?.data?.approveNote,
						investorId: investor.referIdTemp,
						// investorGroupId: investor.investorGroupId,
					}
					const body2 = {
						notice: dataCallBack?.data?.approveNote,
						id: investor?.referIdTemp,
						approveID: dataCallBack?.data?.approveID,
						cancelNote: dataCallBack?.data?.requestNote,
						approveNote: dataCallBack?.data?.requestNote,
					}
					if (investor.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER && dataCallBack?.checkApprove == true) {

						this._businessCustomerApproveService.partnerApprove(body2).subscribe((response) => {
							if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
								this.setPage(null, this.dataType);
							}
						});
					} else if (investor.dataType == ApproveConst.STATUS_BUSINESS_CUSTOMER && dataCallBack?.checkApprove == false) {
						this._businessCustomerApproveService.partnerCancel(body2).subscribe((response) => {
							if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
								this.setPage(null, this.dataType);
							}
						});
					}
				}
			});
		}


	}
	
	approveSale(investor) {
		console.log("investor", investor);

		const ref = this.dialogService.open(
			FormApproveSaleComponent,
			this.getConfigDialogServiceRAC("Xử lý yêu cầu", investor?.referIdTemp)
		);
		console.log("abc", investor?.referIdTemp);

		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				const body = {
					approveNote: dataCallBack.data.approveNote,
					cancelNote: dataCallBack.data.approveNote,
					saleTempId: investor.referIdTemp,
				}
				if (investor.dataType == ApproveConst.STATUS_SALE && dataCallBack?.checkApprove == true) {

					this._saleService.approve(body).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
							this.setPage(null, this.dataType);
						}
					});
				} else if (investor.dataType == ApproveConst.STATUS_SALE && dataCallBack?.checkApprove == false) {
					this._saleService.cancel(body).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
							this.setPage(null, this.dataType);
						}
					});
				}

			}
		});
	}

	approveInvestorPro(investor) {
		console.log("investor", investor);

		const ref = this.dialogService.open(
			FormApproveComponent,
			this.getConfigDialogServiceRAC("Xử lý yêu cầu", { id: investor?.referId, isInvestorProf: true })
		);
		console.log("abc", investor?.referId);

		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				const body = {
					approveId: investor.approveID,
					investorId: investor.referId,
					investorIdTemp: investor.referIdTemp,
					approveNote: dataCallBack?.data?.approveNote,
					notice: dataCallBack?.data?.approveNote,
					profStartDate: dataCallBack?.data?.date1,
					profDueDate: dataCallBack?.data?.date2,

				}
				const bodyCancel = {
					investorTempId:  investor.referIdTemp,
					notice: dataCallBack?.data?.approveNote,
				}
				if (investor.dataType == ApproveConst.STATUS_INVESTOR_PRO && dataCallBack?.checkApprove == true) {

					this.approveService.approve(body).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
							this.setPage(null, this.dataType);
						}
					});
				} else if (investor.dataType == ApproveConst.STATUS_INVESTOR_PRO && dataCallBack?.checkApprove == false) {
					this.approveService.cancel(bodyCancel).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
							this.setPage(null, this.dataType);
						}
					});
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.routeSubcribe.unsubscribe();
	}

	clickDropdown(row) {
		this.approve = { ...row };
		this.actionsDisplay = this.actions.filter((action) => action.statusActive.includes(row.status) && action.permission);
		console.log({ approve: row });
	}

	detail(approve) {
		console.log("approve----",approve);
		
		// this.obj[this.approve.dataType]();
		switch (this.approve.dataType) {
			case this.ApproveConst.STATUS_INVESTOR:
				this.router.navigate([`/customer/investor/${this.cryptEncode(this.approve.referIdTemp)}/temp/1/approve`]);
				break;
			case this.ApproveConst.STATUS_BUSINESS_CUSTOMER:
				this.router.navigate([`/customer/business-customer/business-customer-approve/detail/${this.cryptEncode(this.approve.referIdTemp)}/${this.BusinessCustomerApproveConst.PAGE_DETAIL_APPROVE}`]);
				break;
			case this.ApproveConst.STATUS_PRO_BOND_INFO:
				this.router.navigate(["/bond-manager/product-bond-info/detail/" + this.approve.referId]);
				break;
			case this.ApproveConst.STATUS_PRO_BOND_SECONDARY:
				this.router.navigate(["/bond-manager/product-bond-secondary/update/" + this.approve.referId]);
				break;
			case this.ApproveConst.STATUS_INVESTOR_PRO:
				this.router.navigate([`/customer/investor/${this.cryptEncode(this.approve.referId)}/temp/0`]);
				break;
			case this.ApproveConst.STATUS_SALE:
				this.router.navigate([`/sale-manager/sale-temporary/detail/${this.cryptEncode(this.approve.referIdTemp)}`]);
				break;

			default:
				break;
		}
	}

	setFieldError() {
		for (const [key, value] of Object.entries(this.approve)) {
			this.fieldErrors[key] = false;
		}
		console.log({ filedError: this.fieldErrors });
	}

	confirm() {
		this.approve = true;
	}

	changeKeyword() {
		this.routeSubcribe = this.routeActive.params.subscribe((params) => {
			if (params.dataType) {
				console.log({ params });
				this.setPage({ page: this.offset }, params.dataType);
			}
		});
	}

	changeStatus() {
		this.isLoading = true;
		this.routeSubcribe = this.routeActive.params.subscribe((params) => {
			if (params.dataType) {
				this.setPage({ page: this.offset }, params.dataType);
			}
		});
	}
	changeActionType() {
		this.isLoading = true;
		this.routeSubcribe = this.routeActive.params.subscribe((params) => {
			if (params.dataType) {
				this.setPage({ page: this.offset }, params.dataType);
			}
		});
	}

	changeRequestDate() {
		this.routeSubcribe = this.routeActive.params.subscribe((params) => {
			if (params.dataType) {
				this.setPage({ page: this.offset }, params.dataType);
			}
		});
	}

	setPage(pageInfo?: any, dataType?: any) {
		console.log('pageInfo', pageInfo);
		console.log('dataType', dataType);
		
		this.setFieldError();
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;

		this.page.keyword = this.keyword;
		this.isLoading = true;
		if(dataType) this.dataType = dataType;
		if (this.requestDate) {
			var requestDate = moment(this.requestDate).format('YYYY-MM-DD');
		}

		if (this.approveDate) {
			var approveDate = moment(this.approveDate).format('YYYY-MM-DD');
		}

		this.approveService.getAll(this.page, this.dataType, this.status, this.actionType, requestDate, approveDate).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, "")) {
				this.page.totalItems = res.data.totalItems;
				this.rows = res?.data?.items;
				if (res.data?.items?.length) {
					this.showData(this.rows);
					this.genListAction(this.rows);
				}
			}
		},
			(err) => {
				this.isLoading = false;
				console.log('Error-------', err);
				
			}
		);
	}

	hideDialog() {
		this.modalDialog = false;
		this.submitted = false;
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}

}
