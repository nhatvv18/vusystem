import { Injectable, Injector } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from './shared/AppConsts';
import { AppSessionService } from './shared/session/app-session.service';
import { environment } from './environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppInitializer {
    constructor(
        private _injector: Injector,
        private _platformLocation: PlatformLocation,
        private _httpClient: HttpClient,
    ) { }

    init(): () => Promise<boolean> {
        return () => {
            return new Promise<boolean>((resolve, reject) => {
                AppConsts.appBaseHref = this.getBaseHref();
                const appBaseUrl = this.getDocumentOrigin() + AppConsts.appBaseHref;
                this.getApplicationConfig(appBaseUrl, () => {
                    const appSessionService = this._injector.get(AppSessionService);
                    appSessionService.init().then(
                        (result) => {
                            resolve(result);
                        },
                        (err) => {
                            reject(err);
                        }
                    );
                });
            });
        };
    }

    private getBaseHref(): string {
        const baseUrl = this._platformLocation.getBaseHrefFromDOM();
        if (baseUrl) {
            return baseUrl;
        }

        return '/';
    }

    private getDocumentOrigin(): string {
        if (!document.location.origin) {
            const port = document.location.port ? ':' + document.location.port : '';
            return (
                document.location.protocol + '//' + document.location.hostname + port
            );
        }

        return document.location.origin;
    }

    private getApplicationConfig(appRootUrl: string, callback: () => void) {
        this._httpClient
            .get<any>(`${appRootUrl}assets/${environment.appConfig}`, {
                headers: {},
            })
            .subscribe((response) => {
                AppConsts.appBaseUrl = response.appBaseUrl;
                AppConsts.remoteServiceBaseUrl = response.remoteServiceBaseUrl;
                AppConsts.nodeBaseUrl = response.nodeBaseUrl;

				//
				AppConsts.rocketchat = response.rocketchat;
                //
                AppConsts.baseUrlHome = response.baseUrlHome;
                //
                AppConsts.clientId = response.clientId;
                AppConsts.clientSecret = response.clientSecret;

                callback();
            });
    }
}
