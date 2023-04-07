import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApproveConst, SaleConst, SearchConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { SaleService } from '@shared/service-proxies/sale-service';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';

@Component({
  selector: 'app-sale-active',
  templateUrl: './sale-active.component.html',
  styleUrls: ['./sale-active.component.scss']
})
export class SaleActiveComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private _saleService: SaleService,
    ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
    ]);
  }

  SaleConst = SaleConst;
  //
  rows: any[] = [];
	col: any;

	cols: any[];
	_selectedColumns: any[];
  listAction: any[] = [];

  //
  dataFilter = {
    field: null,
    customerType: null,
    saleType: null,
    status: null,
  }

  saleTypes: any[] = [];
  sources: any[] = [];
  statuses: any[] = [];
  customerType: any[] = [];

  ngOnInit() {

    this.saleTypes = [
      {
        'code': '',
        'name': 'Tất cả',
      },
      ...SaleConst.types
    ];
    //----
    this.sources = [
      {
        'code': '',
        'name': 'Tất cả',
      },
      ...SaleConst.sources
    ];
    //----
    this.statuses = [
      {
        'code': '',
        'name': 'Tất cả',
      },
      ...SaleConst.status
    ];
    //
    this.customerType = [
      {
        'code': '',
        'name': 'Tất cả'
      },
      ...SaleConst.customerTypes
    ]
    //
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset  });
      } else {
        this.setPage(this.keyword);
      }
    });

    this.cols = [
			{ field: 'employeeCode', header: 'Mã nhân viên', width: '9rem', cutText: 'b-cut-text-9', isPin: true },
			{ field: 'referralCode', header: 'Mã tư vấn viên', width: '9rem',  isPin: true },
			{ field: 'nameInvestorOrBusinessCustomer', header: 'Họ tên / Tên doanh nghiệp', width: '25rem', isPin: true },
			{ field: 'department', header: 'Phòng ban', width: '15rem'},
			{ field: 'contractCode', header: 'Mã hợp đồng', width: '9rem'},
			{ field: 'saleTypeName', header: 'Loại Sale', width: '10rem'},
			// { field: 'phone', header: 'Số điện thoại', width: '10rem',  },
			// { field: 'idNoOrTaxCode', header: 'Số CMND / Mã số thuế', width: '10rem', },
			// { field: 'dateOfBirth', header: 'Ngày sinh', width: '10rem', },
			// { field: 'placeOfResidenceOrAddress', header: 'Địa chỉ', width: '20rem', cutText: 'b-cut-text-20' },
      { field: 'columnResize', header: '', type:'hidden' },
		];

    this.cols = this.cols.map((item,index) => {
      item.position = index + 1;
      return item;
    })

		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('saleActive') ?? this.cols; 
  }

  genListAction(data = []) {
    this.listAction = data.map(sale => {
      const actions = [];
      //
      if (this.isGranted([this.PermissionCoreConst.CoreSaleActive_ThongTinSale])) {
        actions.push({
          data: sale,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreSaleActive_KichHoat])) {
        actions.push({
          data: sale,
          label: sale.status == SaleConst.STATUS_ACTIVE ? 'Khóa' : 'Kích hoạt',
          icon: sale.status == SaleConst.STATUS_ACTIVE ? 'pi pi-times-circle' : 'pi pi pi-check',
          command: ($event) => {
            this.changeStatus($event.item.data);
          }
        })
      }

      return actions;
    });
  }

  getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('saleActive', JSON.stringify(data));
	}

	setColumn(col, _selectedColumns) {
		console.log('cols:', col);

		console.log('_selectedColumns', _selectedColumns);

		const ref = this.dialogService.open(
			FormSetDisplayColumnComponent,
			this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
		);

		ref.onClose.subscribe((dataCallBack) => {
			console.log('dataCallBack', dataCallBack);
			if (dataCallBack?.accept) {
				this._selectedColumns = dataCallBack.data.sort(function (a, b) {
					return a.position - b.position;
				});
				this.setLocalStorage(this._selectedColumns)
				console.log('Luu o local', this._selectedColumns);
			}
		});
	}

	showData(rows) {
		for (let row of rows) {
      row.nameInvestorOrBusinessCustomer = row?.investor ? row?.investor?.investorIdentification?.fullname : (row?.businessCustomer ? row?.businessCustomer?.name : null);
  		row.saleTypeName = SaleConst.getInfoType(row.saleType, 'name');
      row.department = row?.department?.departmentName;
      row.phone = row?.investor?.phone;
      row.idNoOrTaxCode = row?.investor ? row?.investor?.investorIdentification?.idNo : (row?.businessCustomer ? row?.businessCustomer?.taxCode : null);
      // row.dateOfBirth = this.formatDate(row?.investor?.investorIdentification?.dateOfBirth),
      row.placeOfResidenceOrAddress = row?.investor ? row?.investor?.investorIdentification?.placeOfResidence : (row?.businessCustomer ? row?.businessCustomer?.address : null);
		};
		console.log('showData', rows);
	}

  changeFieldFilter() {
    if(this.keyword) {
      this.setPage();
    }
  }

  setPage(pageInfo?: any) {
    // this.setFieldError();
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    this._saleService.getAll(this.page, this.dataFilter).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data?.totalItems;
        this.rows = res.data?.items;
        //
        if(this.rows?.length) {
          this.genListAction(this.rows);
          this.showData(this.rows);
         }
        
        console.log({ rows: res.data?.items });
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
      
    });
  }

  detail(sale) {
    let cryptEncodeId = encodeURIComponent(this.cryptEncode(sale?.saleId));
		let url = `/sale-manager/sale-active/detail/${cryptEncodeId}`;
		window.open(url, "_blank");
  }

  changeStatus(sale) {
    this._saleService.changeStatus(sale.saleId).subscribe((response) => {
				if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
					this.setPage();
				}
			}, (err) => {
        console.log('err---', err);
				this.messageService.add({ severity: 'error', detail: 'Cập nhật thất bại. Vui lòng thử lại!', life: 3000 });
			}
		);
  }

}
