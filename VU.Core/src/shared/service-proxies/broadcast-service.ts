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
export class BroadcastService extends ServiceProxyBase {
	confirm(partnerId: any) {
		throw new Error("Method not implemented.");
	}
	private newsEndpoint = `/news`;
	private mediaEndpoint = `/media`;
	private knowledgeBaseEndpoint = `/knowledge-base`;

	constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(messageService, _cookieService, http, baseUrl);
		this.baseUrl = this.baseUrl.concat('/api/media')

	}

	getAll(page: Page, status: string): Observable<any> {
		let url_ = `${this.newsEndpoint}?`;
		if(status){
			url_ += this.convertParamUrl("status", status??'');
		}
		if(page.keyword.trim()) {
			url_ += this.convertParamUrl("q", page.keyword);
		}
		url_ += this.convertParamUrl("limit", page.pageSize);
		url_ += this.convertParamUrl("page", page.getPageNumber());

		return this.requestGet(url_);
	}

	createNews(body): Observable<any> {
		return this.requestPost(body, `${this.newsEndpoint}`);
	}
	saveNews(body): Observable<any> {
		let updateUrl = this.newsEndpoint.concat('/').concat(body.id)
		return this.requestPatch(body, `${updateUrl}`);
	}

	getAllMedia(page: Page, status: string, type:string, position:string): Observable<any> {
		let url_ = `${this.mediaEndpoint}?`;
		
		url_ += this.convertParamUrl("limit", page.pageSize);
		url_ += this.convertParamUrl("page", page.getPageNumber());
		if(page.keyword.trim()) {
			url_ += this.convertParamUrl("q", page.keyword);
		}
		if(status){
			url_ += this.convertParamUrl("status", status ??'');
		}
		if(type){
			url_ += this.convertParamUrl("type", type ??'');
		}
		if(position){
			url_ += this.convertParamUrl("position", position ??'');
		}
		return this.requestGet(url_);
	}
	createMedia(body): Observable<any> {
		return this.requestPost(body, `${this.mediaEndpoint}`);
	}
	saveMedia(body): Observable<any> {
		let updateUrl = this.mediaEndpoint.concat('/').concat(body.id)
		return this.requestPatch(body, `${updateUrl}`);
	}

	getAllKnowledgeBase(page: Page, status:any, category: any): Observable<any> {
		let url_ = `${this.knowledgeBaseEndpoint}?`;
		if(page.keyword) {
			url_ += this.convertParamUrl("q", page.keyword);
		}
		url_ += this.convertParamUrl("limit", page.pageSize);
		url_ += this.convertParamUrl("page", page.getPageNumber());
		if(status){
			url_ += this.convertParamUrl("status", status ??'');
		}
		if(category){
			url_ += this.convertParamUrl("category", category ??'');
		}

		return this.requestGet(url_);
	}
	saveKnowledgeBase(body): Observable<any> {
		let updateUrl = this.knowledgeBaseEndpoint.concat('/').concat(body.id)
		return this.requestPatch(body, `${updateUrl}`);
	}

	createKnowledgeBase(body): Observable<any> {
		return this.requestPost(body, `${this.knowledgeBaseEndpoint}`);
	}

	deleteKnowledgeBase(id): Observable<any> {
		return this.requestDelete(`${this.knowledgeBaseEndpoint.concat('/').concat(id)}`);
	}

}

