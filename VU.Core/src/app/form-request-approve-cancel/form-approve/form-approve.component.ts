import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-approve',
  templateUrl: './form-approve.component.html',
  styleUrls: ['./form-approve.component.scss']
})
export class FormApproveComponent implements OnInit {

  constructor(
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig
  ) { 

  }

  title: string;
  submitted = false;

  showApproveBy: boolean = false;
  acceptStatus: boolean = true;
  isInvestorProf: boolean;
  check_approve: boolean;

  dataApprove = {
    id: 0,
    userApproveId: 1,
    approveNote: null,
    date1: null,
    date2: null,
  }
  ngOnInit(): void {
    this.dataApprove.id = this.configDialog.data.id;
    this.isInvestorProf = this.configDialog.data.isInvestorProf;
    this.check_approve = true;
    console.log("aaaaa",this.isInvestorProf);
    
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
    this.ref.close({ data: this.dataApprove, accept: this.acceptStatus, checkApprove:this.check_approve});
  }

  validForm(): boolean {
    let validRequired;
    if(this.isInvestorProf == true && this.check_approve == true) {
      validRequired = this.dataApprove?.approveNote?.trim() &&
                      this.dataApprove?.date1 &&
                      this.dataApprove?.date2;
    } else {
      validRequired = this.dataApprove?.approveNote?.trim();
    }
    
    return validRequired;
  }

  validDate(): boolean {
    let validDate;

      validDate =  this.check_approve == true;

    return validDate;
  }
}
