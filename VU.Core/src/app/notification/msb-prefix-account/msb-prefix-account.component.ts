import { Component, Injector, OnInit } from '@angular/core';
import {SearchConst, FormNotificationConst, MSBPrefixAccountConst, YesNoConst, StatusDeleteConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NationalityConst } from '@shared/nationality-list';
import { MSBPrefixAccountServiceProxy } from '@shared/service-proxies/whitelist-ip-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { CreateMsbPrefixAccountComponent } from './create-msb-prefix-account/create-msb-prefix-account.component';

@Component({
  selector: 'app-msb-prefix-account',
  templateUrl: './msb-prefix-account.component.html',
  styleUrls: ['./msb-prefix-account.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class MsbPrefixAccountComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private _dialogService: DialogService,
    private _MSBPrefixService: MSBPrefixAccountServiceProxy,
    private breadcrumbService: BreadcrumbService
    ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Tiền tố giao dịch MSB', routerLink: ['/establish/msb-prefix-account'] },
    ]);
  }

  ref: DynamicDialogRef;

  rows: any[] = [];

	cols: any[];
	_selectedColumns: any[];
  
  NationalityConst = NationalityConst;
  MSBPrefixAccountConst = MSBPrefixAccountConst;
  StatusDeleteConst = StatusDeleteConst;
 
  submitted: boolean;
	listAction: any[] = [];

  page = new Page();
  offset = 0;
  //
  listBanks: any;

  ngOnInit(): void {
    //
    this.setPage({ page: this.offset });

    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });
    //
    this.cols = [
			{ field: 'prefixMsb', header: 'Tiền tố MSB', width: '10rem', isPin: true },
			{ field: 'bankName', header: 'Ngân hàng', width: '12rem', isPin: true },
			{ field: 'bankAccNo', header: 'Tài khoản gốc', width: '10rem', isPin: true },
			{ field: 'bankAccName', header: 'Chủ tài khoản', width: '20rem', isPin: true, isResize: true },
			{ field: 'createdDateDisplay', header: 'Ngày tạo', width: '11rem' },
			{ field: 'createdBy', header: 'Người tạo', width: '10rem' },
			{ field: 'modifiedBy', header: 'Người sửa cuối', width: '10rem' },
			{ field: 'modifiedDateDisplay', header: 'Lần sửa cuối', width: '11rem' },
		];
    //
		this._selectedColumns = this.getLocalStorage('msbPrefix') ?? this.cols;  
  }
  
  getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}

	setLocalStorage(data) {
		return localStorage.setItem('msbPrefix', JSON.stringify(data));
	}

	setColumn(col, _selectedColumns) {
		const ref = this.dialogService.open(
			FormSetDisplayColumnComponent,
			this.getConfigDialogServiceDisplayTableColumn("Sửa cột hiển thị", col, _selectedColumns)
		);

		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				this._selectedColumns = dataCallBack.data.sort(function (a, b) {
					return a.position - b.position;
				});
				this.setLocalStorage(this._selectedColumns)
			}
		});
	}

	showData(rows) {
		for (let row of rows) {
      row.bankName = row?.businessCustomerBank?.bankName;
      row.bankAccNo = row?.businessCustomerBank?.bankAccNo;
      row.bankAccName = row?.businessCustomerBank?.bankAccName;
      row.bankName = row?.businessCustomerBank?.bankName;
      row.createdDateDisplay = this.formatDateTime(row?.createdDate);
      row.modifiedDateDisplay = this.formatDateTime(row?.modifiedDate);
		};
	}

  genListAction(data = []) {
		this.listAction = data.map(item => {
			const actions = [];
      
      if (this.isGranted([this.PermissionCoreConst.CoreMsbPrefix_ChiTiet])) {
        actions.push({
          data: item,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      if(item.deleted == YesNoConst.NO) {
        if (this.isGranted([this.PermissionCoreConst.CoreMsbPrefix_CapNhat])) {
          actions.push({
            data: item,
            label: 'Sửa',
            icon: 'pi pi-pencil',
            command: ($event) => {
              this.edit($event.item.data);
            }
          })
        }
  
        if (this.isGranted([this.PermissionCoreConst.CoreMsbPrefix_Xoa])) {
          actions.push({
            data: item,
            label: 'Xoá',
            icon: 'pi pi-trash',
            command: ($event) => {
              this.delete($event.item.data);
            }
          })
        }
      }
			return actions;
		});
	}

  create() {
    const ref = this.dialogService.open(
      CreateMsbPrefixAccountComponent,
      {
        header: 'Cấu hình giao dịch MSB',
        width: '500px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
        data: {
          create: true,
        }
      });
  
    ref.onClose.subscribe((statusResponse) => {
      if (statusResponse) {
        this.setPage();
      }
    });
  }

  detail(item) {
    const ref = this.dialogService.open(
      CreateMsbPrefixAccountComponent,
        {
          header: 'Thông tin cấu hình',
          width: '500px',
          contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
          data: {
              prefix: item,
              view: true,
          }
        }
    );
  }
  //
  edit(item) {
    const ref = this.dialogService.open(
      CreateMsbPrefixAccountComponent,
        {
          header: 'Sửa cấu hình',
          width: '500px',
          contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
          data: {
            prefixAccountId: item.id,
          }
        }
    );
    
    ref.onClose.subscribe((statusResponse) => {
        if (statusResponse) {
            this.setPage();
        }
    });
  }

  delete(partner) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Thông báo",
				width: '400px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa cấu hình tài khoản này?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    //
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
        this._MSBPrefixService.delete(partner.id).subscribe((response) => {
          if (this.handleResponseInterceptor(response,"Xóa thành công")) {
            this.setPage();
          }
        });
    	}
    });
  }

  getBankName(tradingBankAccountId) {
    // this.listBanks.labelName = null
    if(this.listBanks?.length) {
      let tradingBankAccountBank = this.listBanks.find(item => item.businessCustomerBankId == tradingBankAccountId);
      return tradingBankAccountBank ? tradingBankAccountBank.labelName : ''; 
    } 
    return '';
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    forkJoin([this._MSBPrefixService.getAll(this.page), this._MSBPrefixService.getBankList({bankId: MSBPrefixAccountConst.ID_MSB_BANK})]).subscribe(([resPrefix, resBank]) => {
      this.isLoading = false;
      // LẤY DANH SÁCH BANK
      if (this.handleResponseInterceptor(resBank, '')) {
        if(resBank?.data?.length) {
					this.listBanks = resBank.data.map(bank => {
						bank.labelName = bank?.bankAccNo + ' - ' + bank.bankAccName + ' - ' + bank.bankName;
						return bank;
					})
				}
      }
      // LẤY DANH SÁCH MSB PREFIX
      if (this.handleResponseInterceptor(resPrefix, '')) {
        this.page.totalItems = resPrefix.data.totalItems;
        this.rows = resPrefix.data.items;
        //
        this.genListAction(this.rows);
        this.showData(this.rows);
      }
    }, (err) => {
      this.isLoading = false;
      console.log('Error-------', err);
    });
  }

}


