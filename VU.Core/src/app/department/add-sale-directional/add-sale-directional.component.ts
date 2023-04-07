
import { Component, Injector, OnInit } from '@angular/core';
import { SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { DepartmentService } from '@shared/service-proxies/department-service';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { SaleService } from '@shared/service-proxies/sale-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-sale-directional',
  templateUrl: './add-sale-directional.component.html',
  styleUrls: ['./add-sale-directional.component.scss']
})
export class AddSaleDirectionalComponent extends CrudComponentBase implements OnInit {

  selectedCustomers: any[] = []
  isLoadingPersonList: boolean = true;
  rows: any[] = [];
  personListPage = new Page()
  inputData: any;
  departments: any[] = [];
  newDepartmentId: number;
  dataMoveSale = {
    departmentId: 0,
    newDepartmentId: 0,
    sales: []
  }


  constructor(
    protected messageService: MessageService,
    private _saleService: SaleService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private notificationService: NotificationService,
    private _departmentService: DepartmentService,
    injector: Injector) {
    super(injector, messageService)
  }

  ngOnInit(): void {
    this.inputData = this.config.data.inputData;
    this.setPersonList(this.personListPage)
    
    console.log("this.inputData",this.inputData);

    this.dataMoveSale.departmentId = this.inputData?.data?.departmentId

    // this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPersonList({ page: this.offset });
      } else {
        this.setPersonList();
      }
    })

  }

  findCustomer() {
  }

  moveSalesToNewDepartment() {
    console.log('this.selectedCustomers___', this.selectedCustomers);
    let sales = [];
    this.selectedCustomers.forEach(sale => {
      sales.push(sale?.saleId)
    });
    this.dataMoveSale.sales = sales;
    this.dataMoveSale.newDepartmentId = this.newDepartmentId
    console.log("Danh sách SALES ID: ", this.dataMoveSale);
  
    this.isLoadingPersonList = true;
    
    this._departmentService.moveSalesToNewDepartment(this.dataMoveSale).subscribe((res) => {
      if(this.handleResponseInterceptor(res, 'Cập nhật thành công')) {
        this.isLoadingPersonList = false;
        this.ref.close(res);
      }
    }, (err) => {
      this.isLoadingPersonList = false;
      console.log('err-----', err);
    });
  }

  setPersonList(pageInfo?: any) {
    console.log("this.inputData",this.inputData);
    this.personListPage.pageNumber = pageInfo?.page ?? this.offset;
    this.personListPage.keyword = this.keyword;
    this.isLoadingPersonList = true;
    this._saleService.getAllDepartment().subscribe((resDepartment) => {
      if (this.handleResponseInterceptor(resDepartment, "")) {
        this.departments = resDepartment.data?.items ?? [];
      }

    })
    this._saleService.getAllSaleDirec(this.inputData.data.departmentId).subscribe(
      (res) => {
        if (this.handleResponseInterceptor(res, "")) {
          this.personListPage.totalItems = res.data.totalItems;
          console.log(' this.personListPage.totalItems: ', res);
          
          // this.rows = res.data.items;
          if (Array.isArray(res.data?.items)) {
            let i = 0;
            this.rows = res.data?.items.map(item => {
              return {
                ...item,
                id: i++
              }
            });
            console.log(this.rows)
          }
        }
        this.isLoadingPersonList = false;
      },
      () => {
        this.isLoadingPersonList = false;
      }
    );
  }
}

