import { Component, Inject, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { AppConsts, ApproveConst, BusinessCustomerConst, InvestorConst, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { ContractTemplateServiceProxy, DistributionContractFileServiceProxy } from "@shared/service-proxies/bond-manager-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ProvinceServiceProxy } from "@shared/service-proxies/province-service";
import { API_BASE_URL } from "@shared/service-proxies/service-proxies-base";
import { AppUtilsService } from "@shared/services/utils.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from "primeng/tristatecheckbox";
import { debounceTime } from "rxjs/operators";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";

@Component({
  selector: 'app-investor-professional',
  templateUrl: './investor-professional.component.html',
  styleUrls: ['./investor-professional.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class InvestorProfessionalComponent extends CrudComponentBase {

  constructor(
		injector: Injector,
		messageService: MessageService,
		private confirmationService: ConfirmationService,
		private routeActive: ActivatedRoute,
		private router: Router,
		private _investorService: InvestorServiceProxy,
		private breadcrumbService: BreadcrumbService,
		private _utilsService: AppUtilsService,
		@Inject(API_BASE_URL) baseUrl?: string,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
		//
		this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
	}
	
	private baseUrl: string;
	investorId: number;
	@Input() investorDetail: any = {};
	ref: DynamicDialogRef;

	modalDialog: boolean;
	modalDialogPDF: boolean;
	deleteItemDialog: boolean = false;

	confirmRequestDialog: boolean = false;
	rows: any[] = [];
	rowsFile: any[] = [];
	list: any = {};

	urlfilePDF: string = "";

	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
 	ApproveConst = ApproveConst;
	AppConsts = AppConsts;
	isTemp = InvestorConst.TEMP.YES;

	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];

	page = new Page();
	offset = 0;


	ngOnInit(): void {
		this.setPage();
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

	genListAction(data = []) {
		this.actions = data?.map((item) => {
			const action = [
				{
					data: item,
					label: "Chi tiết tệp tin",
					icon: "pi pi-copy",
					statusActive: [1, 2, 3, 4],
					permission: this.isGranted([]),
					command: ($event) => {
						this.getInvestorProfessionalFile($event.item.data);
					},
				},
			];
			return action;
		});
	}

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		this.page.keyword = this.keyword;
		this.isLoading = true;

		this._investorService.getInvestorProfessional(this.page, this.investorId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.rows = res.data.items;
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

	getInvestorProfessionalFile(row) {
    	this.modalDialog = true;
		this.page.keyword = this.keyword;
		this.isLoading = true;

		console.log("body",this.investorId, row);
		
		this._investorService.getInvestorProfessionalFile(row.referIdTemp).subscribe((res) => {
			this.isLoading = false;
			this.handleResponseInterceptor(res, "");
				this.rowsFile = res.data;
				console.log("rows",this.rowsFile);
				
				this.setPage();
		});

	}

	hideDialog() {
		this.modalDialog = false;
		this.submitted = false;
		this.modalDialogPDF = false;
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}

}
