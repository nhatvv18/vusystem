import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { InvestorDiffComponent } from "../investor-diff/investor-diff.component";

@Component({
  selector: "app-form-approve-investor",
  templateUrl: "./form-approve-investor.component.html",
  styleUrls: ["./form-approve-investor.component.scss"],
})
export class FormApproveInvestorComponent  implements OnInit  {
  constructor(
    public ref: DynamicDialogRef,
    public configDialog: DynamicDialogConfig,
    private routeActive: ActivatedRoute,
    private _dialogService: DialogService,
    public _investorService: InvestorServiceProxy,
  ) {
    this.investor.investorId = +this.routeActive.snapshot.paramMap.get("id");
  }

  title: string;
  submitted = false;
  investor: any = {
    investorId: 0,
    investorGroupId: 0,
    notice: "",
  };
  investorIdTemp: number;
  cifCode: any;
  actionType: any;
  requestDate: any;
  approveDate: any;

  showApproveBy: boolean = false;
  acceptStatus: boolean = true;
  isInvestorProf: boolean;
  check_approve: boolean;
  isDiff: boolean;
  isDiffEmailPhone: boolean;
  isPhone: boolean;
  isEmail: boolean;
  diffDetail: any = {};
  diffListIdentification: any = [];
  diffListBank: any = [];
  diffListContactAddress: any = [];
  diffDefaultIdentification: any = {};

  selectedCustomers: any ; 
  test: any;
  temp: any[] = [];
  selected = {
    temp1: null,
    temp2: null,
    temp3: null,
    temp4: null,
    temp5: null,
    temp6: null,
    temp7: null,
    temp8: null,
    temp9: null,
    temp10: null,
    temp11: null,
    temp12: null,
    temp13: null,
  };

  dataApprove = {
    id: 0,
    userApproveId: 1,
    approveNote: null,
    date1: null,
    date2: null,
  };
  getApprove: any;

  ngOnInit(): void {
    this.isDiff = this.configDialog?.data?.isDiff;
    this.getApprove = this.configDialog?.data?.getApprove;
    this.requestDate = this.configDialog?.data?.requestDate;
    this.approveDate = this.configDialog?.data?.approveDate;
    this.investorIdTemp = this.configDialog.data.investorId;
    this.cifCode = this.configDialog.data?.cifCode;
    this.actionType = this.configDialog?.data?.actionType;
    console.log(" this.isDiff ", this.configDialog?.data?.isDiff);
    this.check_approve = true;
    this.isInvestorProf = this.configDialog.data.isInvestorProf;
    this.isDiffEmailPhone = this.configDialog?.data?.isDiffEmailPhone;
    if(this.isDiffEmailPhone == true) {
      this.getDiff();
    }
    this.isEmail = this.configDialog?.data?.isEmail;
    this.isPhone = this.configDialog?.data?.isPhone;
  }

  getDiff() {

    this._investorService.getDiff(this.investorIdTemp).subscribe(
      (res) => {
        
          if(this.isPhone == true) {

            this.diffDetail = res.data.investor.Phone;
          } else if(this.isEmail == true) {
            this.diffDetail = res.data.investor.Email;
          }

          console.log("res---------------", this.diffDetail);

          

        }
       
      
    );
  }

  showDiff() {
    const ref = this._dialogService.open(InvestorDiffComponent, {
      header: "So sánh thay đổi",
      width: "70%",
      styleClass: "p-dialog-custom",
      contentStyle: { overflow: "auto" },
      style: { height: "80%" },
      data: {
        investorIdTemp: this.investorIdTemp,
        requestDate: this.requestDate,
        approveDate: this.approveDate,
        getApprove: this.getApprove,
      },
    });
  }

  showDiffEmailPhone() {
    let checkEmail, checkPhone;
    if(this.isEmail == true ) {
      checkEmail = true
    } else if(this.isPhone == true) {
      checkPhone = true
    }
    const ref = this._dialogService.open(InvestorDiffComponent, {
      header: "So sánh thay đổi",
      width: "70%",
      styleClass: "p-dialog-custom",
      contentStyle: { overflow: "auto" },
      style: { height: "80%" },
      data: {
            investorIdTemp: this.investorIdTemp,
						isDiff: false,
						isDiffEmailPhone: true,
            isPhoneEmail: true,
						isEmail: checkEmail,
            isPhone: checkPhone,
						getApprove: this.getApprove,
      },
    });
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
    this.selectedCustomers = Object.values(this.selected);
  
    this.selectedCustomers.forEach((element1) => {
      
      this.test = element1;
      if(element1 != null)
      this.temp.push(element1.toString());
      console.log("abcccc",this.temp);
      
    })
    console.log("abc",this.temp);
    this.ref.close({ data: this.dataApprove, accept: this.acceptStatus, checkApprove:this.check_approve, cancelHistory: this.temp });
  }

  validForm(): boolean {
    const validRequired = this.dataApprove?.approveNote?.trim();
    return true || validRequired;
  }
}
