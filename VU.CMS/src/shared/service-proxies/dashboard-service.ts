import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";

@Injectable()
export class DashBoardServiceProxy extends ServiceProxyBase {
    // private secondaryEndPoint = `/api/bond/secondary`;
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    /**
     * TẠO PHÁT HÀNH THỨ CẤP
     * @param body
     * @returns
     */
    getInfoDashBoard(dataFilter?: any): Observable<any> {
        let url_ = "/api/garner/dashboard/find-all?";
        if (dataFilter) {
            if (dataFilter?.firstDate) url_ += this.convertParamUrl('firstDate', dataFilter?.firstDate);
            if (dataFilter?.endDate) url_ += this.convertParamUrl('endDate', dataFilter?.endDate);
        }
        //
        return this.requestGet(url_);
    }
}