
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerConst ,IssuerConst, DistributionContractConst, SearchConst, FormNotificationConst, WhitelistIpConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { NationalityConst } from '@shared/nationality-list';
import { WhitelistIpServiceProxy } from '@shared/service-proxies/whitelist-ip-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';
import { FormNotificationComponent } from 'src/app/form-notification/form-notification.component';
import { FormSetDisplayColumnComponent } from 'src/app/form-set-display-column/form-set-display-column.component';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { CreateWhileListComponent } from './create-while-list/create-while-list.component';

@Component({
  selector: 'app-while-list-ip',
  templateUrl: './while-list-ip.component.html',
  styleUrls: ['./while-list-ip.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class WhileListIpComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    private dialogService: DialogService,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private _whitelistIpService: WhitelistIpServiceProxy,
    messageService: MessageService,
    private breadcrumbService: BreadcrumbService) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Whitelist Ip', routerLink: ['/establish/whilelist-ip'] },
    ]);
  }

  ref: DynamicDialogRef;

  modalDialog: boolean;
  deleteItemDialog: boolean = false;
  deleteItemsDialog: boolean = false;
  rows: any[] = [];
	row: any;
	col: any;

	cols: any[];
	_selectedColumns: any[];
  
  IssuerConst = IssuerConst;
  DistributionContractConst = DistributionContractConst;
  NationalityConst = NationalityConst;
  WhitelistIpConst = WhitelistIpConst;


  fieldErrors = {};
  //
  fieldDates = ['licenseDate', 'decisionDate', 'dateModified'];
  submitted: boolean;
  expandedRows = {};
  statuses: any[];
	listAction: any[] = [];


  //
  page = new Page();
  offset = 0;
  isToast: boolean = true;

  //
  actions: any[] = [];  // list button actions
  actionsDisplay: any[] = [];

  ngOnInit(): void {
    this.fixFloatToast();
    this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPage({ page: this.offset });
      } else {
        this.setPage();
      }
    });

    this.cols = [
			{ field: 'name', header: 'Tên ', width: '25rem', position: 2, isPin: true },
      { field: 'columnResize', header: '', type:'hidden' },
		];
		this._selectedColumns = this.getLocalStorage('whilelistip') ?? this.cols;  
  }

  fixFloatToast() {
    this.isToast = false;
    setTimeout(() => {
      this.isToast = true;
    }, 0);
  }

  getLocalStorage(key) {
		return JSON.parse(localStorage.getItem(key))
	}

	setLocalStorage(data) {
		return localStorage.setItem('whilelistip', JSON.stringify(data));
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
			row.shortName = row.shortName,
			row.email = row.email;
			row.phone = row.phone;
			row.address = row.address;
			row.repName = row.repName;
			row.repPosition = row.repPosition;
		};
	}

  genListAction(data = []) {
		this.listAction = data.map(partnerItem => {
			const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreWhitelistIp_ChiTiet])) {
        actions.push({
          data: partnerItem,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreWhitelistIp_CapNhat])) {
        actions.push({
          data: partnerItem,
          label: 'Sửa',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.edit($event.item.data);
          }
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreWhitelistIp_Xoa])) {
        actions.push({
          data: partnerItem,
          label: 'Xoá',
          icon: 'pi pi-trash',
          command: ($event) => {
            this.delete($event.item.data);
          }
        })
      }

			return actions;
		});    
	}

  create() {
    this.isToast = false;
    const ref = this.dialogService.open(
      CreateWhileListComponent,
      {
          header: 'Thêm whitelist ip',
          width: '1000px',
          contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
      }
  );
  //
  ref.onClose.subscribe((response) => {
      if (response?.accept) {
          this.messageSuccess('Thêm thành công', '');
          this.setPage();
      }
  });
  }

  deleteSelectedItems() {
    this.deleteItemsDialog = true;
  }

  detail(item, isCreateDetail?: boolean) {
    const ref = this.dialogService.open(
      CreateWhileListComponent,
        {
            header: 'Sửa whitelist ip',
            width: '1000px',
            contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
            data: {
                whiteListId: item.id,
                isCreateDetail: isCreateDetail,
                view: true,
            }
        }
    );
    //
    ref.onClose.subscribe((response) => {
        if (response?.accept) {
            this.messageSuccess('Cập nhật thành công', '');
            this.setPage();
        }
    });
}

  edit(item, isCreateDetail?: boolean) {
    const ref = this.dialogService.open(
      CreateWhileListComponent,
        {
            header: 'Sửa whitelist ip',
            width: '1000px',
            contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
            data: {
                whiteListId: item.id,
                isCreateDetail: isCreateDetail,
            }
        }
    );
    //
    ref.onClose.subscribe((response) => {
        if (response?.accept) {
            this.messageSuccess('Cập nhật thành công', '');
            this.setPage();
        }
    });
}

  delete(item) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Thông báo",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa whitelist IP này?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	if (dataCallBack?.accept) {
        this._whitelistIpService.delete(item.id).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Xóa whitelist IP thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if(pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.keyword;
    this.isLoading = true;
    this._whitelistIpService.getAll(this.page).subscribe((res) => {
      this.isLoading = false;
      if (this.handleResponseInterceptor(res, '')) {
        this.page.totalItems = res.data.totalItems;
        this.rows = res.data.items;
        //
        if(res.data?.items?.length) { 
          this.genListAction(this.rows);
          this.showData(this.rows);
         }        
      }
    }, (err) => {
      this.isLoading = false;
    });
  }

  hideDialog() {
    this.modalDialog = false;
    this.submitted = false;
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }
}

