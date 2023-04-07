import { filter } from 'rxjs/operators';
import { Component, Injector, OnInit } from '@angular/core';
import { DepartmentConst, SaleConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { SaleService } from '@shared/service-proxies/sale-service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InvestorFilterComponent } from './investor-filter/investor-filter.component';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.scss']
})
export class CreateSaleComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef,
    public configDialog: DynamicDialogConfig,
    private _departmentService: DepartmentService,
    private dialogService: DialogService,
    private _saleService: SaleService,
  ) {
    super(injector, messageService);
  }

  SaleConst = SaleConst;


  ngOnInit(): void {
    this.isLoading = true;
    this._saleService.getAllDepartment().subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.departments = res.data?.items ?? [];
      } else {
        this.pushMessageError('Không lấy được dữ liệu phòng ban!');
      }
    }, (err) => {
      console.log('err---', err);
      this.pushMessageError('Không lấy được dữ liệu phòng ban!');
    });
  }

  pushMessageError(message) {
    this.messageError(message);
  }


  submitted = false;
  customer: any = {};
  customerInfo: any = {};

  listBank = [];
  departments: any[] = [];
  managers: any[] = [];

  bankAccId: number;

  sale = {
    "id": 0,
    "investorId": null,
    "businessCustomerId": null,
    "employeeCode": null,
    "saleType": null,
    "saleParentId": null,
    "departmentId": null,
    "investorBankAccId": null,
    "businessCustomerBankAccId": null,
  }

  close() {
    this.ref.close();
  }

  changeDepartment(departmentId) {
    this._saleService.getAllSale(departmentId).subscribe((res) => {
      if(this.handleResponseInterceptor(res, '')) {
        if(res.data?.items?.length) {
          this.managers = res.data.items.map(item => {
              item.fullName = item?.investor?.investorIdentification?.fullname ?? item?.businessCustomer?.name;
              return item;
          });
        } else {
          this.managers = [];
        }
      }
    });
  }

  changeSaleType(saleType) {
    if(saleType !== SaleConst.TYPE_COLLABORATOR) {
      this.sale.saleParentId = null;
    }
  }

  filterCustomer() {
    this.showDialogSearchCustomer();
  }

  showDialogSearchCustomer() {
    const ref = this.dialogService.open(
      InvestorFilterComponent,
      {
        header: "Tìm kiếm khách hàng",
        width: '1000px',
        contentStyle: { "max-height": "600px", "overflow": "auto" },
        style: { 'top': '-15%', 'overflow': 'hidden'},
        baseZIndex: 10000,
        data: {

        },
      }
    );

    ref.onClose.subscribe((customer) => {
      console.log('customer_________', customer);

      if(customer) {
        this.customer = {};
        this.customerInfo = {};
        //
        if(customer?.investorId) {
          this.listBank = [];
          this.customer = { ...customer };
          this.customerInfo = this.customer?.defaultIdentification;
          this.sale.investorId = this.customer.investorId;
          if (this.customer?.listBank?.length) {
            this.listBank = this.customer?.listBank.map(bank => {
              bank.labelName = bank.bankAccount + ' - ' + (bank?.coreBankName ?? bank?.bankName);
              return bank;
            });
          }
        }
        //
        if (customer?.businessCustomerId) {
          this.listBank = [];
          this.customer = { ...customer };
          this.sale.businessCustomerId = this.customer.businessCustomerId;
          if (this.customer?.businessCustomerBanks?.length) {
            this.listBank = this.customer?.businessCustomerBanks.map(bank => {
              bank.labelName = bank.bankAccName + ' - ' + bank?.bankAccNo + ' - ' + bank?.bankName;
              bank.id = bank.businessCustomerBankAccId;
              return bank;
            });
          }
        }
      }
    });
  }

  save() {
    this.submitted = true;


    console.log('customer____', this.customer);
    

    if(this.customer.investorId) this.sale.investorBankAccId = this.bankAccId;
    if(this.customer.businessCustomerId) this.sale.businessCustomerBankAccId = this.bankAccId;
    //

    console.log(this.bankAccId, this.sale);
    
    this._saleService.create(this.sale).subscribe((res) => {
      if (this.handleResponseInterceptor(res, 'Thêm thành công')) {
        this.ref.close(res?.data)
      }
      this.submitted = false;
    }, (err) => {
      console.log('err-----', err);
      this.submitted = false;
    });
  }

  validForm(): boolean {
    const validRequired = this.bankAccId 
                        && this.sale?.departmentId
                        && this.sale?.employeeCode?.trim()
                        && this.sale?.saleType;
    return validRequired;
  }

}
