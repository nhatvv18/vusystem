
import { Component, OnInit } from '@angular/core';
import { ApproveConst } from '@shared/AppConsts';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';


@Component({
  selector: 'app-investor-request-phone',
  templateUrl: './investor-request-phone.component.html',
  styleUrls: ['./investor-request-phone.component.scss']
})
export class InvestorRequestPhoneComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  title: string;
  titleRequest: string;
  submitted = false;

  acceptStatus: boolean = true;

  dataRequest = {
    id: 0,
    actionType: 0,
    userApproveId: 1,
    requestNote: null,
    summary: null,
  }

  phone: string;

  ngOnInit(): void {
    // this.dataRequest.id = this.configDialog.data.id;
    // this.dataRequest.summary = this.configDialog.data.summary;
    // this.dataRequest.actionType = this.configDialog.data.actionType;
    this.phone = this.configDialog.data.phone;
    this.title = this.configDialog.data.title;
    this.titleRequest = this.configDialog.data.titleRequest;
    console.log("this.configDialog.data.phone",this.configDialog.data);
    
  } 

  hideDialog() {
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
    this.ref.close({ data: this.dataRequest, accept: this.acceptStatus});
  }

  validForm(): boolean {
    const validRequired = this.dataRequest?.requestNote;
    return validRequired;
  }
}
