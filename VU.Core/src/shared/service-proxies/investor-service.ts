import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable, Inject, Optional } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { API_BASE_URL, ServiceProxyBase } from "./service-proxies-base";
import { Page } from "@shared/model/page";
import { AppConsts, InvestorConst } from "@shared/AppConsts";
import { MessageService } from "primeng/api";
import { CookieService } from "ngx-cookie-service";

@Injectable({
	providedIn: 'root'
})
export class InvestorServiceProxy extends ServiceProxyBase {
	confirm(partnerId: any) {
		throw new Error("Method not implemented.");
	}

	private investorEndpoint = `/api/investor-temp`;
	private investorAccountEndpoint = `/api/bond/investor-account`;

	constructor(messageService: MessageService, _cookieService: CookieService, @Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(messageService, _cookieService, http, baseUrl);
	}

	postEkycTemp(body): Observable<any> {
		return this.requestPostFileUtilTemp(body, `/api/core/manager-investor/ekyc`);
	}

	/**
	 * POST EKYC LAY THONG TIN 
	 * @param body
	 * @returns
	 */
	postEkyc(body): Observable<any> {
		return this.requestPostFileUtil(body, `${this.investorEndpoint}/ekyc`);
	}

	/**
	 * THEM MOI INVESTOR
	 * @param body 
	 * @returns 
	 */
	createInvestor(body): Observable<any> {
		return this.requestPost(body, `${this.investorEndpoint}/add`);
	}
	/**
	 * XAC MINH TAI KHOAN
	 * @param body 
	 * @returns 
	 */
	accountVerification(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/app-investor/identification`);
	}

	/**
	 * Check nhận diện mặt
	 * @param body 
	 * @returns 
	 */
	checkFace(body): Observable<any> {
		return this.requestPostFileUtil(body, `${this.investorEndpoint}/face-image`);
	}

	/**
	 * THEM GIAY TO
	 * @param body 
	 * @returns 
	 */
	createIdentification(body): Observable<any> {
		return this.requestPost(body, `${this.investorEndpoint}/add/identification`);
	}

	/**
	 * CAP NHAT GIAY TO
	 * @param body 
	 * @returns 
	 */
	replaceIdentification(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/identification/replace`);
	}
	
	/**
	 * tạo user
	 * @param body 
	 * @returns 
	 */
	createUser(body): Observable<any> {
		return this.requestPost(body, `${this.investorEndpoint}/add/user`);
	}

	/**
	 * CAP NHAT THONG TIN INVESTOR (KHONG CAP NHAT GIAY TO)
	 * @param body 
	 * @returns 
	 */
	updateInvestor(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/update`);
	}

	/**
	 * RESET PASSWORD
	 * @param body 
	 * @returns 
	 */
	resetPassword(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/user/reset/password`);
	}

	/**
	 * RESET PASSWORD
	 * @param body 
	 * @returns 
	 */
	resetPasswordListAccount(body): Observable<any> {
		return this.requestPut(body, `${this.investorAccountEndpoint}/user/reset/password`);
	}

	/**
	 * ĐỔI TRẠNG THÁI USER
	 * @param body 
	 * @returns 
	 */
	changeUserStatus(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/user/status`);
	}

	/**
	 * TRINH DUYET
	 * @param investorGroupId
	 * @returns
	 */
	request(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/request`);
	}

	requestPhone(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/request/phone`);
	}

	requestEmail(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/request/email`);
	}

	/**
	 * DUYET
	 * @param body
	 * @returns
	 */
	approve(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/approve`);
	}

	approvePhone(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/approve/phone`);
	}

	cancelPhone(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/cancel/phone`);
	}

	approveEmail(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/approve/email`);
	}

	cancelEmail(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/cancel/email`);
	}

	// HUY DUYET
	cancel(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/cancel`);
	}

	/**
	 * EPIC XÁC MINH
	 * @param body 
	 * @returns 
	 */
	checkInvestor(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/check`);
	}

	/**
	 * EPIC XÁC MINH
	 * @param body 
	 * @returns 
	 */
	resetPin(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/pin`);
	}

	resetPinEpic(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/pin-epic`);
	}

	/**
	 * EPIC XÁC MINH
	 * @param body 
	 * @returns 
	 */
	resetPinListAccount(body): Observable<any> {
	return this.requestPut(body, `${this.investorAccountEndpoint}/pin`);
	}

	/**
	 * SUPER ADMIN DUYET
	 * @param body
	 * @returns
	 */
	superAdminApprove(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/sa/approve`);
	}

	/**
	 * Get investor ở bảng investor thật
	 * @param page
	 * @param status
	 * @returns
	 */
	getAll(page: Page, dataFilter?: any): Observable<any> {
		let url_ = `${this.investorEndpoint}/all?`;
		if(dataFilter) {
			if(page.keyword) url_ += this.convertParamUrl(dataFilter?.fieldFilter, page.keyword);
			if(dataFilter?.isCheck) url_ += this.convertParamUrl('isCheck', dataFilter?.isCheck);
			if(dataFilter?.isPro) url_ += this.convertParamUrl('isPro', dataFilter?.isPro);
			if(dataFilter?.status) url_ += this.convertParamUrl('status', dataFilter?.status);
		}
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("isNoPaging", false);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

		return this.requestGet(url_);
	}

	/**
	 * Lấy danh sách tài khoản theo investorid
	 * @param page 
	 * @param investorId 
	 * @returns 
	 */
	getListUsers(page: Page, investorId: any): Observable<any> {
		let url_ = `${this.investorEndpoint}/list-users?`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		url_ += this.convertParamUrl("investorId", investorId);

		return this.requestGet(url_);
	}

	/**
	 * Get list investor thật
	 * @param page
	 * @param status
	 * @returns
	 */
	getInvestorList(page: Page, dataFilter?: any): Observable<any> {
		let url_ = `${this.investorEndpoint}/filter?requireKeyword=false&`;
		// url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("isNoPaging", false);
		if(dataFilter) {
			if(page.keyword) url_ += this.convertParamUrl(dataFilter?.fieldFilter, page.keyword);
			if(dataFilter?.isCheck) url_ += this.convertParamUrl('isCheck', dataFilter?.isCheck);
			if(dataFilter?.isPro) url_ += this.convertParamUrl('isPro', dataFilter?.isPro);
		}
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	getInvestorListNotify(page: Page, status: any, dataFilter?: any): Observable<any> {
		let url_ = `/api/users/find-users-fcm-tokens?`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("isNoPaging", false);
		url_ += this.convertParamUrl("status", status ??'');
		if(dataFilter) {
			if(dataFilter?.fullname) url_ += this.convertParamUrl('fullname', dataFilter?.fullname);
			if(dataFilter?.phone) url_ += this.convertParamUrl('phone', dataFilter?.phone);
			if(dataFilter?.isCheck) url_ += this.convertParamUrl('isCheck', dataFilter?.isCheck);
			if(dataFilter?.isPro) url_ += this.convertParamUrl('isPro', dataFilter?.isPro);
		}
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}
	//
	getAllInvestorListNotify(): Observable<any> {
		let url_ = `/api/users/find-users-fcm-tokens?`;
		url_ += this.convertParamUrl("pageSize", 1000000);
		url_ += this.convertParamUrl("pageNumber", 1);
		return this.requestGet(url_);
	}

	/**
	 * LẤY LIST INVESTOR TẠM 
	 * @param page 
	 * @param status 
	 * @returns 
	 */
	getInvestorTemporary(page: Page, dataFilter?: any): Observable<any> {
		let url_ = `${this.investorEndpoint}/find-all?`;
		// url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		if(dataFilter) {
			if(page.keyword) url_ += this.convertParamUrl(dataFilter?.fieldFilter?.trim(), page.keyword);
		}
		
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	/**
	 * GET INVESTOR THEO INVESTOR ID VA INVESTOR GROUP ID TU BANG THAT HOAC BANG TEMP
	 * @param investorId 
	 * @param investorGroupId 
	 * @returns 
	 */
	getInvestor(investorId, isTemp): Observable<any> {
		let queryIsTemp = isTemp == InvestorConst.TEMP.YES ? true : false;
		let paramInvestor = `&isNeedDefaultIdentification=true&isNeedReferralInvestor=true&isNeedApproveStatus=true&isNeedDefaultBank=true&isNeedListIdentification=true&isNeedListBank=true&isNeedDefaultAddress=true`;
		let url_ = `${this.investorEndpoint}/${investorId}?isTemp=${queryIsTemp}${paramInvestor}`;
		return this.requestGet(url_);
	}

	/**
	 * GET INVESTOR THEO INVESTOR ID VA INVESTOR GROUP ID TU BANG THAT HOAC BANG TEMP
	 * @param investorId 
	 * @param investorGroupId 
	 * @returns 
	 */
	
	 getAllInvestorAccount(page: Page, dataFilter?:any ): Observable<any> {
		let url_ = `/api/bond/investor-account/find?`;
		//
		if(page.keyword) url_ += this.convertParamUrl(dataFilter?.field, page.keyword);
		if(dataFilter?.status) url_ += this.convertParamUrl("status", dataFilter?.status ?? '');
		//
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());

		return this.requestGet(url_);
	 }

	//TAO BANK CHO INVESTOR
	createBank(body): Observable<any> {
        return this.requestPost(body, `${this.investorEndpoint}/add/bank`);
    }

	createStock(body): Observable<any> {
        return this.requestPost(body, `${this.investorEndpoint}/add/stock`);
    }

	//BANK DEFAULT
    setDefaultBank(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/default/bank`);
    }

	deleteBankAccount(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/bank-acc`);
	}

	setDefaultStock(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/default/stock`);
    }

	//CHƯA CÓ 
	updateBank(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/bank-acc/update`);
    }

	//LIST BANKS 
	getAllBank(page: Page, isTemp: number, investorId: number): Observable<any> {
		let queryIsTemp = isTemp == InvestorConst.TEMP.YES ? true : false;
		let url_ = `${this.investorEndpoint}/list-banks?investorId=${investorId}&isTemp=${queryIsTemp}&`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	getAllStock(page: Page, isTemp: number, investorId: number, investorGroupId: number): Observable<any> {
		let queryIsTemp = isTemp == InvestorConst.TEMP.YES ? true : false;
		let url_ = `${this.investorEndpoint}/list-stock?investorId=${investorId}&IsTemp=${queryIsTemp}&InvestorGroupId=${investorGroupId}&`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	//CREATE CONTACT ADDRESS
	createContactAddress(body): Observable<any> {
        return this.requestPost(body, `${this.investorEndpoint}/add/contact-address`);
    }

	//DEFAULT CONTACT ADDRESS
	setDefaultContactAddress(body): Observable<any> {
		return this.requestPut(body, `${this.investorEndpoint}/default/contact-address`);
	}

	//CHƯA CÓ 
	updateContactAddress(body): Observable<any> {
		return this.requestPost(body, `${this.investorEndpoint}/update/contact-address`);
	}

	//GETALL CONTACT ADDRESS
	getAllContactAddress(page: Page, isTemp: number, investorId: number): Observable<any> {
		let queryIsTemp = isTemp == InvestorConst.TEMP.YES ? true : false;
		let url_ = `${this.investorEndpoint}/list-contact-address?investorId=${investorId}&isTemp=${queryIsTemp}&`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	//DEFAULT IDENTIFICATION
	setDefaultIdentification(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/default/identification`);
    }

	//TAO AVATAR
	createAvatar(body): Observable<any> {
		return this.requestPutFileUtil(body, `${this.investorEndpoint}/avatar`);
	}

	//DIFF TRINH DUYET
	getDiff(investorIdTemp: number): Observable<any> {
		
		let url_ = `${this.investorEndpoint}/diff/${investorIdTemp}`;
		return this.requestGet(url_);
	}

	//CHUNG MINH NĐT CHUYÊN NGHIỆP
	getInvestorProfessional(page: Page,referId: number): Observable<any> {
		
		let url_ = `/api/core/approve/all?dataType=10&referId=${referId}&`;
		url_ += this.convertParamUrl("keyword", page.keyword);
		url_ += this.convertParamUrl("pageSize", page.pageSize);
		url_ += this.convertParamUrl("pageNumber", page.getPageNumber());
		return this.requestGet(url_);
	}

	getInvestorProfessionalFile(referIdTemp: number): Observable<any> {
		
		let url_ = `/api/core/manager-investor/${referIdTemp}/prof`;
	
		return this.requestGet(url_);
	}

	/**
	 * 
	 * @param investorId 
	 * @returns 
	 */
	getInvestorSale(investorId: number): Observable<any> {
		
		let url_ = `${this.investorEndpoint}/sale/${investorId}`;
		return this.requestGet(url_);
	}

	createInvestorSale(body): Observable<any> {
		
        return this.requestPost(body, `${this.investorEndpoint}/add/sale`);
    }

	setDefaultSale(body): Observable<any> {
        return this.requestPut(body, `${this.investorEndpoint}/sale/default`);
    }

	getAllSaleFilter(keyword): Observable<any> {
        let url_ = "/api/core/manager-sale/find-all?";
        //
		url_ += this.convertParamUrl("referralCode", keyword);
        url_ += this.convertParamUrl('pageSize', -1);

        return this.requestGet(url_);
    }

	getInvestorReferral(investorId: number): Observable<any> {
		let paramInvestorReferral = `IsNeedReferralInvestor=true`
		let url_ = `${this.investorEndpoint}/${investorId}?${paramInvestorReferral}`;
		return this.requestGet(url_);
	}

	/**
	 * DELETE INVESTOR ACCOUNT
	 */
	deleteInvestorAccount(id: number): Observable<void> {
		let url_ = "/api/users/" + id;
		return this.requestDelete(url_);
    }


	/**
	 * 
	 */

	getBankAccount(bankId: any, bankAccount: any): Observable<any> {
		let url_ = `/api/payment/msb/inquiry-bank-account?`;
		url_ += this.convertParamUrl("bankId", bankId);
		url_ += this.convertParamUrl("bankAccount", bankAccount);
		return this.requestGet(url_);
	}
}


