import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class CookieManagerService {
    constructor(private _cookieService: CookieService) {
    }

    deleteCookie(name: string) {
        this._cookieService.delete(name);
    }
}