import { AppConsts } from '@shared/AppConsts';
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
export class WhitelistIpServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        
        return this.requestPost(body, "/api/users/white-list-ip/create");
    }

    update(body): Observable<any> {
        
        return this.requestPut(body, "/api/users/white-list-ip/update?whiteListIpId=" + body.id);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/users/white-list-ip/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
       
        let url_ = "/api/users/white-list-ip/get-by-id/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/users/white-list-ip/get-all?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }
}

@Injectable()
export class MSBPrefixAccountServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/trading-provider/msb-prefix-account/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/trading-provider/msb-prefix-account/update");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/trading-provider/msb-prefix-account/delete/" + id;
        return this.requestDelete(url_);
    }

    findById(id: number): Observable<any> {
        let url_ = "/api/core/trading-provider/msb-prefix-account/find-by-id?id=" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/core/trading-provider/msb-prefix-account/find-all?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }

    getBankList(params?: any): Observable<any> {
        let url_ = "/api/core/trading-provider/list-bank?";
        //
        if(params?.bankId) url_ += this.convertParamUrl('bankId', params.bankId);
        return this.requestGet(url_);
    }
}