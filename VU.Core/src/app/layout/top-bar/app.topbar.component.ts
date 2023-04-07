import { MessageService } from 'primeng/api';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import {Component} from '@angular/core';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppMainComponent } from '../main/app.main.component';

@Component({
    selector: 'app-topbar',
	templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {

	userDialog: boolean;
    activeItem: number;
	userInfo: any = {};
	user = {};

    constructor(
		public appMain: AppMainComponent,
		private authService: AppAuthService,
		private _appSessionService: AppSessionService,
		private userService: UserServiceProxy,
		private messageService: MessageService,

		) {}

    mobileMegaMenuItemClick(index) {
        this.appMain.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
    }

	ngOnInit() {
		this.userInfo = this._appSessionService.user;
	}

	editUser() {
        this.user = {...this.userInfo};
        this.userDialog = true;
    }

	hideDialog() {
        this.userDialog = false;
    }

	saveUser() {
		this.userService.update(this.user).subscribe((res) => {
			this.userInfo = {...this.user};
			this.userDialog = false;
			this.messageService.add({severity: 'success', summary: '', detail: 'Cập nhật thành công!', life: 1500});
			this.userService.postRefreshToken().subscribe();
		});
	  }

	logout() {
		this.authService.logout();
	}
}
