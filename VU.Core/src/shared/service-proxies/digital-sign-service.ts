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
export class DigitalSignServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    /**
     * cập nhập chữ ký số của khách hàng doanh nghiệp bảng chính
     * @param body 
     * @param id 
     * @returns 
     */
    updateDigitalSign(body, id: number): Observable<any> {
        let url_ = "/api/core/business-customer/update-digital-sign/" + id;
        return this.requestPut(body, url_);
    }

    /**
     * cập nhập chữ ký số của khách hàng doanhg nghiệp bảng tạm
     * @param body 
     * @param id 
     * @returns 
     */
    updateDigitalSignTemp(body, id: number): Observable<any> {
        let url_ = "/api/core/business-customer/update-digital-sign-temp/" + id;
        return this.requestPut(body, url_);
    }

    /**
     * lấy dữ liệu chữ ký số của bảng khách hàng doanh nghiệp bảng tạm
     * @param id 
     * @returns 
     */
    getDigitalSignTemp(id: number) {
        let url_ = "/api/core/business-customer/get-digital-sign-temp/" + id;
        return this.requestGet(url_);
    }

    /**
     * lấy dữ liệu thống tin chữ ký số của khách hàng doanh nghiệp bảng thật
     * @param id 
     * @returns 
     */
    getDigitalSign(id: number) {
        let url_ = "/api/core/business-customer/get-digital-sign/" + id;
        return this.requestGet(url_);
    }

    getDigitalSignTradingProvider(): Observable<any> {
		let url_ = `/api/core/trading-provider/get-digital-sign`;
		return this.requestGet(url_);
	}
    updateDigitalSignTradingProvider(body): Observable<any> {
        let url_ = "/api/core/trading-provider/update-digital-sign";
        return this.requestPut(body, url_);
    }
}