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
export class IssuerServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/issuer/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/issuer/update/" + body.issuerId);
    }

    
    delete(id: number): Observable<void> {
        let url_ = "/api/bond/issuer/delete/" + id;
        return this.requestDelete(url_);
    }

    getIssuer(id: number): Observable<any> {
        let url_ = "/api/bond/issuer/" + id;
        return this.requestGet(url_);
    }
    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/find/" + id;
        return this.requestGet(url_);
    }
    getAll(page: Page): Observable<any> {
        let url_ = "/api/core/business-customer/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllIssuer(page: Page): Observable<any> {
        let url_ = "/api/bond/issuer/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

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
        return this.requestPut(body, "/api/core/business-customer/approve/update/" + body.approveId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/business-customer/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/approve/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/core/business-customer/approve/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}



@Injectable()
export class DepositProviderServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/deposit-provider/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/deposit-provider/update/" + body.depositProviderId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/deposit-provider/delete/" + id;
        return this.requestDelete(url_);
    }

    getDepositProvider(id: number): Observable<any> {
        let url_ = "/api/bond/deposit-provider/find/" + id;
        return this.requestGet(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/find/" + id;
        return this.requestGet(url_);
    }
    
    // getAll(page: Page): Observable<any> {
    //     let url_ = "/api/core/business-customer/find?";
    //     url_ += this.convertParamUrl("keyword", page.keyword);
    //     url_ += this.convertParamUrl('pageSize', page.pageSize);
    //     url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

    //     return this.requestGet(url_);
    // }

    getAll(page: Page, status?: string): Observable<any> {
        let url_ = "/api/bond/deposit-provider/find?";
        if(status){
            url_ += this.convertParamUrl("status", status);
        }
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        
        return this.requestGet(url_);
    }
}

@Injectable()
export class CalendarServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/calendar/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/calendar/update/");
    }

    get(workingDate): Observable<any> {
        let url_ = "/api/bond/calendar/" + workingDate;
        return this.requestGet(url_);
    }

    getAll(workingYear): Observable<any> {
        let url_ = "/api/bond/calendar/find/" + workingYear;
        return this.requestGet(url_);
    }
}

@Injectable()
export class TradingProviderServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/trading-provider/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/trading-provider/update/" + body.tradingProviderId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/trading-provider/delete/" + id;
        return this.requestDelete(url_);
    }

    getTradingProvider(id: number): Observable<any> {
        let url_ = "/api/core/trading-provider/find/" + id;
        return this.requestGet(url_);
    }
    get(id: number): Observable<any> {
        let url_ = "/api/core/business-customer/find/" + id;
        return this.requestGet(url_);
    }
    getAll(page: Page): Observable<any> {
        let url_ = "/api/core/business-customer/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
    getTradingProviderTaxCode(taxCode :String): Observable<any> {
        let url_ = "/api/core/trading-provider/find/tax-code/" + taxCode;
        // url_ += this.convertParamUrl("keyword", page.keyword);
        // url_ += this.convertParamUrl('pageSize', page.pageSize);
        // url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
    getAllTradingProvider(page: Page): Observable<any> {
        let url_ = "/api/core/trading-provider/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    createUser(body: any): Observable<any> {
        let url_ = "/api/core/trading-provider/user/create";
        return this.requestPost(body, url_);
    }

    changePassword(body: ChangePasswordDto | undefined): Observable<boolean> {
        let url_ = "/api/core/trading-provider/user/change-password";
        return this.requestPut(body, url_);
    }

    getAllUser(page: Page): Observable<any> {
        let url_ = "/api/core/trading-provider/user/find-all-user?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    active(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/core/trading-provider/user/active/" + id);
    }

    updateUser(body: any): Observable<any> {
        let url_ = "/api/core/trading-provider/update/" + body.userId;
        url_ = url_.replace(/[?&]$/, "");
        return this.requestPut(body, url_);
    }

    deleteUser(userId: number | undefined): Observable<void> {
        let url_ = "/api/core/trading-provider/user/delete/" + userId;
        url_ = url_.replace(/[?&]$/, "");
        return this.requestDelete(url_);
    }
}

@Injectable()
export class ProductCategoryServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-category/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-category/update/" + body.productCategoryId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-category/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-category/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/product-category/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductBondInterestServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-interest/add");
    }

    update(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-interest/update");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-bond-interest/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-bond-interest/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/product-bond-interest/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductBondTypeServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-type/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-type/update/" + body.id);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-bond-type/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-bond-type/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/product-bond-type/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductPolicyServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-policy/add");
    }

    update(body, id: number): Observable<any> {
        let url_ = "/api/bond/product-policy/update/" + id;
        return this.requestPut(body, url_);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-policy/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-policy/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, market?: string): Observable<any> {

        let url_ = "/api/bond/product-policy/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        if (market) {
            console.log({ marketSearch: market });
            url_ += this.convertParamUrl("market", market);
        }
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}
