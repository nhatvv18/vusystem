import { AppConsts, NotVerifiedConst } from '@shared/AppConsts';
import {
    mergeMap as _observableMergeMap,
    catchError as _observableCatch,
} from "rxjs/operators";
import {
    Observable,
    throwError as _observableThrow,
    of as _observableOf,
} from "rxjs";
import { Injectable, Inject, Optional, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";
import { Page } from "@shared/model/page";
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { ChangePasswordDto } from './service-proxies';

@Injectable()
export class NotVerifiedServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/core/manager-investor/app-investor?step=4&";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }

    getAllNotVerified(page: Page, tradingProviderId: any, dataFilter: any): Observable<any> {
        let url_ = "/api/core/manager-investor/app-investor?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        url_ += this.convertParamUrl('step', `${NotVerifiedConst.STEP_BAT_DAU},${NotVerifiedConst.STEP_DA_DANG_KY},${NotVerifiedConst.STEP_DA_EKYC}`);
        if(tradingProviderId) {
            url_ += this.convertParamUrl('tradingProviderId', tradingProviderId);
        }
        if (dataFilter.status) {
            url_ += this.convertParamUrl('status', dataFilter.status);
        }
        return this.requestGet(url_);
    }

    getAllTradingProvider(): Observable<any> {
        let url_ = "/api/core/trading-provider/find?pageSize=-1";
        return this.requestGet(url_);
    }

    delete(id: number): Observable<void> {
		let url_ = "/api/users/" + id;
		return this.requestDelete(url_);
    }
}