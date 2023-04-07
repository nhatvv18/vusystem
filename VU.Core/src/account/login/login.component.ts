import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ MessageService ]
})
export class LoginComponent extends AppComponentBase {
    submitting = false;
    dark: boolean;

    constructor(
        private injector: Injector,
        messageService: MessageService,
        public authService: AppAuthService,
    ) {
        super(injector, messageService);
    }

    login(): void {
        this.submitting = true;
        this.authService.authenticate(() => (this.submitting = false));
    }
}
