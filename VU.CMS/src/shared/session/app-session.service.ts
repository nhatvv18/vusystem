import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

import {
    SessionServiceProxy, UserServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { TokenService } from '@shared/services/token.service';

/**
 * các thông tin user hiện tại
 */
@Injectable()
export class AppSessionService {

    private _user: any;
    private _application: any;

    constructor(
        private _userService: UserServiceProxy,
        private _tokenService: TokenService) {
    }

    get application(): any {
        return this._application;
    }

    get user(): any {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.userId : null;
    }

    getShownLoginName(): string {
        const userName = this._user.userName;
        return userName;
    }

    /**
     * Khởi tạo
     * @returns 
     */
    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                const token = this._tokenService.getToken();
                if (token) {
                    const userInfo: any = jwt_decode(token);
                    console.log({ userInfo: userInfo });
                    this._user = {
                        displayName: userInfo.display_name,
                        userName: userInfo.username,
                        email: userInfo.email,
                        userId: userInfo.sub,
                    };
                }
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
