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
export class ApproveServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/partner/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/partner/update/" + body.partnerId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/partner/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/partner/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, dataType: number, status:any, actionType:any, requestDate: any, approveDate: any): Observable<any> {
        let url_ = "/api/core/approve/all?";   
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("requestDate", requestDate ?? '');
        url_ += this.convertParamUrl("approveDate", approveDate ?? '');
        url_ += this.convertParamUrl("status", status ?? '');
        url_ += this.convertParamUrl("actionType", actionType?? '');
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        if (dataType) {
            url_ += this.convertParamUrl("dataType", dataType);
        }
        return this.requestGet(url_);
    }
    approve(body): Observable<any> {
		return this.requestPut(body, "/api/core/manager-investor/approve/prof");
	}
    cancel(body): Observable<any> {
		return this.requestPut(body, "/api/core/manager-investor/cancel/prof");
	}
}