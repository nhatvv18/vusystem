import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from "primeng/tristatecheckbox";
import { of } from "rxjs";
import { InvestorDiffComponent } from "../investor-diff/investor-diff.component";

@Component({
  selector: 'app-investor-cancel-history',
  templateUrl: './investor-cancel-history.component.html',
  styleUrls: ['./investor-cancel-history.component.scss']
})
export class InvestorCancelHistoryComponent implements OnInit {
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
    // investorId: 0,
    // investorGroupId: 0,
    // notice: "",
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

  selectedCustomers: any ; 
  test: any;
  temp: any[] = [];
  selected = {
    temp1: "Số",
    temp2: "Họ và tên",
    temp3: "Quốc tịch",
    temp4: "Ngày sinh",
    temp5: "Nơi sinh",
    temp6: "Giới tính",
    temp7: "Ngày cấp",
    temp8: "Ngày hết hạn",
    temp9: "Nơi cấp",
    temp10: "Tài khoản ngân hàng",
    temp11: "File đính kèm",
    temp12: "Địa chỉ giao dịch",
    temp13: "Tài khoản chứng khoán",
  };

  dataApprove = {
    id: 0,
    userApproveId: 1,
    approveNote: null,
    date1: null,
    date2: null,
  };

  isDisplay: any;

  ngOnInit(): void {
    this.investor = this.configDialog?.data?.investor;
    
    console.log("investor ....",this.investor );
    Object.entries(this.selected)?.forEach(([key, value]) => {
      if(this.investor?.defaultIdentification?.ekycIncorrectFields != null) {

        console.log("aaa",this.investor?.defaultIdentification?.ekycIncorrectFields.indexOf(value));
        if(this.investor?.defaultIdentification?.ekycIncorrectFields.indexOf(value) != -1) {
          console.log("keyy",key);
          this.selected[key] = true;
          this.isDisplay = false;
        } 
      }
    });
    console.log("done",this.isDisplay);
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
    return validRequired;
  }
}

