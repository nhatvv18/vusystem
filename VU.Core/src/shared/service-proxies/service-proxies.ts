import {
    mergeMap as _observableMergeMap,
    catchError as _observableCatch,
} from "rxjs/operators";
import {
    Observable,
    throwError as _observableThrow,
    of as _observableOf,
    throwError,
    timer,
} from "rxjs";
import { Injectable, Inject, Optional, InjectionToken } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpResponse,
    HttpResponseBase,
} from "@angular/common/http";

import * as moment from "moment";
import {
    API_BASE_URL,
    blobToText,
    ServiceProxyBase,
    throwException
} from "./service-proxies-base";
import { AppConsts } from "@shared/AppConsts";
import { Page } from "@shared/model/page";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class AccountServiceProxy extends ServiceProxyBase {

    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }
}

@Injectable()
export class ConfigurationServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

}

@Injectable()
export class RoleServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }
}

@Injectable()
export class SessionServiceProxy extends ServiceProxyBase {
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
        undefined;

    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    /**
     * @return Success
     */
    getCurrentLoginInformations(): Observable<any> {
        let url_ = this.baseUrl + "/api/services/app/Session/GetCurrentLoginInformations";
        url_ = url_.replace(/[?&]$/, "");

        return this.requestGet(url_);
    }
}

@Injectable()
export class TokenAuthServiceProxy extends ServiceProxyBase {

    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    protected processAuthenticate(response: HttpResponseBase): Observable<AuthenticateResultModel> {
        const status = response.status;
        const responseBlob = response instanceof HttpResponse ? response.body : (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {};
        if (response.headers) {
            for (let key of response.headers.keys()) {
                _headers[key] = response.headers.get(key);
            }
        }
        if (status === 200) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap((_responseText) => {
                    let result200: any = null;
                    let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                    result200 = AuthenticateResultModel.fromJS(resultData200);
                    return _observableOf(result200);
                })
            );
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(
                _observableMergeMap((_responseText) => {
                    console.log({ _responseText: _responseText });
                    const _responseTextPare = _responseText ? JSON.parse(_responseText) : _responseText;
                    const networkStatus = navigator.onLine;
                    const titleMessage = _responseTextPare ? _responseTextPare.message : networkStatus ? "Kết nối bị gián đoạn. Vui lòng thử lại!" : "Kết nối mạng bị gián đoạn!";
                    this.messageService.add({ severity: "error", summary: "", detail: titleMessage, life: 60000 });
                    return throwException(titleMessage, status, _responseText, _headers);
                })
            );
        }
        return _observableOf<AuthenticateResultModel>(<any>null);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    authenticate(
        body: AuthenticateModel | undefined
    ): Observable<AuthenticateResultModel> {
        let url_ = this.baseUrl + "/api/users/login";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);
        const contentParse_ = JSON.parse(content_);

        const params = new HttpParams()
            .set('username', contentParse_.username)
            .set('password', contentParse_.password)
            .set('grant_type', AppConsts.grantType.password)
            .set('client_id', AppConsts.clientId)
            .set('client_secret', AppConsts.clientSecret);

        let options_: any = {
            body: {
                username: contentParse_.username,
                password: contentParse_.password,
            },
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Accept: "text/plain",
            }),
        };

        return this.http
            .request("post", url_, options_)
            .pipe(
                _observableMergeMap((response_: any) => {
                    return this.processAuthenticate(response_);
                })
            ).pipe(
                _observableCatch((response_: any) => {
                    if (response_ instanceof HttpResponseBase) {
                        try {
                            return this.processAuthenticate(<any>response_);
                        } catch (e) {
                            return <Observable<AuthenticateResultModel>>(
                                (<any>_observableThrow(e))
                            );
                        }
                    } else {
                        return <Observable<AuthenticateResultModel>>(
                            (<any>_observableThrow(response_))
                        );
                    }
                })
            );
    }
}

@Injectable()
export class UserServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    create(body: any): Observable<any> {
        let url_ = "/api/users/create-user";
        return this.requestPost(body, url_);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    update(body: any): Observable<any> {
        let url_ = "/api/users/update-user/" + body.userId;
        url_ = url_.replace(/[?&]$/, "");
        return this.requestPut(body, url_);
    }

    getById(userId: number): Observable<any> {
        let url_ = "/api/users/find-by-id/" + userId;
        url_ = url_.replace(/[?&]$/, "");
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/users/find-all-user?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    // Gọi phân quyền: Không truyền-Full, 1-Core, 2-Bond, 3-Invest, 4-Support, 5-User, 6-Garner, 7-RealState
    getAllPermission(): Observable<any> {
        let url_ = "/api/users/get-permission?permissionInWeb=1";
        return this.requestGet(url_);
    }

    /**
     * @param id (optional)
     * @return Success
     */
    delete(userId: number | undefined): Observable<void> {
        let url_ = "/api/users/delete-user/" + userId;
        url_ = url_.replace(/[?&]$/, "");
        return this.requestDelete(url_);
    }


    /**
     * @param body (optional)
     * @return Success
     */
    changePassword(body: ChangePasswordDto | undefined): Observable<boolean> {
        let url_ = this.baseUrl + "/api/services/app/User/ChangePassword";
        return this.requestPost(body, url_);
    }

    /**
     * @param body (optional)
     * @return Success
     */
    resetPassword(body: any | undefined): Observable<boolean> {
        let url_ = this.baseUrl + "/api/services/app/User/ResetPassword";
        return this.requestPost(body, url_);
    }

    /**
     * LOGIN ROCKET CHAT
     */
    loginRocketchat(): Observable<any> {
        let url_ = AppConsts.rocketchat.api + `/api/rocketchat/login-token`;
		let options_: any = {
			observe: "response",
			responseType: "application/json",
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Accept: "text/plain",
				...this.getHeaderToken(),
			}),
			withCredentials: true
		};
        return this.http.post(url_, {}, options_);
    }

    /**
     * LẤY TOKEN SSO
     */
    getSso() {
        let url_ = AppConsts.rocketchat.api + "/api/rocketchat/sso1";
        this.http.get(url_).subscribe();
    }
	
	/**
	 * LOG OUT SSO
	 * @returns 
	 */
	logoutSSO() {
		let url_ = AppConsts.rocketchat.api + "/api/rocketchat/logout";

		let options_: any = {
			observe: "response",
			responseType: "application/json",
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				Accept: "text/plain",
				...this.getHeaderToken(),
			}),
			withCredentials: true
		};
        return this.http.post(url_, {}, options_);
	}
}

@Injectable()
export class RefreshServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }
}

export class AuthenticateModel implements IAuthenticateModel {
    username: string;
    password: string;
    rememberClient: boolean;
    clientId: string = 'client1';
    clientSecret: string = 'secret1';

    constructor(data?: IAuthenticateModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.username = _data["username"];
            this.password = _data["password"];
            this.rememberClient = _data["rememberClient"];
        }
    }

    static fromJS(data: any): AuthenticateModel {
        data = typeof data === "object" ? data : {};
        let result = new AuthenticateModel();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["username"] = this.username;
        data["password"] = this.password;
        data["rememberClient"] = this.rememberClient;
        return data;
    }

    clone(): AuthenticateModel {
        const json = this.toJSON();
        let result = new AuthenticateModel();
        result.init(json);
        return result;
    }
}

export interface IAuthenticateModel {
    username: string;
    password: string;
    rememberClient: boolean;
    clientId: string;
    clientSecret: string;
}

export class AuthenticateResultModel implements IAuthenticateResultModel {
    access_token: string | undefined;
    refresh_token: string | undefined;
    encryptedAccessToken: string | undefined;
    expires_in: number;
    userId: number;

    constructor(data?: IAuthenticateResultModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.access_token = _data["access_token"];
            this.refresh_token = _data["refresh_token"];
            this.encryptedAccessToken = _data["encryptedAccessToken"];
            this.expires_in = _data["expires_in"];
            this.userId = _data["userId"];
        }
    }

    static fromJS(data: any): AuthenticateResultModel {
        data = typeof data === "object" ? data : {};
        let result = new AuthenticateResultModel();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["access_token"] = this.access_token;
        data["refresh_token"] = this.refresh_token;
        data["encryptedAccessToken"] = this.encryptedAccessToken;
        data["expires_in"] = this.expires_in;
        data["userId"] = this.userId;
        return data;
    }

    clone(): AuthenticateResultModel {
        const json = this.toJSON();
        let result = new AuthenticateResultModel();
        result.init(json);
        return result;
    }
}

export interface IAuthenticateResultModel {
    access_token: string | undefined;
    refresh_token: string | undefined;
    encryptedAccessToken: string | undefined;
    expires_in: number;
    userId: number;
}

export class ChangePasswordDto implements IChangePasswordDto {
    currentPassword: string;
    newPassword: string;

    constructor(data?: IChangePasswordDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.currentPassword = _data["currentPassword"];
            this.newPassword = _data["newPassword"];
        }
    }

    static fromJS(data: any): ChangePasswordDto {
        data = typeof data === "object" ? data : {};
        let result = new ChangePasswordDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["currentPassword"] = this.currentPassword;
        data["newPassword"] = this.newPassword;
        return data;
    }

    clone(): ChangePasswordDto {
        const json = this.toJSON();
        let result = new ChangePasswordDto();
        result.init(json);
        return result;
    }
}

export interface IChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export class CreateRoleDto implements ICreateRoleDto {
    name: string;
    displayName: string;
    normalizedName: string | undefined;
    description: string | undefined;
    grantedPermissions: string[] | undefined;
    roleType: string | undefined;

    constructor(data?: ICreateRoleDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.displayName = _data["displayName"];
            this.normalizedName = _data["normalizedName"];
            this.description = _data["description"];
            if (Array.isArray(_data["grantedPermissions"])) {
                this.grantedPermissions = [] as any;
                for (let item of _data["grantedPermissions"])
                    this.grantedPermissions.push(item);
            }
        }
    }

    static fromJS(data: any): CreateRoleDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateRoleDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["name"] = this.name;
        data["displayName"] = this.displayName;
        data["normalizedName"] = this.normalizedName;
        data["description"] = this.description;
        if (Array.isArray(this.grantedPermissions)) {
            data["grantedPermissions"] = [];
            for (let item of this.grantedPermissions)
                data["grantedPermissions"].push(item);
        }
        return data;
    }

    clone(): CreateRoleDto {
        const json = this.toJSON();
        let result = new CreateRoleDto();
        result.init(json);
        return result;
    }
}

export interface ICreateRoleDto {
    name: string;
    displayName: string;
    normalizedName: string | undefined;
    description: string | undefined;
    grantedPermissions: string[] | undefined;
    roleType: string | undefined;
}

export class CreateUserDto implements ICreateUserDto {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames: string[] | undefined;
    password: string;
    maNhanVien: string | undefined;

    constructor(data?: ICreateUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.userName = _data["userName"];
            this.name = _data["name"];
            this.surname = _data["surname"];
            this.emailAddress = _data["emailAddress"];
            this.isActive = _data["isActive"];
            if (Array.isArray(_data["roleNames"])) {
                this.roleNames = [] as any;
                for (let item of _data["roleNames"]) this.roleNames.push(item);
            }
            this.password = _data["password"];
            this.maNhanVien = _data["maNhanVien"];
        }
    }

    static fromJS(data: any): CreateUserDto {
        data = typeof data === "object" ? data : {};
        let result = new CreateUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === "object" ? data : {};
        data["userName"] = this.userName;
        data["name"] = this.name;
        data["surname"] = this.surname;
        data["emailAddress"] = this.emailAddress;
        data["isActive"] = this.isActive;
        if (Array.isArray(this.roleNames)) {
            data["roleNames"] = [];
            for (let item of this.roleNames) data["roleNames"].push(item);
        }
        data["password"] = this.password;
        data["maNhanVien"] = this.maNhanVien;
        return data;
    }

    clone(): CreateUserDto {
        const json = this.toJSON();
        let result = new CreateUserDto();
        result.init(json);
        return result;
    }
}

export interface ICreateUserDto {
    userName: string;
    name: string;
    surname: string;

    emailAddress: string;
    isActive: boolean;
    roleNames: string[] | undefined;
    password: string;
}

export class UserDto implements IUserDto {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    fullName: string | undefined;
    lastLoginTime: moment.Moment | undefined;
    creationTime: moment.Moment;
    roleNames: string[] | undefined;
}

export interface IUserDto {
    id: number;
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    fullName: string | undefined;
    lastLoginTime: moment.Moment | undefined;
    creationTime: moment.Moment;
    roleNames: string[] | undefined;
}