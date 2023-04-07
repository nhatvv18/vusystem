import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvestorConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { MessageService } from "primeng/api";

@Component({
	selector: 'app-investor-referral',
	templateUrl: './investor-referral.component.html',
	styleUrls: ['./investor-referral.component.scss']
})
export class InvestorReferralComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private routeActive: ActivatedRoute,
		private _investorService: InvestorServiceProxy,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
	}

	investorId: number;
	@Input() investorDetail: any = {};
	rows: any;
	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
	isTemp = InvestorConst.TEMP.YES;
	ngOnInit(): void {
		this.setPage();
	}

	setPage(pageInfo?: any) {
		this.isLoading = true;
		this._investorService.getInvestorReferral(this.investorId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
						this.rows = res?.data;
					setTimeout(() => {
					}, 2000);
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}
}

