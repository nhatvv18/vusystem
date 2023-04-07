import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GeneralService } from '@shared/services/general-service';

@Component({
  selector: 'app-filter-business-customer',
  templateUrl: './filter-business-customer.component.html',
  styleUrls: ['./filter-business-customer.component.scss'], 
})
export class FilterBusinessCustomerComponent extends CrudComponentBase{

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private _generalService: GeneralService,
    ) {
    super(injector, messageService);
  }

  @Output() onCloseDialog = new EventEmitter<any>();

  rows: any[] = [];

  expandedRows = {}

  page = new Page();
  offset = 0;

  ngOnInit(): void {
    // this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    //
    this._generalService.getBusinessCutomer(this.keyword?.trim()).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '') && res?.data) {
        this.page.totalItems = res.data.totalItems;
        this.rows = [res.data];
      } else {
        this.messageError('Không tìm thấy dữ liệu!');
        this.rows = [];
      }
    }, () => {
      this.isLoading = false;
    });
  }

  isChoose(businessCustomerId) {
    this.dialogRef.close(businessCustomerId);
  }

}
