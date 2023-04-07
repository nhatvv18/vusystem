import { MessageService } from 'primeng/api';
import { UserServiceProxy } from './../service-proxies/service-proxies';
import { PermissionsService } from '@shared/services/permissions.service';
import { Injectable, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppSessionService } from "../session/app-session.service";

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from "@angular/router";
import { TokenService } from "@shared/services/token.service";
import { TokenAuthServiceProxy } from "@shared/service-proxies/service-proxies";
import { AppConsts } from "@shared/AppConsts";

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _sessionService: AppSessionService,
		private _tokenService: TokenService,
		private _tokenAuthService: TokenAuthServiceProxy,
		private _userService: UserServiceProxy,
		private messageService: MessageService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>  {
		if (!this._sessionService.user || !this._tokenService.getToken()) {
			this._tokenAuthService.postRefreshToken().subscribe((res) => {
					return Promise.resolve(true);
				},(err) => {
					this._router.navigate([this.selectBestRoute()]);
					return Promise.resolve(false);
				}
			);
		}

		if (!route.data || !route.data["permissions"]) {
			return Promise.resolve(true);
		}

		if (route?.data["permissions"]) {
			return new Promise<boolean>((resolve) => {
				return resolve(true);
				// this._userService.getAllPermission().subscribe(res => {
				// 		if(res?.data.length && route?.data["permissions"]?.length) {
				// 			for(let permission of route?.data["permissions"]) {
				// 				if(res.data.includes(permission)) {
									
				// 				}
				// 			}
				// 			//
				// 			this.messageService.add({ severity: 'error', detail: 'Bạn không có quyền truy cập đường dẫn này!', life: 2000});
				// 			return resolve(false);
				// 		}
				// 	}
				// );
			});
		}

		this._router.navigate([this.selectBestRoute()]);
		return Promise.resolve(false);
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>  {
		return this.canActivate(route, state);
	}

	selectBestRoute(): string {
		if (!this._sessionService.user) {
			window.location.href = AppConsts.baseUrlHome;
			// return "/account/login";
		}
		return "/home";
	}
}
