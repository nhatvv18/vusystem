import { Component, Injector, OnInit } from '@angular/core';
import { DepartmentConst, SaleConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-add-salse-department',
  templateUrl: './add-salse-department.component.html',
  styleUrls: ['./add-salse-department.component.scss']
})
export class AddSalseDepartmentComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    public ref: DynamicDialogRef, 
    public configDialog: DynamicDialogConfig,
    private _departmentService: DepartmentService,
  ) {
    super(injector, messageService);
  }

  sale: any = {};
  department: any = {};
  //
  submitted = false;

  //
  SaleConst = SaleConst;
  DepartmentConst = DepartmentConst;

  ngOnInit(): void {
    this.sale = this.configDialog.data.sale;
    this.department = this.configDialog.data?.department;
    console.log('dataDialog', this.configDialog.data);
  } 

  close() {
		this.ref.close();
	}

  save() {
    this.submitted = true;
    this._departmentService.addSale(this.sale).subscribe((res) => {
      if(this.handleResponseInterceptor(res, 'Thêm thành công')) {
        this.ref.close(res?.data)
      }
      this.submitted = false;
    }, (err) => {
      console.log('err-----', err);
        this.submitted = false; 
    });
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
    const validRequired = this.sale?.saleId; 
		return validRequired;
	}
}
