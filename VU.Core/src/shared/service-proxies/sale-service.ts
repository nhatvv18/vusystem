import { SaleConst } from './../AppConsts';
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
export class SaleService extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/manager-sale/add");
    }

    updateTemp(body): Observable<any> {
        return this.requestPut(body, "/api/core/manager-sale/sale-temp-update-cms");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/manager-sale/sale-update");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/core/partner/delete/" + id;
        return this.requestDelete(url_);
    }

    getTemp(id: number): Observable<any> {
        let url_ = "/api/core/manager-sale/find-temp/" + id;
        return this.requestGet(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/core/manager-sale/find/" + id;
        return this.requestGet(url_);
    }

    getHistory(page: Page, saleId: number): Observable<any> {
        let url_ = "/api/core/manager-sale/find-all-history-sale?saleId="+ saleId+"&";
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }

    getAllTemp(page: Page, dataFilter?: any): Observable<any> {
        let url_ = "/api/core/manager-sale/find-all-temp?";
        //
        if(page.keyword) url_ += this.convertParamUrl(dataFilter?.field, page.keyword);
        if(dataFilter?.isInvestor) url_ += this.convertParamUrl('isInvestor', dataFilter?.isInvestor);
        if(dataFilter?.saleType) url_ += this.convertParamUrl('saleType', dataFilter?.saleType);
        if(dataFilter?.source) url_ += this.convertParamUrl('source', dataFilter?.source);
        if(dataFilter?.status) url_ += this.convertParamUrl('status', dataFilter?.status);
        
        //
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAll(page: Page, dataFilter?: any): Observable<any> {
        let url_ = "/api/core/manager-sale/find-all?";
        //
        if(dataFilter.departmentId) url_ += this.convertParamUrl('departmentId', dataFilter.departmentId);
        if(page.keyword) url_ += this.convertParamUrl(dataFilter?.field, page.keyword);
        if(dataFilter?.customerType) url_ += this.convertParamUrl('isInvestor', dataFilter?.customerType);
        if(dataFilter?.saleType) url_ += this.convertParamUrl('saleType', dataFilter?.saleType);
        if(dataFilter?.status) url_ += this.convertParamUrl('status', dataFilter?.status);
        //
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllSaleDirec(departmentId: any): Observable<any> {
        let url_ = "/api/core/department/find-all-list-sale-in-department?";
		url_ += this.convertParamUrl("pageSize", -1);
		url_ += this.convertParamUrl("departmentId", departmentId ??'');
		return this.requestGet(url_);
    }
    
    //
    getAllRegister(page: Page, dataFilter?: any): Observable<any> { 
        let url_ = "/api/core/manager-sale/find-all-register?";
        //
        // if(dataFilter.departmentId) url_ += this.convertParamUrl('departmentId', dataFilter.departmentId);
        if(page.keyword) url_ += this.convertParamUrl(dataFilter?.field, page.keyword);
        if(dataFilter?.status) url_ += this.convertParamUrl('status', dataFilter?.status);
        //
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    request(body): Observable<any> {
        return this.requestPost(body, "/api/core/manager-sale/request");
    }

    approve(body): Observable<any> {
        return this.requestPut(body, "/api/core/manager-sale/approve");
    }

    cancel(body): Observable<any> {
        return this.requestPut(body, "/api/core/manager-sale/cancel");
    }

    changeStatus(saleId): Observable<any> {
        return this.requestPut(null, "/api/core/manager-sale/active/" + saleId);
    }
    
    getAllDepartment() {
        let url_ = "/api/core/department/find-all?pageSize=-1";
        return this.requestGet(url_);
    }

    getDepartments(departmentId) {
        let url_ = "/api/core/department/find-all-department-not-department-current?departmentId=" + departmentId;
        return this.requestGet(url_);
    }

    getAllSaleTypeManagerInvestor(departmentId) {
        let url_ = "/api/core/department/find-all-list-sale-in-department?";
        url_ += this.convertParamUrl('departmentId', departmentId);
        url_ += this.convertParamUrl('saleType', SaleConst.TYPE_MANAGER);
        url_ += this.convertParamUrl('pageSize', -1);
        url_ += this.convertParamUrl('isInvestor', true);
        //
        return this.requestGet(url_);
    }

    getAllSaleTypeManager(departmentId) {
        let url_ = "/api/core/manager-sale/find-all?";
        url_ += this.convertParamUrl('departmentId', departmentId);
        url_ += this.convertParamUrl('saleType', SaleConst.TYPE_MANAGER);
        url_ += this.convertParamUrl('pageSize', -1);
        //
        return this.requestGet(url_);
    }
    // Lấy danh sách có saleType là sale hoặc quản lý
    getAllSale(departmentId) {
        // let url_ = "/api/core/manager-sale/find-all?";
        let saleTypes = SaleConst.TYPE_MANAGER + ',' + SaleConst.TYPE_EMPLOYEE;
        let url_ = "/api/core/department/find-all-list-sale-in-department?";
        url_ += this.convertParamUrl('departmentId', departmentId);
        url_ += this.convertParamUrl('saleTypes', saleTypes);
        url_ += this.convertParamUrl('pageSize', -1);
        //
        return this.requestGet(url_);
    }

    getInfoBusinessCustomer(keyword: string) {
        let url_ = "/api/core/business-customer/find?";
        if (keyword) url_ += this.convertParamUrl("keyword", keyword);
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

    getInfoInvestorCustomer(keyword: string) {
        let url_ = "/api/core/manager-investor/filter?requireKeyword=true&";
        if (keyword) url_ += this.convertParamUrl("keyword", keyword);
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

    updateCollabContractFileScan(body): Observable<any> {
        return this.requestPut(body, "/api/core/manager-sale/collab-contract/update-scan-contract");
    }

    createCollabContractFileScan(body): Observable<any> {
        return this.requestPost(body, "/api/core/manager-sale/collab-contract/add-scan-contract");
    }

    getAllSaleCollabContract(saleId): Observable<any> {
        let url_ = "/api/core/collap-contract/find-by-sale?";
        url_ += this.convertParamUrl("saleId", saleId);
        url_ += this.convertParamUrl('pageSize', -1);
        url_ += this.convertParamUrl('pageNumber', 1);
        return this.requestGet(url_);
    }
    
    updateSaleCollabContract(saleId: number): Observable<any> {
        let url_ = "/api/core/manager-sale/update-contract-file?";
        url_ += this.convertParamUrl("saleId", saleId);
        return this.requestPut(null, url_);
    }

    signSaleCollabContract(saleId: number): Observable<any> {
        let url_ = "/api/core/manager-sale/sign-contract-file?";
        url_ += this.convertParamUrl("saleId", saleId);
        return this.requestPut(null, url_);
    }

    downloadFileScanContract(collabContractId): Observable<any> {
        let url_ = "/api/core/manager-sale/collab-contract/export-file-scan?";
        url_ += this.convertParamUrl("collabContractId", collabContractId);
        return this.requestDownloadFile(url_);
    }

    downloadFileTempContract(collabContractId): Observable<any> {
        let url_ = "/api/core/manager-sale/collab-contract/export-file-temp?";
        url_ += this.convertParamUrl("collabContractId", collabContractId);
        return this.requestDownloadFile(url_);
    }

    downloadFileSignatureContract(collabContractId): Observable<any> {
        let url_ = "/api/core/manager-sale/collab-contract/export-file-signature?";
        url_ += this.convertParamUrl("collabContractId", collabContractId);
        return this.requestDownloadFile(url_);
    }

    tradingProviderByManagerSale(managerSaleId): Observable<any> {
        let url_ = "/api/core/manager-sale/trading-provider-by-manager-sale?";
        url_ += this.convertParamUrl("managerSaleId", managerSaleId);
        return this.requestGet(url_);
    } 

    directional(body): Observable<any> {
        return this.requestPost(body, "/api/core/manager-sale/root-direction-sale");
    }

}