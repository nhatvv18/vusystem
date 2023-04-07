import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppConsts, PermissionLoyaltyConst, UserTypes } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from '../main/app.main.component';
import jwt_decode from "jwt-decode";
import { TokenService } from '@shared/services/token.service';
import { AppComponentBase } from '@shared/app-component-base';
import { CookieService } from 'ngx-cookie-service';
import { menus } from 'src/app';
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent extends CrudComponentBase implements OnInit {
    protected _cookieService: CookieService;
    model: any[];
    checkPartner: any;
    AppConsts = AppConsts;
    labelCheck: string;
    routerLinkCheck: string;
    constructor(
        public appMain: AppMainComponent,
        injector: Injector,
        messageService: MessageService,
        cookieService: CookieService,
    ) {
        super(injector, messageService);
        this._cookieService = cookieService;
        this.userLogin = this.getUser();
    }

    @Input() permissionsMenu: any[] = [];

    userLogin: any = {};
    // _tokenService: TokenService;
    UserTypes = UserTypes;
    
    ngOnInit() {
        this.model = [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'], isShow: true },
            {
                label: 'Cài đặt', icon: 'pi pi-fw pi-cog', routerLink: ['/setting'], isShow: true,
                items: [
                    {label: 'Chủ đầu tư', icon: '', routerLink:['/setting/owner'], isShow:true },
                ]
            },
        ];
    }

    // getUser() {
    //     const token = this._tokenService.getToken();
    //     console.log('token__________________', token);
    //     if(token) {
    //         alert('vao dau');
    //         const userInfo = jwt_decode(token);
    //         return userInfo;
    //     }
    //     return {};
    // }

    onMenuClick() {
        this.appMain.menuClick = true;
    }

    isPermission(keyName) {
        return true;
        return this.permissionsMenu.includes(keyName);
    }
}
