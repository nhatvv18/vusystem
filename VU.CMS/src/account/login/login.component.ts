import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppConsts } from '@shared/AppConsts';
import { MessageService } from 'primeng/api';
import { TokenService } from '@shared/services/token.service';
import { CookieManagerService } from '@shared/services/cookie.service';

@Component({
    templateUrl: './login.component.html',
    styles: [],
    providers: [ MessageService ]
})
export class LoginComponent extends AppComponentBase {
    submitting = false;
    dark: boolean;

    constructor(
        private injector: Injector,
        messageService: MessageService,
        public authService: AppAuthService,
        private _cookieService: CookieManagerService
    ) {
        super(injector, messageService);
    }

    login(): void {
        this.submitting = true;
        this.authService.authenticate(() => (this.submitting = false));
    }
}
