import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { FormNotificationConst, InvestorConst, SaleConst, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { AddInvestorSaleComponent } from "./add-investor-sale/add-investor-sale.component";
@Component({
  selector: 'app-investor-sale',
  templateUrl: './investor-sale.component.html',
  styleUrls: ['./investor-sale.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class InvestorSaleComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private confirmationService: ConfirmationService,
		private routeActive: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService,
		private _dialogService: DialogService,
		private _investorService: InvestorServiceProxy,
		private breadcrumbService: BreadcrumbService,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
	}

	investorId: number;
	@Input() investorDetail: any = {};
	ref: DynamicDialogRef;

	modalDialog: boolean;
	deleteItemDialog: boolean = false;

	confirmRequestDialog: boolean = false;
	rows: any[] = [];
	list: any = {};

	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
	SaleConst = SaleConst;
	isTemp = InvestorConst.TEMP.YES;

	investorBank: any = {};
	banks: any = {};
	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];
	bankFullName: any = {};

	page = new Page();
	offset = 0;

	ngOnInit(): void {
		this.setPage();
	}

	genListAction(data = []) {
		this.actions = data.map((item) => {
			const action = [
				// {
				// 	data: item,
				// 	label: "Sửa",
				// 	icon: "pi pi-pencil",
				// 	statusActive: [1, 2, 3, 4],
				// 	permission: this.isGranted([]),
				// 	command: ($event) => {
				// 		this.edit($event.item.data);
				// 	},
				// },
			];

			if (item.isDefault !== this.YesNoConst.YES && this.isGranted([this.PermissionCoreConst.CoreKHCN_TuVanVien_SetDefault])) {
				action.push({
					data: item,
					label: "Chọn mặc định",
					icon: "pi pi-check",
					permission: this.isGranted([]),
					command: ($event) => {
						this.setDefaultSale($event.item.data);
					},
				});
			}
			return action;
		});
	}

	// setDefaultSale(row) {
	// 	console.log("body",this.investorId, row);
		
	// 	this.confirmationService.confirm({
	// 		message: "Bạn muốn chọn người tư vấn này thành mặc định?",
	// 		header: "Thiết lập người tư vấn mặc định",
	// 		acceptLabel: "Đồng ý",
	// 		rejectLabel: "Hủy",
	// 		icon: "pi pi-question-circle",
	// 		accept: () => {
	// 			const body = {
	// 				investorSaleId: row?.investorSale.id,
	// 			};
	// 			this._investorService.setDefaultSale(body).subscribe((res) => {
	// 				this.handleResponseInterceptor(res, "Set thành công");
	// 				this.setPage();
	// 			});
	// 		},
	// 		reject: () => {},
	// 	});
	// }

	setDefaultSale(row) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn muốn chọn người tư vấn này thành mặc định?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				investorSaleId: row?.investorSale.id,
			};
			if (dataCallBack?.accept) {
			this._investorService.setDefaultSale(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Chọn người tư vấn này thành mặc định thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	  }

	createSale() {
		const ref = this.dialogService.open(
			AddInvestorSaleComponent,
			{
			header: "Thêm tư vấn viên",
			width: '900px',
			contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
			baseZIndex: 10000,
			data: {	
			},
      		}
		);

		ref.onClose.subscribe((sale) => {
			console.log('sale------', sale);
      this.setPage();
		});
	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}

	setPage(pageInfo?: any) {
		this.isLoading = true;
		this._investorService.getInvestorSale(this.investorId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.rows = res?.data;
					this.genListAction(this.rows);
					setTimeout(() => {
					}, 2000);
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	
	clickDropdown(row) {
		this.investorBank = { ...row };
		console.log({ investorBank: row });
		this.actionsDisplay = this.actions.filter((action) => action.statusActive.includes(+row.status) && action.permission);
	}

	setFieldError() {
		for (const [key, value] of Object.entries(this.investorBank)) {
			this.fieldErrors[key] = false;
		}
		console.log({ filedError: this.fieldErrors });
	}

	hideDialog() {
		this.modalDialog = false;
		this.submitted = false;
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}

}
