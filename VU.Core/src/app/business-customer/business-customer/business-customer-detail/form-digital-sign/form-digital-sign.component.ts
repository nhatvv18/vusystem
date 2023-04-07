import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudComponentBase } from '@shared/crud-component-base';
import { ContractTemplateServiceProxy } from '@shared/service-proxies/bond-manager-service';
import { DigitalSignServiceProxy } from '@shared/service-proxies/digital-sign-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-digital-sign',
  templateUrl: './form-digital-sign.component.html',
  styleUrls: ['./form-digital-sign.component.scss']
})
export class FormDigitalSignComponent extends CrudComponentBase {

  constructor(
    private routeActive: ActivatedRoute,
    private _contractTemplateService: ContractTemplateServiceProxy,
    private _digitalSignService: DigitalSignServiceProxy,
    injector: Injector,
    messagesService: MessageService
  ) {
    super(injector, messagesService);
    this.businessCustomerId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
  }

  businessCustomerId: number;
  digitalSign: any = {
    stampImageUrl: "",
    key: "",
    server: "",
    secret: ""
  }
  ngOnInit(): void {
    this.initDigitalSign()
  }

  initDigitalSign() {
    this._digitalSignService.getDigitalSign(this.businessCustomerId).subscribe(
      (res) => {
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, '')) {
          this.digitalSign = res?.data;
        }
      }, (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
      });
  }
  myUploaderStamp(event) {
    if (event?.files[0]) {
      this._contractTemplateService.uploadFileGetUrl(event?.files[0], "core").subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
          this.digitalSign.stampImageUrl = response?.data;
        }
      }, (err) => {
        console.log('err-----', err);
        this.messageError("Có sự cố khi upload!");
      }
      );
    }
  }

}
