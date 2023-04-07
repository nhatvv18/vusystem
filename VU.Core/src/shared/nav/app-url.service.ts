import { Injectable } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '../session/app-session.service';

@Injectable()
export class AppUrlService {
    constructor(
        private readonly _appSessionService: AppSessionService
    ) {
    }

    get appRootUrl(): string {
      return this.getAppRootUrlOfTenant(null);
    }

    /**
     * Returning url ends with '/'.
     */
    getAppRootUrlOfTenant(tenancyName?: string): string {
        let baseUrl = this.ensureEndsWith(AppConsts.appBaseUrl, '/');
        return baseUrl;
    }

    private ensureEndsWith(str: string, c: string) {
        if (str.charAt(str.length - 1) !== c) {
            str = str + c;
        }

        return str;
    }

    private removeFromEnd(str: string, c: string) {
        if (str.charAt(str.length - 1) === c) {
            str = str.substr(0, str.length - 1);
        }

        return str;
    }
}
