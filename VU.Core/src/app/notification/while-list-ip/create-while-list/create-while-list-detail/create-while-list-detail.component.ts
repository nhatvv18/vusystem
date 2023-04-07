import { Component, Injector, Input, OnInit } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { WhitelistIpServiceProxy } from '@shared/service-proxies/whitelist-ip-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-while-list-detail',
  templateUrl: './create-while-list-detail.component.html',
  styleUrls: ['./create-while-list-detail.component.scss'],
})
export class CreateWhileListDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    private _whitelistIpService: WhitelistIpServiceProxy,
    public configDialog: DynamicDialogConfig,
    ) {
    super(injector, messageService);
  }

  fieldErrors: any = {};
  
  // Data Init
  productBondPrimary: any = [];

  row: any;
  col: any;

  whileListDetail: any = {
    'fakeId': 0,
    'ipAddressStart': null, //Số thứ tự
    'ipAddressEnd': null,   // Số kỳ đáo hạn
  }
  blockText: RegExp = /[0-9,.]/;
  submitted: boolean;
  cols: any[];
  statuses: any[];

  ngOnInit(): void {

    if(this.configDialog?.data?.whileListDetail) {
      this.whileListDetail = this.configDialog.data.whileListDetail;
    }

  }

  close() {
    this.ref.close();
  }

  save() {
      this.saveTemporary(); 
  }

  // Lưu trên frontend 
  saveTemporary() {
    if(!this.whileListDetail?.fakeId)this.whileListDetail.fakeId = new Date().getTime();
    this.ref.close(this.whileListDetail);

    
  }

  validForm(): boolean {
    const validRequired = this.whileListDetail?.ipAddressStart
                          && this.whileListDetail?.ipAddressEnd;
    return validRequired;
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }
}

