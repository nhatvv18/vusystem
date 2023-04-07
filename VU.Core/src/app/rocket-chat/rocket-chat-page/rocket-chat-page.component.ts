import { Component, Injector, OnDestroy, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AppConsts } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { UserServiceProxy } from "@shared/service-proxies/service-proxies";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";

@Component({
	selector: "app-rocket-chat-page",
	templateUrl: "./rocket-chat-page.component.html",
	styleUrls: ["./rocket-chat-page.component.scss"],
})
export class RocketChatPageComponent extends CrudComponentBase implements OnDestroy {
	constructor(injector: Injector, messageService: MessageService, private _userServices: UserServiceProxy, private router: Router, private breadcrumbService: BreadcrumbService) {
		super(injector, messageService);
		this.breadcrumbService.setItems([
			{ label: "Trang chủ", routerLink: ["/home"] },
			{ label: "Đối tác", routerLink: ["/partner-manager/partner"] },
		]);
	}

	public src: string = AppConsts.rocketchat.iframeSrc;
	private subscription = null;

	ngOnInit(): void {
		this._userServices.loginRocketchat().subscribe(
			(res) => {
				// if (this.handleResponseInterceptor(res, '')) {
				// }
			},
			(err) => {
				this.messageError("Có sự có khi sso. Vui lòng đăng nhập.");
			}
		);
	}

	ngOnDestroy(): void {
		this._userServices.logoutSSO().subscribe();
	}
}
