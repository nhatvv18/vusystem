import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { MessageService } from 'primeng/api';
import { CookieManagerService } from '@shared/services/cookie.service';
import { AuthenticateModel } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ MessageService ]
})
export class LoginComponent extends AppComponentBase {
    submitting = false;
    dark: boolean;
    isLoading: boolean = false;
    constructor(
        private injector: Injector,
        messageService: MessageService,
        public authService: AppAuthService,
        private router: Router,
        private _cookieService: CookieManagerService
    ) {
        super(injector, messageService);
        this.authService.authenticateModel = new AuthenticateModel;
    }

    login(): void {
        this.submitting = true;
        this.authService.authenticate(() => {
         
            this.submitting = false;
        });
    }

    isMobile() {
        return window.innerWidth <= 991;
    }
}
