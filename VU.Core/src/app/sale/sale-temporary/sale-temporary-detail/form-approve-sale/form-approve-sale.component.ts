import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BadgeModule } from 'primeng/badge';
import { BusinessCustomerServiceProxy } from '@shared/service-proxies/business-customer-service';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-approve-sale',
  templateUrl: './form-approve-sale.component.html',
  styleUrls: ['./form-approve-sale.component.scss']
})
export class FormApproveSaleComponent extends CrudComponentBase {

  constructor(
    public ref: DynamicDialogRef,
    private routeActive: ActivatedRoute,
    messageService: MessageService,
    injector: Injector,
    private dialogService: DialogService,
    public configDialog: DynamicDialogConfig,
    private _businessCustomerService: BusinessCustomerServiceProxy
  ) {
    super(injector, messageService)
    // this.approveId = +this.routeActive.snapshot.paramMap.get('id');
  }

  acceptStatus: boolean = true;
  check_approve: boolean;
  //
  dataRequest = {
    saleTempId: 0,
    approveNote: null,
  }

  ngOnInit(): void {
    this.check_approve = true;
  }
 
  showDiffChange(){
  }

  accept() {
    this.acceptStatus = true;
    this.onAccept();
  }

  cancel() {
    this.acceptStatus = false;
    this.onAccept();
  }

  onAccept() {
    this.ref.close({ data: this.dataRequest, accept: this.acceptStatus,  checkApprove:this.check_approve });
  }

  validForm(): boolean {
		const validRequired = this.dataRequest?.approveNote?.trim();
		return validRequired;
	}

}
