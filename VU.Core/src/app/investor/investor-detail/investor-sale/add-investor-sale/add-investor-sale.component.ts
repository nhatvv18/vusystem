import { filter } from 'rxjs/operators';
import { Component, Injector, OnInit } from '@angular/core';
import { DepartmentConst, SaleConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { SaleService } from '@shared/service-proxies/sale-service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InvestorSaleFilerComponent } from './investor-sale-filer/investor-sale-filer.component';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-investor-sale',
  templateUrl: './add-investor-sale.component.html',
  styleUrls: ['./add-investor-sale.component.scss']
})

export class AddInvestorSaleComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    public configDialog: DynamicDialogConfig,
    private _departmentService: DepartmentService,
    private dialogService: DialogService,
    private _saleService: SaleService,
    public _investorService: InvestorServiceProxy,
    private routeActive: ActivatedRoute,
  ) {
    super(injector, messageService);
    this.sale.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get("id"));
  }

  SaleConst = SaleConst;


  ngOnInit(): void {
    this.isLoading = true;
    this._saleService.getAllDepartment().subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.departments = res.data?.items ?? [];
      } else {
        this.pushMessageError('Không lấy được dữ liệu!');
      }
    }, (err) => {
      console.log('err---', err);
      this.pushMessageError('Không lấy được dữ liệu!');
    });
  }

  pushMessageError(message) {
    this.messageError(message);
  }


  submitted = false;
  investor: any = {};
  investorInfo: any = {};

  listBank = [];
  departments: any[] = [];
  managers: any[] = [];

  sale = {
    "investorId": null,
    "referralCode": null,
  }

  close() {
    this.ref.close();
  }

  save() {
    this.submitted = true;
    this._investorService.createInvestorSale(this.sale).subscribe((res) => {
      if (this.handleResponseInterceptor(res, 'Thêm thành công')) {
        this.ref.close(res?.data)
      }
      this.submitted = false;
    }, (err) => {
      console.log('err-----', err);
      this.submitted = false;
    });
  }

  // validForm(): boolean {
  //   const validRequired = this.sale?.investorId 
  //                       && this.sale?.departmentId
  //                       && this.sale?.employeeCode?.trim()
  //                       && this.sale?.saleType
  //                       && this.sale?.investorBankAccId;
  //   return validRequired;
  // }


  filterInvestor() {
    this.showDialogInvestor();
  }

  showDialogInvestor() {
    const ref = this.dialogService.open(
      InvestorSaleFilerComponent,
      {
        header: "Tìm kiếm tư vấn viên",
        width: '1000px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "60px" },
        style: { 'top': '-15%' },
        baseZIndex: 10000,
        data: {

        },
      }
    );

    ref.onClose.subscribe((investor) => {
 
      if (investor) {
        console.log("investor___",investor);
        
        this.investor = {};
        this.investorInfo = {};

        if(investor?.investorId) {
          this.listBank = [];
          this.investor = { ...investor };
          
         
          this.investorInfo = this.investor?.investor?.investorIdentification;
          this.sale.referralCode = this.investor?.referralCode;
          if (this.investor?.listBank?.length) {
            this.listBank = this.investor?.listBank.map(bank => {
              bank.labelName = bank.bankAccount + ' - ' + (bank?.coreBankName ?? bank?.bankName);
              return bank;
            });
          }
        }
        
        if (investor?.businessCustomerId) {
          this.listBank = [];
          this.investor = { ...investor.businessCustomer };
          console.log("investorInfo",this.investor);
          this.sale.referralCode = investor?.referralCode;
          if (this.investor?.businessCustomerBanks?.length) {
            this.listBank = this.investor?.businessCustomerBanks.map(bank => {
              bank.labelName = bank.bankAccName + ' - ' + bank?.bankAccNo + ' - ' + bank?.bankName;
              bank.id = bank.businessCustomerBankId;
              return bank;
            });
          }
        }
      }
    });
  }

}
