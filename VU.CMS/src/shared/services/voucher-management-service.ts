import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { VoucherManagement } from "@shared/AppConsts";
import { Page } from "@shared/model/page";
import {
  API_BASE_URL,
  ServiceProxyBase,
} from "@shared/service-proxies/service-proxies-base";
import { AppSessionService } from "@shared/session/app-session.service";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";

@Injectable()
export class VoucherManagementService extends ServiceProxyBase {
  private readonly baseAPI = "/api/loyalty/voucher";
  public currentUser: string = "";
  public currentTime = new Date();

  constructor(
    messageService: MessageService,
    _cookieService: CookieService,
    private appSessionService: AppSessionService,
    @Inject(HttpClient) http: HttpClient,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(messageService, _cookieService, http, baseUrl);
    this.init();
  }

  init() {
    this.currentUser = this.appSessionService.user.userName;
  }

  public getAllVoucher(page: Page, filter: any): Observable<any> {
    let url_ = this.baseAPI + "/find?";
    url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
    url_ += this.convertParamUrl("pageSize", page.pageSize);
    url_ += this.convertParamUrl("keyword", page.keyword);
    if (filter?.status || filter?.status === 0)
      url_ += this.convertParamUrl("status", filter.status);
    if (filter?.applyDate)
      url_ += this.convertParamUrl("startDate", filter.applyDate);
    if (filter?.expireDate)
      url_ += this.convertParamUrl("endDate", filter.expireDate);
    return this.requestGet(url_);
  }

  public getCustomer(keyword: string, isBussiness: boolean = false) {
    let url_ = !isBussiness
      ? "/api/core/manager-investor/filter?requireKeyword=true&"
      : "/api/core/business-customer/find?";
    if (keyword) {
      url_ += this.convertParamUrl("keyword", keyword);
    }
    url_ += this.convertParamUrl("pageSize", -1);
    return this.requestGet(url_);
  }

  public createOrEditVoucher(body: any, isEdit: boolean) {
    if (isEdit) {
      return this.requestPut(body, `${this.baseAPI}`);
    }
    return this.requestPost(body, `${this.baseAPI}`);
  }

  public applyVoucher(body: any) {
    return this.requestPost(body, `${this.baseAPI}/investor`);
  }

  public getVoucherById(voucherId: number, voucherInvestorId?: number) {
    let url_ = `${this.baseAPI}/${voucherId}?`;
    if (voucherInvestorId)
      url_ += this.convertParamUrl("voucherInvestorId", voucherInvestorId);
    return this.requestGet(url_);
  }

  public importVoucher(body: any) {
    return this.requestPostFile(body, `${this.baseAPI}/import`);
  }

  public getCustomerDetail(id: number) {
    const url_ = "/api/core/manager-investor";
    return this.requestGet(
      `${url_}/${id}?isTemp=false&isNeedDefaultIdentification=true&isNeedReferralInvestor=true&isNeedApproveStatus=true&isNeedDefaultBank=true&isNeedListIdentification=true&isNeedListBank=true&isNeedDefaultAddress=true`
    );
  }

  public changeStatusVoucher(status: number, voucherInvestorId: number) {
    return this.requestPut(
      {
        voucherInvestorId,
        status,
      },
      `${this.baseAPI}/investor`
    );
  }

  public deleteVoucher(voucherId: number, voucherInvestorId?: number) {
    if (voucherInvestorId) {
      return this.changeStatusVoucher(
        VoucherManagement.DA_XOA,
        voucherInvestorId
      );
    }
    return this.requestDelete(`${this.baseAPI}/${voucherId}`);
  }
}
