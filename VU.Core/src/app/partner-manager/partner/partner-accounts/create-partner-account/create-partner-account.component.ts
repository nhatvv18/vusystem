import { Component, Injector, OnInit } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { PartnerAccountService } from '@shared/service-proxies/partner-account-service';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-partner-account',
  templateUrl: './create-partner-account.component.html',
  styleUrls: ['./create-partner-account.component.scss']
})
export class CreatePartnerAccountComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private userService: UserServiceProxy,
    private ref: DynamicDialogRef, 
    private configDialog: DynamicDialogConfig,
    private _partnerAccountService: PartnerAccountService,
  ) {
    super(injector, messageService);
  }

  user: any = {};

  submitted = false;

  ngOnInit() {
    this.user = this.configDialog.data.user;
    console.log('user', this.user);
  }

  cancel() {
    this.ref.destroy();
  }
 
  save() {
    this.submitted = true;
    //
    if (this.user.userId >= 0) {
      this.userService.update(this.user).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
            this.submitted = false;
          } else {
            this.submitted = false;
          }
        }, () => {
          this.submitted = false;
        }
      );
    } else {
      this._partnerAccountService.create(this.user).subscribe((response) => {
          if(this.handleResponseInterceptor(response, 'Thêm thành công')) {
            this.ref.close(response)
          }
          this.submitted = false;
        }, (err) => {
          console.log('err---', err);
          this.submitted = false;
        }
      );
    }
  }

  validatePassword(): boolean {
    return this.user?.password?.trim() && this.user?.confirmPassword?.trim() && this.user?.confirmPassword?.trim() != this.user?.password?.trim();
  }

  validForm(): boolean {

    const validIfCreate = this.user.confirmPassword === this.user.password 
                          && this.user?.userName?.trim() 
                          && this.user?.displayName?.trim() 
                          && this.user?.password?.trim() 
                          && this.user?.email?.trim();

    const validIfUpdate = this.user?.userName?.trim() 
                          && this.user?.displayName?.trim() 
                          && this.user?.email?.trim();

    return this.user.userId >= 0 ? validIfUpdate : validIfCreate;
  }


}
