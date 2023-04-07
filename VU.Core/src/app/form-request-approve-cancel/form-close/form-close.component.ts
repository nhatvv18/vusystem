import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-close',
  templateUrl: './form-close.component.html',
  styleUrls: ['./form-close.component.scss']
})
export class FormCloseComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  title: string;
  submitted = false;

  acceptStatus: boolean = true;

  dataClose = {
    id: 0,
    closeNote: null,
  }



  ngOnInit(): void {
    this.dataClose.id = this.configDialog.data.id;
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
    this.ref.close({ data: this.dataClose, accept: this.acceptStatus});
  }


}
