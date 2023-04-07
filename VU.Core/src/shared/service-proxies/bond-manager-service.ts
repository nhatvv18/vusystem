import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";
import { Page } from "@shared/model/page";
import { AppConsts, ProductBondInfoConst, ProductBondPrimaryConst, ProductBondSecondaryConst } from "@shared/AppConsts";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";
import { PageBondPolicyTemplate } from "@shared/model/pageBondPolicyTemplate";
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from "primeng/tristatecheckbox";

/**
 * PHÁT HÀNH THỨ CẤP
 */
@Injectable()
export class ProductBondSecondaryServiceProxy extends ServiceProxyBase {
    private secondaryEndPoint = `/api/bond/secondary`;
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    /**
     * TẠO PHÁT HÀNH THỨ CẤP
     * @param body
     * @returns
     */
    create(body): Observable<any> {
        return this.requestPost(body, `${this.secondaryEndPoint}/add`);
    }

    /**
     * CẬP NHẬT PHÁT HÀNH THỨ CẤP
     * @param body
     * @param id
     * @returns
     */
    update(body): Observable<any> {
        return this.requestPut(body, `${this.secondaryEndPoint}/update`);
    }

    delete(id: number): Observable<void> {
        let url_ = `${this.secondaryEndPoint}/delete/` + id;
        return this.requestDelete(url_);
    }

    request(body): Observable<any> {
        return this.requestPost(body, "/api/bond/secondary/request");
    }
    
    approve(body): Observable<any> {
        return this.requestPut(body, "/api/bond/secondary/approve");
    }

    cancel(body): Observable<any> {
        return this.requestPut(body, "/api/bond/secondary/cancel");
    }

    getById(id: number): Observable<any> {
        let url_ = `${this.secondaryEndPoint}/` + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, status: string): Observable<any> {
        let url_ = `${this.secondaryEndPoint}/find?`;
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("isNoPaging", false);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
        url_ += this.convertParamUrl('status', status ?? '');

        return this.requestGet(url_);
    }
    
    getAllNoPaging(): Observable<any> {
        let url_ = `${this.secondaryEndPoint}/find?`;
        url_ += this.convertParamUrl("pageSize", -1);
        url_ += this.convertParamUrl("isNoPaging", false);
        url_ += this.convertParamUrl('status', ProductBondSecondaryConst.STATUS.HOAT_DONG);

        return this.requestGet(url_);
    }

    getAllBondPrimary(): Observable<any> {
        let url_ = "/api/bond/product-bond-primary/find-by-trading";
        return this.requestGet(url_);
    }

    /**
     * TRÌNH DUYỆT PHÁT HÀNH THỨ CẤP
     * @param body
     * @param id
     * @returns
     */
    submit(secondaryId): Observable<any> {
        return this.requestPut({}, `${this.secondaryEndPoint}/trading-provider-submit/${secondaryId}`);
    }

    /**
     * ĐLSC DUYỆT/BỎ DUYỆT PHÁT HÀNH THỨ CẤP
     * @param body
     * @param secondaryId
     * @param status
     * @returns
     */
    changeStatus(secondaryId, status): Observable<any> {
        let url = `${this.secondaryEndPoint}/trading-provider-approve/${secondaryId}?`;
        url += this.convertParamUrl("status", status);

        return this.requestPut({}, url);
    }

    /**
     * BAT TAT CLOSED
     * @param secondaryId
     * @param isCancel
     * @returns
     */
    toggleIsClosed(secondaryId, isClose): Observable<any> {
        let url = `${this.secondaryEndPoint}/is-close/${secondaryId}?`;
        url += this.convertParamUrl("isClose", isClose);

        return this.requestPut(null, url);
    }

    /**
     * BAT TAT PHAT HANH THU CAP SHOW APP
     * @param secondaryId
     * @param isShowApp
     * @returns
     */
    toggleIsShowApp(secondaryId, isShowApp): Observable<any> {
        let url = `${this.secondaryEndPoint}/is-show-app/${secondaryId}?`;
        url += this.convertParamUrl("isShowApp", isShowApp);

        return this.requestPut(null, url);
    }

    /**
     * BAT TAT POLICY SHOW APP
     * @param secondaryId
     * @param isShowApp
     * @returns
     */
    toggleIsShowAppPolicy(secondaryId, isShowApp): Observable<any> {
        let url = `${this.secondaryEndPoint}/policy-is-show-app/${secondaryId}?`;
        url += this.convertParamUrl("isShowApp", isShowApp);

        return this.requestPut(null, url);
    }

    /**
     * BAT TAT POLICY DETAIL SHOW APP
     * @param secondaryId
     * @param isShowApp
     * @returns
     */
    toggleIsShowAppPolicyDetail(secondaryId, isShowApp): Observable<any> {
        let url = `${this.secondaryEndPoint}/policy-detail-is-show-app/${secondaryId}?`;
        url += this.convertParamUrl("isShowApp", isShowApp);

        return this.requestPut(null, url);
    }

    /**
     * TẠO CHÍNH SÁCH
     * @param body
     * @returns
     */
    addPolicy(body): Observable<any> {
        return this.requestPost(body, `${this.secondaryEndPoint}/add-policy`);
    }
    /**
     * SỬA CHÍNH SÁCH
     * @param body
     * @returns
     */
    updatePolicy(body, id): Observable<any> {
        return this.requestPut(body, `${this.secondaryEndPoint}/update-policy/${id}`);
    }
    /**
     * XOÁ CHÍNH SÁCH
     * @param body
     * @returns
     */
    deletePolicy(id): Observable<any> {
        return this.requestDelete(`${this.secondaryEndPoint}/delete-policy/${id}`);
    }
    /**
     * TẠO CHÍNH SÁCH CON
     * @param body
     * @returns
     */
    addPolicyDetail(body): Observable<any> {
        return this.requestPost(body, `${this.secondaryEndPoint}/add-policy-detail`);
    }
    /**
     * SỬA CHÍNH SÁCH CON
     * @param body
     * @returns
     */
    updatePolicyDetail(body, id): Observable<any> {
        return this.requestPut(body, `${this.secondaryEndPoint}/update-policy-detail/${id}`);
    }
    /**
     * XOÁ CHÍNH SÁCH CON
     * @param body
     * @returns
     */
    deletePolicyDetail(id): Observable<any> {
        return this.requestDelete(`${this.secondaryEndPoint}/delete-policy-detail/${id}`);
    }

    importPriceFromExcel(body, bondSecondaryId: number): Observable<any> {
        return this.requestPostFileUtil(body, `${this.secondaryEndPoint}/import-price-from-excel/${bondSecondaryId}`);
    }

    getAllSecondPrice(page: Page, bondSecondaryId: number): Observable<any> {
        let url_ = `${this.secondaryEndPoint}/find-second-price?`;
        url_ += this.convertParamUrl("pageSize", -1);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
        url_ += this.convertParamUrl("bondSecondaryId", bondSecondaryId);

        return this.requestGet(url_);
    }

    deleteSecondPrice(bondSecondaryId: number): Observable<any> {
        return this.requestDelete(`${this.secondaryEndPoint}/delete-second-price/${bondSecondaryId}`);
    }

    check(body): Observable<any> {
        return this.requestPut(body, "/api/bond/secondary/check");
    }
}

@Injectable()
export class ProductBondSecondaryFileServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/policy-file/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/policy-file/update/" + body.policyFileId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/policy-file/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/policy-file/find/" + id;
        return this.requestGet(url_);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/file/approve/" + id);
    }

    cancel(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/file/cancel/" + id);
    }

    getAll(page: Page, bondSecondaryId): Observable<any> {
        let url_ = "/api/bond/policy-file/fileAll/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('bondSecondaryId', bondSecondaryId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}
@Injectable()
export class ProductBondDetailServiceProxy extends ServiceProxyBase {
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-detail/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/issuer/update/" + body.productBondDetailId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-bond-detail/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-bond-detail/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, market?: string): Observable<any> {
        let url_ = "/api/bond/product-bond-detail/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        if (market) {
            url_ += this.convertParamUrl("market", market);
        }
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllBondInfo(page: Page): Observable<any> {
        let url_ = "/api/bond/product-bond-info/find?";
        url_ += this.convertParamUrl("pageSize", -1);

        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductBondInfoServiceProxy extends ServiceProxyBase {
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-info/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-info/update/" + body.productBondId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-bond-info/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-bond-info/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, status: string): Observable<any> {
        let url_ = "/api/bond/product-bond-info/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
        url_ += this.convertParamUrl("status", status ?? '');
        return this.requestGet(url_);
    }

    getAllIssuer(page: Page): Observable<any> {
        let url_ = "/api/bond/issuer/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllDepositProvider(page: Page): Observable<any> {
        let url_ = "/api/bond/deposit-provider/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllBondType(): Observable<any> {
        let url_ = "/api/bond/product-bond-type/find?";
        url_ += this.convertParamUrl("pageSize", -1);
        return this.requestGet(url_);
    }

    request(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-info/request");
    }

    approve(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-info/approve");
    }

    cancel(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-info/cancel");
    }

    close(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-info/close");
    }

    check(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-info/check");
    }

    getCoupon(id: number): Observable<any> {
        return this.requestGet("/api/bond/product-bond-info/coupon/" + id);
    }
}

@Injectable()
export class ProductBondPrimaryServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-primary/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-primary/update/" + body.bondPrimaryId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/product-bond-primary/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/product-bond-primary/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, status: string): Observable<any> {
        let url_ = "/api/bond/product-bond-primary/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);

        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());
        url_ += this.convertParamUrl('status', status ?? '');

        return this.requestGet(url_);
    }

    request(body): Observable<any> {
        return this.requestPost(body, "/api/bond/product-bond-primary/request");
    }

    cancel(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-primary/cancel");
    }

    check(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-primary/check");
    }

    approve(body): Observable<any> {
        return this.requestPut(body, "/api/bond/product-bond-primary/approve");
    }

    close(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/product-bond-primary/change-approve-to-close/" + id);
    }

    getAllList(): Observable<any> {
        let url_ = "/api/bond/product-bond-primary/find?";
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

    getFindForTradingProvider(tradingProdviderId): Observable<any> {
        let url_ = "/api/bond/product-bond-primary/find-by-trading/" + tradingProdviderId;
        return this.requestGet(url_);
    }

    getAllBondInfo(page: Page): Observable<any> {
        let url_ = "/api/bond/product-bond-info/find?";
        url_ += this.convertParamUrl('pageSize', -1);
        url_ += this.convertParamUrl('status', ProductBondInfoConst.HOAT_DONG);

        return this.requestGet(url_);
    }

    getAllTradingProvider(page: Page): Observable<any> {
        let url_ = "/api/bond/trading-provider/find?";
        url_ += this.convertParamUrl("pageSize", -1);

        return this.requestGet(url_);
    }

    getAllBondType(): Observable<any> {
        let url_ = "/api/bond/product-bond-type/find?";
        url_ += this.convertParamUrl('pageSize', -1);
        return this.requestGet(url_);
    }
}

@Injectable()
export class ContractTemplateServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/contract-template/add");
    }

    changeStatus(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/contract-template/change-status?id=" + id);
    }

    uploadFileGetUrl(file: File, folder = ''): Observable<any> {
        let url_: string = `/api/file/upload?folder=${folder}`;
        return this.requestPostFile(file, url_);
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/contract-template/update/");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/contract-template/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/contract-template/find/" + id;
        return this.requestGet(url_);
    }

    getByOrder(page: Page, orderId): Observable<any> {
        let url_ = "/api/bond/contract-template/find-by-order?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        if (orderId) {
            url_ += this.convertParamUrl("orderId", orderId);
        }
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAll(page: Page, classify: number): Observable<any> {
        let url_ = "/api/bond/contract-template/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        if (classify) {
            url_ += this.convertParamUrl("classify", classify);
        }
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllContractTypeIssuer(page: Page): Observable<any> {
        let url_ = "/api/bond/contract-type/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }

}

@Injectable()
export class ContractTypeServiceProxy extends ServiceProxyBase {
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/contract-type/add");
    }

    update(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/bond/contract-type/update/" + id);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/contract-type/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/contract-type/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/contract-type/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }
}
/**
 * CHÍNH SÁCH VÀ BÁN THEO KỲ HẠN
 */
@Injectable()
export class ProductBondPolicyServiceProxy extends ServiceProxyBase {
    constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/secondary/add");
    }

    update(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/bond/secondary/update");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/secondary/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/secondary/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/policy-temp/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("pageSize", page.pageSize);
        url_ += this.convertParamUrl("isNoPaging", false);
        url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

        return this.requestGet(url_);
    }

    getAllTemporaryNoPaging(): Observable<any> {
        let url_ = "/api/bond/policy-temp/find?";
        url_ += this.convertParamUrl("pageSize", -1);
        url_ += this.convertParamUrl("isNoPaging", true);

        return this.requestGet(url_);
    }
}

@Injectable()
export class DistributionContractServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/distribution-contract/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/distribution-contract/update/" + body.distributionContractId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/distribution-contract/delete/" + id;
        return this.requestDelete(url_);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/duyet/" + id);
    }

    pending(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/pending/" + id);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/distribution-contract/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page): Observable<any> {
        let url_ = "/api/bond/distribution-contract/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class DistributionContractPaymentServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/distribution-contract/payment/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/distribution-contract/payment/update/" + body.paymentId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/distribution-contract/payment/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/distribution-contract/payment/find/" + id;
        return this.requestGet(url_);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/payment/approve/" + id);
    }

    cancel(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/payment/cancel/" + id);
    }

    getAll(page: Page, distributionContractId): Observable<any> {
        let url_ = "/api/bond/distribution-contract/payment/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('contractId', distributionContractId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductBondInfoFileServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/juridical-file/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/juridical-file/update/" + body.juridicalFileId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/juridical-file/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/juridical-file/file/find" + id;
        return this.requestGet(url_);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/file/approve/" + id);
    }

    cancel(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/file/cancel/" + id);
    }

    getAll(page: Page, productBondId): Observable<any> {
        let url_ = "/api/bond/juridical-file/file/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('productBondId', productBondId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class DistributionContractFileServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/distribution-contract/file/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/distribution-contract/file/update/" + body.fileId);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/distribution-contract/file/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/distribution-contract/file/find/" + id;
        return this.requestGet(url_);
    }

    approve(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/distribution-contract/file/approve/" + id);
    }

    cancel(body): Observable<any> {
        return this.requestPut(body, "/api/bond/distribution-contract/file/cancel");
    }

    getAll(page: Page, distributionContractId): Observable<any> {
        let url_ = "/api/bond/distribution-contract/file/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('contractId', distributionContractId);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class ProductBondPolicyTemplateServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/policy-temp/add");
    }

    createBondPolicyDetailTemplate(body): Observable<any> {
        return this.requestPost(body, "/api/bond/policy-temp/add-policy-detail-temp");
    }

    update(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/bond/policy-temp/update?id=" + id);
    }

    updateBondPolicyDetailTemplate(body, id: number): Observable<any> {
        return this.requestPut(body, "/api/bond/policy-temp/update-policy-detail-temp?id=" + id);
    }

    changeStatusBondPolicyTemplate(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/policy-temp/change-status?id=" + id);
    }
    changeStatusBondPolicyDetailTemplate(id: number): Observable<any> {
        return this.requestPut(null, "/api/bond/policy-temp/change-status-policy-detail-temp?id=" + id);
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/policy-temp/delete?id=" + id;
        return this.requestDelete(url_);
    }

    deleteBondPolicyDetailTemplate(id: number): Observable<void> {
        let url_ = "/api/bond/policy-temp/delete-policy-detail-temp?id=" + id;
        return this.requestDelete(url_);
    }

    // get(id: number): Observable<any> {
    //     let url_ = "/api/bond/contract-type/find/" + id;
    //     return this.requestGet(url_);
    // }

    getAll(page: PageBondPolicyTemplate): Observable<any> {
        let url_ = "/api/bond/policy-temp/find?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("status", page.status);
        url_ += this.convertParamUrl("isNoPaging", false);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}

@Injectable()
export class GuaranteeAssetServiceProxy extends ServiceProxyBase {
    constructor(
        messageService: MessageService,
        _cookieService: CookieService,
        @Inject(HttpClient) http: HttpClient,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(messageService, _cookieService, http, baseUrl);
    }

    create(body): Observable<any> {
        return this.requestPost(body, "/api/bond/guarantee-asset/add");
    }

    update(body): Observable<any> {
        return this.requestPut(body, "/api/bond/guarantee-asset/update");
    }

    delete(id: number): Observable<void> {
        let url_ = "/api/bond/guarantee-asset/delete/" + id;
        return this.requestDelete(url_);
    }

    deleteFile(id: number): Observable<void> {
        let url_ = "/api/bond/guarantee-asset/file/delete/" + id;
        return this.requestDelete(url_);
    }

    get(id: number): Observable<any> {
        let url_ = "/api/bond/guarantee-asset/find/" + id;
        return this.requestGet(url_);
    }

    getAll(page: Page, productBondId): Observable<any> {
        let url_ = "/api/bond/guarantee-asset/findAll?";
        url_ += this.convertParamUrl("keyword", page.keyword);
        url_ += this.convertParamUrl("productBondId", productBondId);
        url_ += this.convertParamUrl('pageSize', page.pageSize);
        url_ += this.convertParamUrl('pageNumber', page.getPageNumber());

        return this.requestGet(url_);
    }
}