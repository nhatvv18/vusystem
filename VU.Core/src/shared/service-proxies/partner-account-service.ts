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
export class PartnerAccountService extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/users/partner/create");
    }

    // update(body): Observable<any> {
    //     return this.requestPut(body, "/api/core/partner/update/" + body.partnerId);
    // }

    // delete(id: number): Observable<void> {
    //     let url_ = "/api/core/partner/delete/" + id;
    //     return this.requestDelete(url_);
    // }

    // get(id: number): Observable<any> {
    //     let url_ = "/api/core/partner/" + id;
    //     return this.requestGet(url_);
    // }

    getAll(page: Page, partnerId): Observable<any> {
        let url_ = "/api/users/partner/get-all?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        url_ += this.convertParamUrl('partnerId', partnerId);

        return this.requestGet(url_);
    }
}