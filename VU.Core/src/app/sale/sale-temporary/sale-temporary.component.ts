import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApproveConst, SaleConst, SearchConst, YesNoConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { debounceTime } from 'rxjs/operators';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { CreateSaleComponent } from './create-sale/create-sale.component';
import { SaleService } from '@shared/service-proxies/sale-service';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';

@Component({
  selector: 'app-sale-temporary',
  templateUrl: './sale-temporary.component.html',
  styleUrls: ['./sale-temporary.component.scss']
})
export class SaleTemporaryComponent extends CrudComponentBase {

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

  fieldFilter: string;

  dataFilter = {
    field: null,
    saleType: null,
    isInvestor: null,
    source: null,
    status: '',
  }

  saleTypes: any[] = [];
  sources: any[] = [];
  statuses: any[] = [];
  isInvestors: any[] = []
  ngOnInit() {
    //
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
    //
    this.statuses = [
      {
        'code': '',
        'name': 'Tất cả',
      },
      ...SaleConst.statusTemp
    ];

    this.isInvestors = [
      {
        'code': '',
        'name': 'Tất cả',
      },
      ...SaleConst.isInvestors
    ]

    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage(this.keyword);
      }
    });

    this.cols = [
			{ field: 'employeeCode', header: 'Mã nhân viên', width: '9rem', cutText: 'b-cut-text-9', isPin: true },
			{ field: 'nameInvestorOrBusinessCustomer', header: 'Họ tên / Tên doanh nghiệp', width: '25rem', isPin: true },
			{ field: 'saleTypeName', header: 'Loại Sale', width: '9rem' },
			{ field: 'department', header: 'Phòng ban', width: '15rem'},
			// { field: 'phone', header: 'Số điện thoại', width: '10rem', cutText: 'b-cut-text-10'  },
			// { field: 'idNoOrTaxCode', header: 'Số CMND / Mã số thuế ', width: '10rem', cutText: 'b-cut-text-10' },
			// { field: 'dateOfBirth', header: 'Ngày sinh', width: '10rem', cutText: 'b-cut-text-10' },
			// { field: 'placeOfResidenceOrAddress', header: 'Địa chỉ', width: '25rem', cutText: 'b-cut-text-25' },
			{ field: 'source', header: 'Nguồn', width: '8rem' },
      { field: 'columnResize', header: '', type:'hidden' },
		];

    this.cols = this.cols.map((item, index) => {
      item.position = index + 1;
      return item;
    });

		// this._selectedColumns = this.cols;
		this._selectedColumns = this.getLocalStorage('saleTemporary') ?? this.cols; 
  }

  genListAction(data = []) {
    this.listAction = data.map(saleTemp => {
      const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreDuyetSale_ThongTinSale])) {
        actions.push({
          data: saleTemp,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }
      //
      // if (saleTemp.status == SaleConst.STATUSTEMP_TEMP && this.isGranted([])) {
			// 	actions.push({
			// 		data: saleTemp,
			// 		label: 'Trình duyệt',
			// 		icon: 'pi pi-arrow-up',
			// 		command: ($event) => {
			// 			this.request($event.item.data);
			// 		}
			// 	});
			// }
      return actions;
    });
  }

  getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}
	setLocalStorage(data) {
		return localStorage.setItem('saleTemporary', JSON.stringify(data));
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
      row.department = row?.department?.departmentName ?? '';
      // row.phone = row?.investor?.phone || row?.businessCustomer?.phone;
      // row.idNoOrTaxCode = row?.investor ? row?.investor?.investorIdentification?.idNo : (row?.businessCustomer ? row?.businessCustomer?.taxCode : null);
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

    this._saleService.getAllTemp(this.page, this.dataFilter).subscribe((res) => {
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

  create() {
    this.showDialogCreate();
  }

  showDialogCreate() {
    const ref = this.dialogService.open(
			CreateSaleComponent,
			{
        header: "Thêm Sale",
        width: '900px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px", "padding": '1.5rem' },
        baseZIndex: 10000,
        data: {
            
        },
      }
		);

		ref.onClose.subscribe((sale) => {
			console.log('sale------', sale);
      this.setPage();
		});
  }

  detail(saleTemp) {
    this.router.navigate(['/sale-manager/sale-temporary/detail/' + this.cryptEncode(saleTemp?.id)]);
  }

  request(saleTemp) {
    if(saleTemp?.employeeCode && saleTemp?.departmentId) {
      const ref = this.dialogService.open(
        FormRequestComponent,
        this.getConfigDialogServiceRAC("Trình duyệt", {})
      );
      //
      ref.onClose.subscribe((dataCallBack) => {
        console.log('dataCallBack', dataCallBack);
        if (dataCallBack?.accept) {
          const body = {
            ...dataCallBack.data,
            saleTempId: saleTemp.id,
            actionType: saleTemp.saleId ? ApproveConst.ACTION_UPDATE : ApproveConst.ACTION_ADD,
            summary: saleTemp?.investor?.investorIdentification?.fullname + ' - ' + saleTemp?.investor?.phone,
          }
          this._saleService.request(body).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Trình duyệt thành công!")) {
              this.setPage();
            }
          });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', detail: 'Nhân viên sale không đủ thông tin để trình duyệt' });
    }
		
	}

  approve(item) {}

  cancel(item) {}

  confirmDelete() {}

}
