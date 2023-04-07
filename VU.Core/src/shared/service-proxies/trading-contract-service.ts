import { AppConsts, OrderConst } from '@shared/AppConsts';
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
import * as moment from 'moment';
import { TableBody } from 'primeng/table';

@Injectable()
export class OrderServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    downloadFile(orderId, contractTempId): Observable<any> {
        let url_ = "/api/bond/export-contract/invest-bond?";
        url_ += this.convertParamUrl("orderId", orderId);
        url_ += this.convertParamUrl('contractTemplateId', contractTempId);
        return this.requestDownloadFile(url_);
    }

    createOrderContractFile(body): Observable<any> {
        return this.requestPost(body, "/api/bond/order/order-contract-file/add");
    }

    updateOrderContractFile(body): Observable<any> {
        return this.requestPut(body, "/api/bond/order/order-contract-file/update");
    }

    downloadFileScanContract(orderId, contractTempId, orderContractFileId): Observable<any> {
        let url_ = "/api/bond/export-contract/file-scan?";
        url_ += this.convertParamUrl("orderId", orderId);
        url_ += this.convertParamUrl('contractTemplateId', contractTempId);
        url_ += this.convertParamUrl('orderContractFileId', orderContractFileId);
        return this.requestDownloadFile(url_);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/order/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/order/update?orderId=" + body.orderId);
    }

    updateField(body, fieldInfo: any): Observable<any> {
        let url_ = fieldInfo.apiPath;
        url_ += this.convertParamUrl("orderId", body.orderId);
        url_ += this.convertParamUrl(fieldInfo.name, body[fieldInfo.name]);
        return this.requestPut(body, url_);
    }

    delete(id): Observable<void> {
        let url_ = "/api/bond/order/order/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/order/find/" + id;
        return this.requestGet(url_);
    }

    getPriceDate(bondSecondaryId, date = new Date()): Observable<any> {
        let url_ = "/api/bond/order/price/find?";
        url_ += this.convertParamUrl("bondSecondaryId", bondSecondaryId);
        url_ += this.convertParamUrl('priceDate', moment(date).format("YYYY/MM/DD"));
        return this.requestGet(url_);
    }

    getInfoBusinessCustomer(keyword:string) {
        let url_ = "/api/core/business-customer/find?";
        url_ += this.convertParamUrl("keyword", keyword);
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

    getInfoInvestorCustomer(keyword:string) {
        let url_ = "/api/core/manager-investor/find?";
        url_ += this.convertParamUrl("keyword", keyword);
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

    getAll(page: Page, type?: string, dataFilter?: any): Observable<any> {
        if(!type) type = 'order';
        let urlList = {
            order: '/api/bond/order/find?',
            orderContractProcessing: '/api/bond/order/find-contract-processing?',
            orderContract: '/api/bond/order/find-active?',
            orderContractBlockage: '/api/bond/order/find-cancel?',
        }
        let url_ = urlList[type];
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        if(dataFilter) {
            if(dataFilter?.bondSecondaryId) url_ += this.convertParamUrl('bondSecondaryId', dataFilter?.bondSecondaryId);
            if(dataFilter?.bondPolicyId) url_ += this.convertParamUrl('bondPolicyId', dataFilter?.bondPolicyId);
        }
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    activeOnline(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/order/update/source?orderId=" + id);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/order/update/approve?orderId=" + id);
    }

    cancel(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/order/update/cancel?orderId=" + id);
    }

    getCoupon(orderId) {
        return this.requestGet("/api/bond/order/interest/" + orderId);
    }
}

@Injectable()
export class OrderPaymentServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
		_cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/order/payment/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/order/payment/update" + body.orderPaymentId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/order/payment/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/order/payment/find" + id;
        return this.requestGet(url_);
    }
    
    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/order/payment/approve/" + id + "?status=2");
    }

    cancel(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/order/payment/approve/" + id + "?status=3");
    }

    getAll(page: Page, orderId): Observable<any> {
        let url_ = "/api/bond/order/payment/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('orderId', orderId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}


