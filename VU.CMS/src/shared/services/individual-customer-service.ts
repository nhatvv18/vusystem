import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { Page } from "@shared/model/page";
import {
  API_BASE_URL,
  ServiceProxyBase,
} from "@shared/service-proxies/service-proxies-base";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";

@Injectable()
export class IndividualCustomerService extends ServiceProxyBase {
  public individualCustomerId: number;
  constructor(
    messageService: MessageService,
    _cookieService: CookieService,
    @Inject(HttpClient) http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(messageService, _cookieService, http, baseUrl);
  }

  public getAllIndividualCustomer(page: Page, filter: any): Observable<any> {
    const isAddedVoucher =
      filter.voucherLevel === 2 ? true : filter.voucherLevel === 1 ? false : "";
    const isCheckedInvestor =
      filter.account === 1 ? true : filter.account === 2 ? false : "";
    let url_ = "/api/loyalty/voucher/investors?";
    url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
    url_ += this.convertParamUrl("pageSize", page.pageSize);
    url_ += this.convertParamUrl("keyword", page.keyword);
    url_ += this.convertParamUrl("sex", filter.gender || "");
    url_ += this.convertParamUrl("rank", filter.class || "");
    url_ += this.convertParamUrl("isAddedVoucher", isAddedVoucher);
    url_ += this.convertParamUrl("isCheckedInvestor", isCheckedInvestor);
    return this.requestGet(url_);
  }

  public getCustomerDetail() {
    const url_ = "/api/core/manager-investor";
    return this.requestGet(
      `${url_}/${this.individualCustomerId}?isTemp=false&isNeedDefaultIdentification=true&isNeedReferralInvestor=true&isNeedApproveStatus=true&isNeedDefaultBank=true&isNeedListIdentification=true&isNeedListBank=true&isNeedDefaultAddress=true`
    );
  }

  public getListVoucherByCustomerId(page: Page, filter: any): Observable<any> {
    let url_ = "/api/loyalty/voucher/investor?";
    url_ += this.convertParamUrl("investorId", this.individualCustomerId);
    url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
    url_ += this.convertParamUrl("pageSize", page.pageSize);
    url_ += this.convertParamUrl("keyword", filter.keyword);
    url_ += this.convertParamUrl(
      "voucherType",
      filter.voucherType ? filter.voucherType : ""
    );
    url_ += this.convertParamUrl(
      "status",
      filter.status || filter.status === 0 ? filter.status : ""
    );
    return this.requestGet(url_);
  }
}
