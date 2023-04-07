import { PathConst } from './../../../../shared/AppConsts';
import { map } from 'rxjs/operators';
import { Component, Injector, OnInit } from '@angular/core';
import { ApproveConst, BusinessCustomerApproveConst, InvestorConst, SaleConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormRequestComponent } from 'src/app/form-request-approve-cancel/form-request/form-request.component';
import { FormCancelComponent } from 'src/app/form-request-approve-cancel/form-cancel/form-cancel.component';
import { NationalityConst } from '@shared/nationality-list';
import { FormApproveSaleComponent } from './form-approve-sale/form-approve-sale.component';
import { SaleService } from '@shared/service-proxies/sale-service';
import { forkJoin } from 'rxjs';
import { OBJECT_INVESTOR_EKYC } from '@shared/base-object';

const { DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;
@Component({
  selector: 'app-sale-temporary-detail',
  templateUrl: './sale-temporary-detail.component.html',
  styleUrls: ['./sale-temporary-detail.component.scss']
})
export class SaleTemporaryDetailComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private _saleService: SaleService,

  ) {
    super(injector, messageService);

    this.breadcrumbService.setItems([
      { label: 'Trang chủ', routerLink: ['/home'] },
      { label: 'Danh sách sale', routerLink: ['/sale-manager/sale-temporary'] },
    ]);
    //
    this.saleTempId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
  }

  fieldErrors: any = {};

  saleTempId: number;
  saleInfo: any = {};

  investorInfo: any = {};
  businessCustomerInfo: any = {};

  InvestorConst = InvestorConst;

  avatarDefault: any = DEFAULT_IMAGE.IMAGE_AVATAR;
  //
  isEdit = false;

  SaleConst = SaleConst;
  ApproveConst = ApproveConst;
  NationalityConst = NationalityConst;

  banks: any = {};
  rows: any[] = [];
  actions: any[] = [];  // list button actions

  managers: any[] = [];
  departments: any[] = [];
  

  ngOnInit(): void {
    this.getDetail();
  }

  changeSaleType(saleType) {
    if(saleType == SaleConst.TYPE_MANAGER) {
      this.saleInfo.saleParentId = null;
    }
  }

  redirectSaleActive() {
    this.router.navigate(["/sale-manager/sale-active"]);
  }

  genActions(saleInfo) {
    this.actions = [];
    //
      if(this.isGranted([this.PermissionCoreConst.CoreDuyetSale_TrinhDuyet]) && (saleInfo.status == SaleConst.STATUSTEMP_TEMP)) {
        this.actions.push({
          data: saleInfo,
          label: 'Trình duyệt',
          icon: 'pi pi-arrow-up',
          permission: this.isGranted([]),
          command: ($event) => {
            this.request($event.item.data);
          }
        });
      }
    //
    // if(saleInfo.status == SaleConst.STATUSTEMP_REQUEST) {
    //   this.actions.push({
    //     data: saleInfo,
    //     label: 'Phê duyệt',
    //     icon: 'pi pi-check',
    //     permission: this.isGranted([]),
    //     command: ($event) => {
    //       this.approve($event.item.data);
    //     }
    //   });
    // }

    // if (saleInfo.status == this.BusinessCustomerApproveConst.status.CHO_DUYET) {
    //   this.actions.push({
    //     data: saleInfo,
    //     label: 'Xem thay đổi',
    //     icon: 'pi pi-question-circle',
    //     statusActive: [BusinessCustomerApproveConst.status.CHO_DUYET],
    //     permission: this.isGranted([]),
    //     command: ($event) => {
    //       this.showChange($event.item.data);
    //     }
    //   })
    // }

    // if (saleInfo.status == SaleConst.STATUSTEMP_REQUEST) {
    //   this.actions.push({
    //     data: saleInfo,
    //     label: 'Hủy duyệt',
    //     icon: 'pi pi-times',
    //     permission: this.isGranted([]),
    //     command: ($event) => {
    //       this.cancel($event.item.data);
    //     }
    //   })
    // }
  }

  setFieldError() {
    for (const [key, value] of Object.entries(this.saleInfo)) {
      this.fieldErrors[key] = false;
    }
    console.log({ filedError: this.fieldErrors });
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  changeAvatarDefault() {
    this.avatarDefault = PathConst.AVATAR_GENNERAL_DEFAULT;
  }

  getDetail(isLoading = true) {
    this.isLoadingPage = isLoading;
    forkJoin([this._saleService.getTemp(this.saleTempId),this._saleService.getAllDepartment()]).subscribe(([resSale, resDepartment]) => {
      this.isLoadingPage = false;
      this.departments = resDepartment.data?.items ?? [];
      if (this.handleResponseInterceptor(resSale, '')) {
        if(resSale.data?.departmentId) this.changeDepartment(resSale.data?.departmentId);
        this.saleInfo = resSale?.data;

        // Nếu là sale doanh nghiệp thì đổi ảnh nền default khác
        if(this.saleInfo?.businessCustomerId) this.changeAvatarDefault();
        
        if(this.saleInfo?.investorId) {

          this.investorInfo = this.saleInfo?.investor;
          this.banks = this.saleInfo?.investor?.listBank;

          if(this.saleInfo?.investor?.listBank?.length) {
            this.banks = this.saleInfo.investor.listBank.map(bank => {
              bank.labelName = bank.bankAccount + ' - ' + (bank?.coreBankName ?? bank?.bankName);
              return bank;
            });
          }
        } else 
        if(this.saleInfo?.businessCustomerId) {
          this.businessCustomerInfo = this.saleInfo?.businessCustomer;
          this.banks = this.saleInfo?.businessCustomer?.businessCustomerBanks;

          if(this.saleInfo?.businessCustomer?.businessCustomerBanks?.length) {
            this.banks = this.saleInfo.businessCustomer.businessCustomerBanks.map(bank => {
              bank.labelName = bank.bankAccName + ' - ' + bank?.bankAccNo + ' - ' + bank?.bankName;
              bank.id = bank.businessCustomerBankId;
              return bank;
            });
          }
        } 

        if(this.saleInfo) {
          this.genActions(this.saleInfo);
        }
        console.log({ saleInfo: this.saleInfo });
      }
    }, (err) => {
      this.isLoadingPage = false;
      console.log('Error-------', err);
      
    });
  }

  changeDepartment(departmentId) {
    this._saleService.getAllSale(departmentId).subscribe((res) => {
      if(this.handleResponseInterceptor(res, '')) {
        if(res.data?.items?.length) {
          this.managers = res.data.items.map(item => {
              item.fullName = item.investor?.investorIdentification?.fullname ?? item?.businessCustomer?.name;
              return item;
          });
        } else {
          this.managers = [];
        }
      }
    });
  }

  changeEdit() {
    console.log(this.saleInfo);
    if (this.isEdit) {
      this.saleInfo.saleTempId = this.saleInfo.id;
			this._saleService.updateTemp(this.saleInfo).subscribe((response) => {
				if (this.handleResponseInterceptor(response, 'Cập nhật thành công')) {
          this.isEdit = !this.isEdit;
					this.getDetail(false);
				}
			}, (err) => {
        console.log('err---', err);
        this.messageService.add({ severity: 'error', detail: 'Có lỗi xảy ra vui lòng thử lại sau ít phút', life: 1200 });
      });
    } else {
      this.isEdit = !this.isEdit;
    }
  }

  //
  request(saleTemp) {
    console.log("saleTemp?.invesor?.phone",saleTemp.investor);
    
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
            summary: saleTemp.investorId ? (saleTemp?.investor?.investorIdentification?.fullname + ' - ' + saleTemp?.investor?.phone) 
                                         : (saleTemp?.businessCustomer?.name + ' - ' + saleTemp?.businessCustomer?.taxCode),
          }
          this._saleService.request(body).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Trình duyệt thành công!")) {
              this.getDetail();
            }
          });
        }
      });
     } else {
      this.messageService.add({ severity: 'error', detail: 'Nhân viên sale không đủ thông tin để trình duyệt' });
     }
	}

  //
  cancel(saleTemp) {
    const ref = this.dialogService.open(
			FormCancelComponent,
			this.getConfigDialogServiceRAC("Trình duyệt", {})
		);
		//
		ref.onClose.subscribe((dataCallBack) => {
			console.log('dataCallBack', dataCallBack);
			if (dataCallBack?.accept) {
        const body = {
          ...dataCallBack.data,
          saleTempId: saleTemp.id,
        }
        //
				this._saleService.cancel(body).subscribe((response) => {
					if (this.handleResponseInterceptor(response, "Hủy duyệt thành công!")) {
						this.getDetail();
					}
				});
			}
		});
  }

  approveSale(investor) {
		console.log("investor", investor);

		const ref = this.dialogService.open(
			FormApproveSaleComponent,
			this.getConfigDialogServiceRAC("Xử lý yêu cầu", investor?.id)
		);
		console.log("abc", investor?.id);

		ref.onClose.subscribe((dataCallBack) => {
			if (dataCallBack?.accept) {
				const body = {
					approveNote: dataCallBack.data.approveNote,
					cancelNote: dataCallBack.data.approveNote,
					saleTempId: investor.id,
				}
				if ( dataCallBack?.checkApprove == true) {

					this._saleService.approve(body).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
							this.getDetail();
						}
					});
				} else if ( dataCallBack?.checkApprove == false) {
					this._saleService.cancel(body).subscribe((response) => {
						if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
							this.getDetail();
						}
					});
				}

			}
		});
	}

  showChange(saleInfo) {
    // const ref = this.dialogService.open(
    //   FormShowChangeComponent,
    //   this.getConfigDialogServiceRAC("Thay đổi sau khi chỉnh sửa", { id: saleInfo.businessCustomerTempId })
    // );

  }

  
}


