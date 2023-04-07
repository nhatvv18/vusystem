import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    constructor(private _cookieService: CookieService) {
    }

    getToken() {
        return this._cookieService.get(AppConsts.authorization.accessToken);
    }

    clearToken() {
        this._cookieService.delete(AppConsts.authorization.accessToken, '/');
    }

    setToken(accessToken: string, tokenExpireDate: Date) {
        this._cookieService.set(AppConsts.authorization.accessToken, accessToken, tokenExpireDate, '/');
    }

	setRefreshToken(refreshToken: string) {
        this._cookieService.set(AppConsts.authorization.refreshToken, refreshToken, null, '/');
    }

	clearAllCookie() {
		this._cookieService.deleteAll();
	}
}