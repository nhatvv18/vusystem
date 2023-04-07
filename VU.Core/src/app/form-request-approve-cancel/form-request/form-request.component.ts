import { Component, OnInit } from '@angular/core';
import { ApproveConst } from '@shared/AppConsts';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.scss']
})
export class FormRequestComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  title: string;
  submitted = false;

  acceptStatus: boolean = true;

  dataRequest = {
    id: 0,
    actionType: 0,
    userApproveId: 1,
    requestNote: null,
    summary: null,
  }

  ngOnInit(): void {
    this.dataRequest.id = this.configDialog.data.id;
    this.dataRequest.summary = this.configDialog.data.summary;
    this.dataRequest.actionType = this.configDialog.data.actionType;
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

}
