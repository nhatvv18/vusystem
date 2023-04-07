import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Page } from "@shared/model/page";
import { AppConsts, ProductBondInfoConst, ProductBondPrimaryConst, ProductBondSecondaryConst } from "@shared/AppConsts";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
import { PageBondPolicyTemplate } from "@shared/model/pageBondPolicyTemplate";
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from "primeng/tristatecheckbox";
import { API_BASE_URL, ServiceProxyBase } from "@shared/service-proxies/service-proxies-base";

/**
 * Sale
 */
@Injectable()
export class ExportReportService extends ServiceProxyBase {
    constructor(
        messageService: MessageService, 
        _cookieService: CookieService, 
        @Inject(HttpClient) http: HttpClient, 
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
        ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    getExportListSaler(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-saler-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportListCustomer(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-customer-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportListCustomerRoot(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-customer-root-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportListUser(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-user-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportListCustomerHVF(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-customer-hvf-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportAccountStatement(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/investor-account-statement-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }
    
    getExportCustomerInfoChange(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-customer-info-change-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }

    getExportCustomerRootInfoChange(requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/export-excel-report/list-customer-info-change-root-report?";   
        url_ += this.convertParamUrl("startDate", requestDate ?? '');
        url_ += this.convertParamUrl("endDate", approveDate ?? '');
        return this.requestDownloadFile(url_);
    }
}