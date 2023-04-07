import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";
import { Page } from "@shared/model/page";
import { AppConsts } from "@shared/AppConsts";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class FileServiceProxy extends ServiceProxyBase {
	confirm(partnerId: any) {
		throw new Error("Method not implemented.");
	}
	private fileEndpoint = `/api/file`;

	constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(messageService, _cookieService, http, baseUrl);
	}

	/**
	 * UPLOAD FILE 
	 * @param body TRUYỀN JSON NHƯ BÌNH THƯỜNG. BÊN TRONG TỰ CHUYỂN JSON => FORM DATA
	 * @param folder TÊN FOLDER SẼ LƯU TRÊN BACKEND
	 * @returns 
	 */
	uploadFile(body, folder = ''): Observable<any> {
        let url_: string = `${this.fileEndpoint}/upload?folder=${folder}`;
        return this.requestPostFileUtil(body, url_);
    }
}
