import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SaleConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { SaleService } from "@shared/service-proxies/sale-service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-sale-history-update",
  templateUrl: "./sale-history-update.component.html",
  styleUrls: ["./sale-history-update.component.scss"],
})
export class SaleHistoryUpdateComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private routeActive: ActivatedRoute,
		private _saleService: SaleService
	) {
		super(injector, messageService);
		this.saleId = +this.cryptDecode(
		this.routeActive.snapshot.paramMap.get("id")
		);
	}

  	saleId: number;
	rows: any[] = [];
	page = new Page();
	SaleConst = SaleConst;
	@Input() departments: any = {};
	@Input() managers: any = {};
	

  	ngOnInit(): void {
		console.log('!!! managers: ', this.managers);
		
		this.setPage();
	}

	getNameDepartment(departmentId){
		const department = this.departments.find(d => d.departmentId == departmentId)
		return department.departmentName ?? ""
	}

	setPage(pageInfo?:any) {
		this.isLoading = true;
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
		this.page.keyword = this.keyword;
		this._saleService.getHistory(this.page, this.saleId).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, '')) {
				this.page.totalItems = res?.data?.totalItems;
				this.rows = res?.data?.items
				console.log({ history: res });
			}
		}, () => {
			this.isLoading = false;
		});
	}
}
