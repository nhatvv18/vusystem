import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
//import { AbpHttpInterceptor } from "abp-ng2-module";

import * as ApiServiceProxies from "./service-proxies";
import * as FileServiceProxies from "./file-service";
import * as DashBoardServiceProxies from "./dashboard-service";

@NgModule({
    providers: [
        //core
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        //File
        FileServiceProxies.FileServiceProxy,
        // DashBoardService
        DashBoardServiceProxies.DashBoardServiceProxy,
      
    ]
})
export class ServiceProxyModule { }
