import { Component, OnInit } from '@angular/core';
import { AppConsts, FormNotificationConst } from '@shared/AppConsts';
import { OBJECT_CONFIRMATION_DIALOG } from '@shared/base-object';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

const { DEFAULT_IMAGE } = OBJECT_CONFIRMATION_DIALOG;

@Component({
  selector: 'app-form-notification',
  templateUrl: './form-notification.component.html',
  styleUrls: ['./form-notification.component.scss']
})
export class FormNotificationComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  default: any;
  submitted = false;


  showApproveBy: boolean = false;
  acceptStatus: boolean = true;

  AppConsts = AppConsts;
  DEFAULT_IMAGE = DEFAULT_IMAGE;

  data = {
    title: null,
    icon: null,
  }

  ngOnInit(): void {
    this.data.title = this.configDialog.data.title;
    this.default = this.configDialog.data.icon;
    if(this.default == FormNotificationConst.IMAGE_APPROVE){
      this.data.icon = DEFAULT_IMAGE.IMAGE_APPROVE;
    } else if(this.default == FormNotificationConst.IMAGE_CLOSE) {
      this.data.icon = DEFAULT_IMAGE.IMAGE_CLOSE;
    }
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
    this.ref.close({data: this.data,accept: this.acceptStatus});
  }
}

