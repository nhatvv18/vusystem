import { Component, Injector, OnInit } from '@angular/core';
import { DepartmentConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { SaleService } from '@shared/service-proxies/sale-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-salse-manager-department',
  templateUrl: './add-salse-manager-department.component.html',
  styleUrls: ['./add-salse-manager-department.component.scss']
})
export class AddSalseManagerDepartmentComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig,
    private _departmentService: DepartmentService,
    private _saleService: SaleService,
  ) {
    super(injector, messageService);
  }

  saleManager: any = {};
  department: any = {};
  isBusinessCustomer: boolean;

  sales: any[] = [];

  //
  submitted = false;

  ngOnInit(): void {
    this.saleManager = this.configDialog.data.saleManager;
    this.department = this.configDialog.data?.department;
    this.isBusinessCustomer = this.configDialog.data?.isBusinessCustomer;
    console.log('dataDialog', this.configDialog.data);

    if (this.isBusinessCustomer) {
      this._saleService.getAllSaleTypeManagerInvestor(this.department.departmentId).subscribe((res) => {
        if(this.handleResponseInterceptor(res, '')) {
          if(res.data?.items?.length) {
            this.sales = res.data.items.map(item => {
              item.fullName = item?.investor?.investorIdentification?.fullname ?? item?.businessCustomer?.name;
              return item;
            });
          } 
        }
      });
    } else {
      this._saleService.getAllSaleTypeManager(this.department.departmentId).subscribe((res) => {
        if(this.handleResponseInterceptor(res, '')) {
          if(res.data?.items?.length) {
            this.sales = res.data.items.map(item => {
              item.fullName = item?.investor?.investorIdentification?.fullname ?? item?.businessCustomer?.name;
              return item;
            });
          } 
        }
      });
    }
  } 

  close() {
		this.ref.close();
	}

  save() {
    this.submitted = true;
    if (this.isBusinessCustomer){
      this._departmentService.addSaleManager2(this.saleManager).subscribe((res) => {
        this.submitted = false;
        if(this.handleResponseInterceptor(res, 'Thêm thành công')) {
          this._departmentService.getById(this.department.departmentId).subscribe((resDepartment) => {
            if(this.handleResponseInterceptor(resDepartment, '')) {
              this.ref.close(resDepartment?.data);
             }
            console.log('departmentUpdate', res);
          });
        }
      }, (err) => {
        console.log('err-----', err);
          this.submitted = false; 
      });
    } else {
      this._departmentService.addSaleManager(this.saleManager).subscribe((res) => {
        this.submitted = false;
        if(this.handleResponseInterceptor(res, 'Thêm thành công')) {
          this._departmentService.getById(this.department.departmentId).subscribe((resDepartment) => {
            if(this.handleResponseInterceptor(resDepartment, '')) {
              this.ref.close(resDepartment?.data);
             }
            console.log('departmentUpdate', res);
          });
        }
      }, (err) => {
        console.log('err-----', err);
          this.submitted = false; 
      });
    }

    // } else {
    //   this._departmentService.update(this.department).subscribe((res) => {
    //     if(this.handleResponseInterceptor(res, 'Cập nhật thành công')) {
    //       this.ref.close(res?.data)
    //     }
    //     this.submitted = false;
    //   }, (err) => {
    //     console.log('err-----', err);
    //      this.submitted = false; 
    //   });
    // }
  }

  validForm(): boolean {
    const validRequired = this.saleManager?.saleId; 
		return validRequired;
	}

}
