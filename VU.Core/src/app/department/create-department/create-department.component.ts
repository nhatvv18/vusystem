import { Component, Injector, OnInit } from '@angular/core';
import { DepartmentConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { SaleService } from '@shared/service-proxies/sale-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent extends CrudComponentBase {

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

  department: any = {};
  parentInfo: any = {};
  departments: any[] = [];
  departmentParentId: any;

  //
  submitted = false;

  //
  DepartmentConst = DepartmentConst;

  ngOnInit(): void {
    this.department = this.configDialog.data?.department;
    this.parentInfo = this.configDialog.data?.parentInfo;
    this.departmentParentId = this.configDialog.data?.department?.parentId;
    console.log('id node cha: ', this.departmentParentId);
    
    console.log('dataDialog', this.configDialog.data);
    if (this.department.departmentId) {
      this._saleService.getDepartments(this.department.departmentId).subscribe((resDepartment) => {
        if (this.handleResponseInterceptor(resDepartment, "")) {
          this.departments = [...resDepartment.data];
          console.log('List Department', this.departments);
        }
      })
    }
  } 

  close() {
		this.ref.close();
	}

  save() {
    this.submitted = true;
    if(!this.department.departmentId) {
      this._departmentService.create(this.department).subscribe((res) => {
        if(this.handleResponseInterceptor(res, 'Thêm thành công')) {
          this.ref.close(res?.data)
        }
        this.submitted = false;
      }, (err) => {
        console.log('err-----', err);
         this.submitted = false; 
      });
    } else {
      this.department.departmentParentId = this.departmentParentId;
      console.log("day la id cha:", this.departmentParentId);
      
      this._departmentService.update(this.department).subscribe((res) => {
        if(this.handleResponseInterceptor(res, 'Cập nhật thành công')) {
          this._departmentService.getById(res?.data.departmentId).subscribe((res) => {
            if(this.handleResponseInterceptor(res, '')) {
              this.ref.close(res?.data);
             }
            console.log('departmentUpdate', res);
          });
        }
        this.submitted = false;
      }, (err) => {
        console.log('err-----', err);
         this.submitted = false; 
      });
    }
  }

  validForm(): boolean {
    const validRequired = this.department?.departmentName?.trim(); 
		return validRequired;
	}
}
