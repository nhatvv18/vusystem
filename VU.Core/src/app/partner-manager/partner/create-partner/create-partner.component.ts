import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { PartnerServiceProxy } from '@shared/service-proxies/partner-service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    public configDialog: DynamicDialogConfig,
    private partnerService: PartnerServiceProxy,
    private dialogService: DialogService,
    private router: Router,
  ) {
    super(injector, messageService);
  }
  fieldErrors = {};
  NationalityConst = NationalityConst;
  partner: any = {
    "partnerId": 0,
    "code": null,
    "name": null,
    "shortName": null,
    "address": null,
    "phone": null,
    "mobile": null,
    "email": null,
    "taxCode": null,
    "licenseDate": null,
    "licenseIssuer": null,
    "capital": null,
    "tradingAddress": null,
    "nation": null,
    "decisionNo": null,
    "decisionDate": null,
    "numberModified": null,
    "dateModified": null,
    "repName": null,
    "repPosition": null,
    // "bankName": null,
    // "bankBranchName": null,
    // "bankAccNo": null,
    // "backAccName": null,
    "status": null,
  }
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];

  ngOnInit(): void {
    console.log("1231",this.configDialog.data.inputData);
    
    if(this.configDialog.data.inputData) {
      this.partner = this.configDialog.data.inputData;
    }
    this.partner = {
      ...this.partner,
      licenseDate: this.partner?.licenseDate ? new Date(this.partner?.licenseDate) : null,
      decisionDate: this.partner?.decisionDate ? new Date(this.partner?.decisionDate) : null,
      dateModified: this.partner?.dateModified ? new Date(this.partner?.dateModified) : null,
  };
   
  }
  
  save() {
    this.submitted = true;
    //
    let body = this.formatCalendar(this.fieldDates, {...this.partner});
    console.log({ partner: this.partner });
    if (this.partner.partnerId) {

      this.partnerService.update(body).subscribe((response) => {
        this.callTriggerFiledError(response, this.fieldErrors);
        if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.submitted = false;
          this.close();
        } else {
          this.submitted = false;
        }
      }, () => {
        this.submitted = false;
      }
      );
    } else {
      this.partnerService.create(body).subscribe(
        (response) => {
          if (this.handleResponseInterceptor(response, 'Thêm thành công')) {
            this.submitted = false;
            this.close();
            this.router.navigate(['/partner-manager/partner/detail', this.cryptEncode(response.data.partnerId)]);
          } else {
            this.submitted = false;
          }
        }, () => {
          this.submitted = false;
        }
      );
    }
  }
  close() {
    this.ref.close();
  }
  setFieldError() {
    for (const [key, value] of Object.entries(this.partner)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }
  resetValid(field) {
    this.fieldErrors[field] = false;
  }
}
