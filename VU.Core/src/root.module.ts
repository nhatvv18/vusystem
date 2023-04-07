import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpErrorInterceptor } from './http-error.interceptor';

import { SharedModule } from './shared/shared.module';
import { ServiceProxyModule } from './shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';
import { AppConsts } from './shared/AppConsts';
import { API_BASE_URL } from './shared/service-proxies/service-proxies-base';

import { RootComponent } from './root.component';
import { AppInitializer } from './app-initializer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { PageModule } from './page/page.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule.forRoot(),
        PageModule,
        ServiceProxyModule,
        RootRoutingModule,
        // AngularMarkdownEditorModule,
        
    ],
    declarations: [RootComponent],
    providers: [
        //{ provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            useFactory: (appInitializer: AppInitializer) => appInitializer.init(),
            deps: [AppInitializer],
            multi: true,
        },
        { provide: API_BASE_URL, useFactory: () => AppConsts.remoteServiceBaseUrl },
    ],
    bootstrap: [RootComponent],
})
export class RootModule { }
