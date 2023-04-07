import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-content-request-approve-cancel',
  templateUrl: './confirm-content-request-approve-cancel.component.html',
  styleUrls: ['./confirm-content-request-approve-cancel.component.scss']
})
export class ConfirmContentRequestApproveCancelComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  title: string;
  submitted = false;

  showApproveBy: boolean = false;
  acceptStatus: boolean = true;

  dataRequest = {
    id: 0,
    userApproveId: 1,
    requestNote: null,
  }

  dataApprove = {
    id: 0,
    userApproveId: 1,
    approveNote: null,
  }

  dataCancel = {
    id: 0,
    userCancel: 1,
    cancelNote: null,
  }

  ngOnInit(): void {
    this.showApproveBy = this.configDialog.data.showApproveBy;
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
  }

}
