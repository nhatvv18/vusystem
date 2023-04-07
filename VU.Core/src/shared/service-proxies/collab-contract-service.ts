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
export class CollabContractService extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }    

    uploadFileGetUrl(file: File, folder = ''): Observable<any> {
        let url_: string = `/api/file/upload?folder=${folder}`;
        return this.requestPostFile(file, url_);
    }
    
    create(body): Observable<any> {
        return this.requestPost(body, "/api/core/collap-contract/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/core/collap-contract/update");
    }
    delete(id: number): Observable<void> {
        let url_ = "/api/core/collap-contract/delete/" + id;
        return this.requestDelete(url_);
    }
    get(id: number): Observable<any> {
        let url_ = "/api/core/collab-contract/get/" + id;
        return this.requestGet(url_);
    }

    downloadContractTemplateWord(tradingProviderId: any, contractTemplateId: any): Observable<any> {
        let url_ = `/api/core/manager-sale/file-template-word?`;
        if(tradingProviderId){
            url_ += this.convertParamUrl("tradingProviderId", tradingProviderId);
        }
        if(contractTemplateId){
            url_ += this.convertParamUrl("contractTemplateId", contractTemplateId);
        }
        return this.requestDownloadFile(url_);
    }

    downloadContractTemplatePdf(tradingProviderId: any, contractTemplateId: any): Observable<any> {
        let url_ = `/api/core/manager-sale/file-template-pdf?`;
        if(tradingProviderId){
            url_ += this.convertParamUrl("tradingProviderId", tradingProviderId);
        }
        if(contractTemplateId){
            url_ += this.convertParamUrl("contractTemplateId", contractTemplateId);
        }
        return this.requestDownloadFile(url_);
    }

    getAll(page: Page, status:any): Observable<any> {
        let url_ = "/api/core/collap-contract/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("status", status??'')
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        return this.requestGet(url_);
    }
}