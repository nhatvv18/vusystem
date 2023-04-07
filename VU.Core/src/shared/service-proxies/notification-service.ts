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
export class NotificationService extends ServiceProxyBase {
	confirm(partnerId: any) {
		throw new Error("Method not implemented.");
	}
	private notificationEndpoint = `/notification`;
	private notificationTemplateEndpoint = `/notification-template`;

	constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(messageService, _cookieService, http, baseUrl);
		this.baseUrl = AppConsts.nodeBaseUrl;
		this.baseUrl = this.baseUrl.concat('/api/media')
	}

	getAll(page: Page): Observable<any> {
		let url_ = `${this.notificationEndpoint}?`;
		if (page.keyword) {
			url_ += this.convertParamUrl("q", page.keyword);
		}
		url_ += this.convertParamUrl("limit", page.pageSize); 
		url_ += this.convertParamUrl("page", page.getPageNumber());

		return this.requestGet(url_);
	}

	createNotification(body): Observable<any> {
		return this.requestPost(body, `${this.notificationEndpoint}`);
	}
	deleteNotification(id): Observable<any> {
		let deleteUrl = this.notificationEndpoint.concat('/').concat(id)
		return this.requestDelete(deleteUrl);
	}
	saveNotification(body): Observable<any> {
		let updateUrl = this.notificationEndpoint.concat('/').concat(body.id)
		return this.requestPatch(body, `${updateUrl}`);
	}

	getAllNotificationTemplate(page: Page,status?: any): Observable<any> {
		let url_ = `${this.notificationTemplateEndpoint}?`;
		if (page.keyword) {
			url_ += this.convertParamUrl("q", page.keyword);
		}
		if (status) {
			url_ += this.convertParamUrl("status", status);
		}
		url_ += this.convertParamUrl("limit", page.pageSize); 
		url_ += this.convertParamUrl("page", page.getPageNumber());
		return this.requestGet(url_);
	}

	getPersonList(notificationId, page: Page, filters, isAll = false): Observable<any> {
		let url_ = `${this.notificationEndpoint.concat('/sending-list/').concat(notificationId)}?`;
		url_ += this.convertParamUrl("q", page.keyword);
		url_ += this.convertParamUrl("limit", !isAll ? page.pageSizeNotify : page.pageSizeAll); 
		url_ += this.convertParamUrl("page", !isAll ? page.getPageNumber() : page.pageNumberFirst);
		//
		Object.keys(filters).forEach(key => {
			if(filters[key]) url_ += this.convertParamUrl(key, filters[key].join(','));
		})
		//
		return this.requestGet(url_);
	}

	getNotificationDetail(notificationId): Observable<any> {
		let url_ = `${this.notificationEndpoint.concat('/').concat(notificationId)}?`;
		return this.requestGet(url_);
	}

	createNotificationTemplate(body): Observable<any> {
		return this.requestPost(body, `${this.notificationTemplateEndpoint}`);
	}
	saveNotificationTemplate(body): Observable<any> {
		let updateUrl = this.notificationTemplateEndpoint.concat('/').concat(body.id)
		return this.requestPatch(body, `${updateUrl}`);
	}

	deleteNotificationTemplate(id): Observable<any> {
		let deleteUrl = this.notificationTemplateEndpoint.concat('/').concat(id)
		return this.requestDelete(deleteUrl);
	}
	addPeopleToNotification(body, id): Observable<any> {
		return this.requestPost(body, `${this.notificationEndpoint.concat("/sending-list/").concat(id)}`);
	}
  
	createOrUpdateSystemNotification(body, type): Observable<any> {
		return this.requestPost(body, `${this.notificationEndpoint.concat("/system?type=").concat(type)}`);
	}
	
	pushNotification(body): Observable<any> {
		return this.requestPost(body, `${this.notificationEndpoint.concat("/send")}`);
	}
	deleteKH(id): Observable<any> {
		let deleteUrl = this.notificationEndpoint.concat('/delete-customer?ids=').concat(id)
		return this.requestDelete(deleteUrl);
	}

	getSystemNotification(type): Observable<any> {
		return this.requestGet(`${this.notificationEndpoint.concat("/system?type=").concat(type)}`);
	}

	getProviderConfiguration(): Observable<any> {
		let url_ = `/notification/config`;
		return this.requestGet(url_);
	}

	createProviderConfiguration(body): Observable<any> {
		return this.requestPut(body, `/notification/config`);
	}

}

