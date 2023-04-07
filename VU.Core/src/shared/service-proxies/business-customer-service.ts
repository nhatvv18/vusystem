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
export class BusinessCustomerApproveServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-customer/approve/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/approve/update/" + body.businessCustomerTempId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/business-customer/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/approve/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, dataFilter?: any): Observable<any> {
        let url_ = "/api/core/business-customer/approve/find?";
        // url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        if(dataFilter) {
            if(page.keyword) url_ += this.convertParamUrl(dataFilter?.fieldFilter, page.keyword);
            if(dataFilter?.status) url_ += this.convertParamUrl("status", dataFilter?.status ?? '')
        }
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }

    partnerApprove(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/approve");
    } 

    partnerCancel(body){
        return this.requestPut(body, "/api/core/business-customer/cancel");
    }

    request(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-customer/request");
    }

    getDigitalSign(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/get-digital-sign-temp/" + id;
        return this.requestGet(url_);
    }

    updateDigitalSign(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/update-digital-sign-temp/" + body.businessCustomerTempId);
    }
}

@Injectable()
export class BusinessCustomerBankServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-customer/bank/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/bank/update/" + body.businessCustomerBankId);
    }

    updateApprove(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/bank-temp/update/" + body.id);
    }

    setDefault(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/bank/is-default");
    }
    setDefaultTemp(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/bank-temp/is-default");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/business-customer/bank/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/bank/" + id;
        return this.requestGet(url_);
    }

    getAll(businessCustomerId: number, page: Page): Observable<any> {
        let url_ = "/api/core/business-customer/bank/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('businessCustomerId', businessCustomerId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllApprove(businessCustomerTempId: number, page: Page): Observable<any> {
        let url_ = "/api/core/business-customer/bank-temp/find/" + businessCustomerTempId;
        // url_ += this.convertParamUrl("keyword", page.keyword);
        // url_ += this.convertParamUrl('pageSize', page.pageSize);
        // url_ += this.convertParamUrl('businessCustomerTempId', );
        // url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class BusinessCustomerServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-customer/approve/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/update/");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/business-customer/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, dataFilter?: any): Observable<any> {
        let url_ = "/api/core/business-customer/find-all?";
        // url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        if(dataFilter) {
            if(page.keyword) url_ += this.convertParamUrl(dataFilter?.fieldFilter, page.keyword);
            if(dataFilter?.isCheck) url_ += this.convertParamUrl('isCheck', dataFilter?.isCheck);
        }
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }
    
    showCheckUpdate(id:number): Observable<any>{
        let url_ ="/api/core/business-customer/check-update/" + id;
        return this.requestGet(url_)
    }

    check(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/check");
    }

    /**
     * GIAY TO DKKD
     */
    getAllBusiCusLicenseFile(id:number): Observable<any> {
        let url_ = "/api/core/business-license-file/find?businessCustomerId=" + id;
        return this.requestGet(url_);
    }

    getAllBusiCusLicenseFileTemp(id:number): Observable<any> {
        let url_ = "/api/core/business-license-file/find-temp?businessCustomerTempId=" + id;
        return this.requestGet(url_);
    }

    createBusiCusLicenseFile(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-license-file/add");
    }

    createBusiCusLicenseFileTemp(body): Observable<any> {
        return this.requestPost(body, "/api/core/business-license-file/add-temp");
    }

    deleteBusiCusLicenseFile(id: any): Observable<void> {
        let url_ = "/api/core/business-license-file/delete/" + id;
        return this.requestDelete(url_);
    }
    updateBusiCusLicenseFile(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-license-file/update/");
    }

    updateBusiCusLicenseFileTemp(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-license-file/update-temp/");
    }


    getDigitalSign(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/get-digital-sign/" + id;
        return this.requestGet(url_);
    }

    updateDigitalSign(body): Observable<any> {
        return this.requestPut(body, "/api/core/business-customer/update-digital-sign/" + body.businessCustomerTempId);
    }
}