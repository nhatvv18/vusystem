import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
import { API_BASE_URL, ServiceProxyBase } from "@shared/service-proxies/service-proxies-base";

/**
 * Sale
 */
@Injectable()
export class GeneralService extends ServiceProxyBase {
    constructor(
        messageService: MessageService, 
        _cookieService: CookieService, 
        @Inject(HttpClient) http: HttpClient, 
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
        ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    // TÌM KIẾM DOANH NGHIỆP THEO MÃ SỐ THUẾ
    getBusinessCutomer(taxCode): Observable<any> {
        let url_ = "/api/core/business-customer/findTaxCode/" + taxCode;
        return this.requestGet(url_);
    }
   
}