import { mergeMap as _observableMergeMap, catchError as _observableCatch, map } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Inject, Optional, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
import { AppConsts } from "@shared/AppConsts";
import { AuthenticateResultModel, IAuthenticateResultModel } from "./service-proxies";
import jwtDecode from "jwt-decode";
import * as moment from "moment";

export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");


/**
 * Base cho request
 */
export class ServiceProxyBase {
	protected http: HttpClient;
	protected baseUrl: string;
	protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
	protected messageService: MessageService;
	protected _cookieService: CookieService;

	constructor(messageService: MessageService, cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		this.messageService = messageService;
		this._cookieService = cookieService;
		this.http = http;
		this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
	}

	/**
	 * 
	 * @returns API BASE URL
	 */
	public getBaseApiUrl() {
		return this.baseUrl;
	}

	private unixToDate(UNIX_timestamp) {
		return moment.unix(UNIX_timestamp).toDate();
	}

	/**
	 *
	 * @param cookie
	 * @returns
	 */
	private getToken(cookie: any = AppConsts.authorization.accessToken) {
		const accessToken = this._cookieService?.get(cookie) || "";
		return accessToken;
	}

	/**
	 *
	 * @param cookie
	 * @returns Object Authorization token Để gửi kèm Headers
	 */
	private getHeaderToken(cookie: any = AppConsts.authorization.accessToken) {
		const result = `Bearer ${this.getToken(cookie)}`;
		return {
			Authorization: result,
		};
	}

	/**
	 *
	 * @returns
	 */
	private isExpired() {
		return !this._cookieService?.check(AppConsts.authorization.accessToken);
	}

	/**
	 * Kiểm tra null hoặc undefined
	 * @param value
	 * @returns trả về true nếu thoả mãn
	 */
	protected checkNullOrUndefined(value: any, name: String = null): boolean {
		if (value === null || typeof value === "undefined") throw new Error(`The parameter ${name} cannot be null or undefined`);
		return true;
	}

	/**
	 * nếu value undefined throw ra Error
	 * @param name
	 * @param value
	 * @returns trả về dạng name=value&
	 */
	protected convertParamUrl(name: string, value: number | string | boolean) {
		return name + "=" + encodeURIComponent("" + value) + "&";
	}

	/**
	 * Đẩy về object
	 * @param data
	 * @returns
	 */
	protected fromJS(data: any): object {
		data = typeof data === "object" ? data : {};
		return data;
	}

	/**
	 * @param body (optional)
	 * @return Success
	 */
	private refreshToken(body: any): Observable<any> {
		let url_ = this.baseUrl + "/connect/token";
		url_ = url_.replace(/[?&]$/, "");

		const content_ = JSON.stringify(body);
		const contentParse_ = JSON.parse(content_);
		const refreshToken = this._cookieService.get(AppConsts.authorization.refreshToken);

		console.log("REFRESH TOKEN", this._cookieService.get("refresh_token"));

		const params = new HttpParams()
			.set("refresh_token", refreshToken)
			.set("grant_type", AppConsts.grantType.refreshToken)
			.set("client_id", AppConsts.clientId)
			.set("client_secret", AppConsts.clientSecret);

		let options_: any = {
			body: params.toString(),
			observe: "response",
			responseType: "blob",
			headers: new HttpHeaders({
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "text/plain",
			}),
		};

		return this.http
			.request("post", url_, options_)
			.pipe(
				_observableMergeMap((response_: any) => {
					return this.processRefresh(response_);
				})
			).pipe(
				_observableCatch((response_: any) => {
					if (response_ instanceof HttpResponseBase) {
						try {
							return this.processRefresh(<any>response_);
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
			);;
	}

	private processRefresh(response: HttpResponseBase): Observable<IRefreshAction> {
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

					const rs: IRefreshAction = {
						action: AppConsts.localRefreshAction.setToken,
						data: result200,
					}
					return _observableOf(rs);
				})
			);
		} else if (status !== 200 && status !== 204) {
			return blobToText(responseBlob).pipe(
				_observableMergeMap((_responseText) => {
					const valid = this._cookieService.check(AppConsts.authorization.accessToken);
					if (valid) {
						const rs: IRefreshAction = {
							action: AppConsts.localRefreshAction.doNothing,
							data: null,
						}
						return _observableOf(rs);
					}
					const titleMessage = "Hết phiên đăng nhập";
					this.messageService.add({ severity: "error", summary: "", detail: titleMessage, life: 1800 });
					//
					setTimeout(() => {
						window.location.href = AppConsts.baseUrlHome;
					}, 2000);
					//
					return throwException(titleMessage, status, _responseText, _headers);
				})
			);
		}
		return _observableOf<IRefreshAction>(<any>null);
	}

	/**
	 * 
	 * @returns 
	 */
	public postRefreshToken(): Observable<any> {
		return this.refreshToken(null).pipe(
			_observableMergeMap((result: IRefreshAction) => {
				console.log({ resultLogin: result });

				if (result.action === AppConsts.localRefreshAction.setToken) {
					const accessToken = result.data.access_token;
					const refreshToken = result.data.refresh_token;
					/**
					 * exp trong token la unix timestamp
					 */
					const exp = jwtDecode(accessToken)["exp"];
					const tokenExpireDate = this.unixToDate(exp);
					this._cookieService.set(AppConsts.authorization.accessToken, accessToken, tokenExpireDate, "/");
					this._cookieService.set(AppConsts.authorization.refreshToken, refreshToken, null, "/");
				}

				return _observableOf(result.data);
			})
		);
	}

	/**
	 * Get method
	 * @param url
	 * @returns
	 */
	public requestGet(url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");

		const fnc = (url_) => {
			let options_: any = {
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.request("get", url_, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_);
				})
			);
		}

		return fnc(url_);
	}

	/**
	 * DOWNLOAD FILE | content-disposition: filename | content-type: application/octet-stream
	 * @param url
	 * @returns
	 */
	public requestDownloadFile(url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");

		const fnc = (url_) => {
			let options_: any = {
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.get(url_, options_)
				.pipe(
					_observableMergeMap(async (response_: any) => {
						const contentDisposition = (response_.headers.get('content-disposition') || '').split(';');
						let filename = '';
						if (contentDisposition[1] && contentDisposition[1].includes('=')) {
							// LẤY TÊN FILE
							filename = contentDisposition[1].split('=')[1];
						} 
						else {
							// BÁO LỖI
							const err = await response_.body.text();
							return <Observable<any>>(JSON.parse(err));
						}
						// TẢI FILE
						let objectUrl = window.URL.createObjectURL(response_.body);
						
						const anchor = document.createElement('a');

						anchor.href = objectUrl;
						anchor.download = filename;
						anchor.click();

						window.URL.revokeObjectURL(objectUrl);
						const result: any = '{"status":1,"data":null,"code":200,"message":""}';
						return <Observable<any>>(JSON.parse(result));
					}),
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_);
				})
			);
		}

		return fnc(url_);
	}

	/**
	 * request post
	 * @param body
	 * @returns
	 */
	public requestPost(body: any | undefined, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");

		const content_ = JSON.stringify(body);

		const fnc = (url_, content_) => {
			let options_: any = {
				body: content_,
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.request("post", url_, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_, content_);
				})
			);
		}

		return fnc(url_, content_);
	}

	public requestPostFormData(body: FormData, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");

		return this.http.post(url_, body).pipe(
			_observableCatch((response_: any) => {
				this.messageService.add({ key: "tst", severity: "error", summary: "", detail: `${response_.error.error.message}` });
				return response_;
			})
		);
	}

	/**
	 * put method
	 * @param body object gửi đi
	 * @param url dạng "/api/services/app/Role/Update"
	 * @returns Observable<TDto>
	 */
	public requestPut(body: any | undefined, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, ""); //? hoặc & ở cuối sẽ được loại bỏ

		const content_ = JSON.stringify(body);

		const fnc = (url_, content_) => {
			let options_: any = {
				body: content_,
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.request("put", url_, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_, content_);
				})
			);
		}

		return fnc(url_, content_);
	}
	/**
		 * put method
		 * @param body object gửi đi
		 * @param url dạng "/api/services/app/Role/Update"
		 * @returns Observable<TDto>
		 */
	public requestPatch(body: any | undefined, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, ""); //? hoặc & ở cuối sẽ được loại bỏ

		const content_ = JSON.stringify(body);

		const fnc = (url_, content_) => {
			let options_: any = {
				body: content_,
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.request("patch", url_, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_, content_);
				})
			);
		}

		return fnc(url_, content_);
	}
	public requestPutFormData(body: any | undefined, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, ""); //? hoặc & ở cuối sẽ được loại bỏ

		return this.http.put(url_, body).pipe(
			_observableCatch((response_: any) => {
				if (response_ instanceof HttpResponseBase) {
					try {
						return this.processResponse(<any>response_);
					} catch (e) {
						return <Observable<any>>(<any>_observableThrow(e));
					}
				} else return <Observable<any>>(<any>_observableThrow(response_));
			})
		);
	}

	/**
	 * Delete method
	 * @param url
	 * @returns
	 */
	public requestDelete(url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");

		const fnc = (url_) => {
			let options_: any = {
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.request("delete", url_, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<void>>(<any>_observableThrow(e));
							}
						} else return <Observable<void>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			return this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_);
				})
			);
		}

		return fnc(url_);
	}

	/**
	 * request post
	 * @param body
	 * @returns
	 */
	protected requestPostFile(file: File, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");
		let formData: FormData = new FormData();
		formData.append("file", file, file.name);

		const fnc = (url_, formData) => {
			let options_: any = {
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.post(url_, formData, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_, formData);
				})
			);
		}

		return fnc(url_, formData);
	}

	/**
	 * request post
	 * @param body
	 * @returns
	 */
	protected requestPostFileUtil(body: { file: null }, url: String): Observable<any> {
		let url_ = this.baseUrl + url;
		url_ = url_.replace(/[?&]$/, "");
		let formData: FormData = new FormData();

		Object.keys(body).forEach(key => {
			const value = body[key];
			console.log({ value });
			if (value instanceof File) {
				formData.append(key, value, value?.name);
			} else {
				formData.append(key, value);
			}
		});

		const fnc = (url_, formData) => {
			let options_: any = {
				observe: "response",
				responseType: "blob",
				headers: new HttpHeaders({
					Accept: "text/plain",
					...this.getHeaderToken(),
				}),
			};

			return this.http
				.post(url_, formData, options_)
				.pipe(
					_observableMergeMap((response_: any) => {
						return this.processResponse(response_);
					})
				)
				.pipe(
					_observableCatch((response_: any) => {
						if (response_ instanceof HttpResponseBase) {
							try {
								return this.processResponse(<any>response_);
							} catch (e) {
								return <Observable<any>>(<any>_observableThrow(e));
							}
						} else return <Observable<any>>(<any>_observableThrow(response_));
					})
				);
		};

		if (this.isExpired()) {
			this.postRefreshToken().pipe(
				_observableMergeMap((response_: any) => {
					return fnc(url_, formData);
				})
			);
		}

		return fnc(url_, formData);
	}

	public processResponse(response: HttpResponseBase, fromJs: Function = null): Observable<any> {
		const status = response.status;
		const responseBlob = response instanceof HttpResponse ? response.body : (<any>response).error instanceof Blob ? (<any>response).error : undefined;

		let _headers: any = {};
		if (response.headers) {
			for (let key of response.headers.keys()) {
				_headers[key] = response.headers.get(key);
			}
		}

		if (status === 200 || status === 201 || status === 202) {
			return blobToText(responseBlob).pipe(
				_observableMergeMap((_responseText) => {
					let result200: any = null;
					let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
					if (fromJs) {
						result200 = fromJs(resultData200);
					} else {
						result200 = this.fromJS(resultData200);
					}
					return _observableOf(result200);
				})
			);
		} else if (status == 400) {
			return blobToText(responseBlob).pipe(
				_observableMergeMap((_responseText) => {
					try {
						const resJson = JSON.parse(_responseText);
						console.log("_responseText -> json", resJson);
						this.messageService.add({ key: "tst", severity: "error", summary: "", detail: resJson.error.validationErrors[0].message });
					} catch {
						console.log("_responseText", _responseText);
					}
					return throwException("An unexpected server error occurred.", status, _responseText, _headers);
				})
			);
		} else if (status !== 200 && status !== 204) {
			return blobToText(responseBlob).pipe(
				_observableMergeMap((_responseText) => {
					const resJson = JSON.parse(_responseText);
					try {
						console.log("_responseText -> json", resJson);
						this.messageService.add({ key: "tst", severity: "error", summary: "", detail: resJson.error.message });
					} catch {
						if (resJson?.message == null) {
							this.messageService.add({ severity: "error", summary: "", detail: "Có lỗi xảy ra vui lòng thử lại sau!" });
						}
						this.messageService.add({ severity: "error", summary: "", detail: resJson?.message });
						console.log("_responseText", _responseText);
					}
					return throwException("An unexpected server error occurred.", status, _responseText, _headers);
				})
			);
		}
		return _observableOf<any>(<any>null);
	}
}

export class ApiException extends Error {
	message: string;
	status: number;
	response: string;
	headers: { [key: string]: any };
	result: any;

	constructor(message: string, status: number, response: string, headers: { [key: string]: any }, result: any) {
		super();

		this.message = message;
		this.status = status;
		this.response = response;
		this.headers = headers;
		this.result = result;
	}

	protected isApiException = true;

	static isApiException(obj: any): obj is ApiException {
		return obj.isApiException === true;
	}
}

export function throwException(message: string, status: number, response: string, headers: { [key: string]: any }, result?: any): Observable<any> {
	if (result !== null && result !== undefined) return _observableThrow(result);
	else {
		return _observableThrow(new ApiException(message, status, response, headers, null));
	}
}

export function blobToText(blob: any): Observable<string> {
	return new Observable<string>((observer: any) => {
		if (!blob) {
			observer.next("");
			observer.complete();
		} else {
			let reader = new FileReader();
			reader.onload = (event) => {
				observer.next((<any>event.target).result);
				observer.complete();
			};
			reader.readAsText(blob);
		}
	});
}


export interface IRefreshAction {
	data?: IAuthenticateResultModel,
	action: string,
}