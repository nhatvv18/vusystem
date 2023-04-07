import { Component, Injector, Input, OnInit } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserTypes, WhitelistIpConst } from '@shared/AppConsts';
import { WhitelistIpServiceProxy } from '@shared/service-proxies/whitelist-ip-service';
import { CreateWhileListDetailComponent } from './create-while-list-detail/create-while-list-detail.component';
import { Page } from '@shared/model/page';

@Component({
  selector: 'app-create-while-list',
  templateUrl: './create-while-list.component.html',
  styleUrls: ['./create-while-list.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class CreateWhileListComponent extends CrudComponentBase {

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    public configDialog: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private _whitelistIpService: WhitelistIpServiceProxy,
    public confirmationService: ConfirmationService,
  ) {
    super(injector, messageService);
    this.userLogin = this.getUser();
  }

  fieldErrors: any = {};
  isCreateDetail: boolean;
  rows: any[] = [];
  // Data Init
  row: any;
  col: any;
  whiteListIP: any = {
    'name': null,   
    'type': 0,   
    'whiteListIPDetails': [],
  }

  whiteListId: number;

  blockText: RegExp = /[0-9,.]/;
  submitted: boolean;
  view: boolean;
  //
  cols: any[];

  types: any[] = [];

  listActionWhileListDetail: any[] = [];

  page = new Page();
  offset = 0;
  userLogin: any = {};
  WhitelistIpConst = WhitelistIpConst;
  UserTypes = UserTypes;

  ngOnInit(): void {
    if(UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type)) {
      this.types = WhitelistIpConst.type.filter(obj => obj.type === 'TRADING');
    } else if(UserTypes.TYPE_EPIC.includes(this.userLogin.user_type)) {
      this.types = WhitelistIpConst.type.filter(obj => obj.type === 'ROOT');
    }
    console.log("type",UserTypes.TYPE_EPIC.includes(this.userLogin.user_type));
    console.log("this.types",this.userLogin);
    this.whiteListId = this.configDialog?.data?.whiteListId;
    this.view = this.configDialog?.data?.view;
    this.isCreateDetail = this.configDialog?.data?.isCreateDetail;
    if (this.whiteListId) {
      this.getDetail(this.whiteListId);
    }
  }

  getDetail(whiteListId) {
    if (whiteListId != null) {
      this._whitelistIpService.get(whiteListId).subscribe(
        (res) => {
          if (this.handleResponseInterceptor(res, '')) {
            this.whiteListIP = res?.data;
            this.genlistActionWhileListDetail(this.whiteListIP?.whiteListIPDetails);

            if (this.isCreateDetail) {
              this.isCreateDetail = false;
              this.createWhileListDetail();
            }
          }
          this.submitted = false;
        });
    } else {

    }

  }

  genlistActionWhileListDetail(data = []) {
    this.listActionWhileListDetail = data.map((whileListDetail, index) => {
      const actions = [
        {
          data: whileListDetail,
          label: 'Sửa',
          icon: 'pi pi-pencil',
          command: ($event) => {
            this.editWhileListDetail($event.item.data);
          }
        },
        {
          data: whileListDetail,
          index: index,
          label: 'Xoá',
          icon: 'pi pi-trash',
          command: ($event) => {
            this.deleteWhileListDetail($event.item.data, $event.item.index);
          }
        },

      ];
      return actions;
    });
  }

  createWhileListDetail() {
    const ref = this.dialogService.open(
      CreateWhileListDetailComponent,
      {
        header: 'Thêm chi tiết',
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
        baseZIndex: 10000,
        data: {
          whiteListId: this.whiteListIP.id,
        }
      }

    );

    ref.onClose.subscribe((whileListDetail) => {      
      if (whileListDetail?.bondPolicyDetailTempId || whileListDetail?.fakeId) {
     
        if (!whileListDetail?.bondPolicyDetailTempId) {
          this.whiteListIP.whiteListIPDetails.push(whileListDetail);
          this.genlistActionWhileListDetail(this.whiteListIP.whiteListIPDetails);
          if (whileListDetail.whiteListId != null) {
            this.getDetail(this.whiteListIP.id);
            
          }
        } 
      }

      if (whileListDetail?.whiteListId != null) {
        this.getDetail(this.whiteListIP.id);
      }

    });

  }

  editWhileListDetail(whileListDetail) {
    const ref = this.dialogService.open(
      CreateWhileListDetailComponent,
      {
        header: 'Sửa chi tiết',
        width: '650px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
        baseZIndex: 10000,
        data: {
          whileListDetail: whileListDetail,
          whiteListId: this.whiteListIP.id,
        },
      }
    );
    //
    ref.onClose.subscribe((whileListDetail) => {
      if (whileListDetail?.fakeId) {
        const index = this.whiteListIP.whiteListIPDetails.findIndex(item => item.fakeId == whileListDetail.fakeId);
        if (index !== -1) this.whiteListIP.whiteListIPDetails[index] = whileListDetail;
        if ( whileListDetail.whiteListId != null) {
          this.getDetail(this.whiteListIP.id);
        }
      } else {
      }
    });
  }

  deleteWhileListDetail(whileListDetail, index) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa kỳ hạn ${whileListDetail.name}`,
      header: 'Xóa kỳ hạn',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Đồng ý',
      rejectLabel: 'Hủy bỏ',
      accept: () => {
        this.whiteListIP.whiteListIPDetails.splice(index, 1);
        this.genlistActionWhileListDetail(this.whiteListIP.whiteListIPDetails);
        this.messageService.add({ severity: 'success', detail: 'Xóa thành công !' });
      }
    });
  }

  save() {
    this.submitted = true;
    if (this.whiteListIP.id) {
      this._whitelistIpService.update(this.whiteListIP).subscribe((response) => {
          if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
            this.ref.close({ data: response, accept: true });
            this.submitted = false;
          } else {
            this.submitted = false;
          }
        }, (err) => {
          this.submitted = false;
        }
      );
    } else {
      this._whitelistIpService.create(this.whiteListIP).subscribe((response) => {
          if (this.handleResponseInterceptor(response,"Thêm thành công")) {
            this.ref.close({ data: response, accept: true });
            this.submitted = false;
          } else {
            this.submitted = false;
          }
        }, (err) => {
          this.submitted = false;
        }
      );
    }
  }

  close() {
    this.ref.close();
  }

  validForm(): boolean {
    const validRequired = this.whiteListIP?.name ;
                        
    return validRequired;
  }

  resetValid(field) {
    this.fieldErrors[field] = false;
  }

  formatCurrency(value) {
    return value.toLocaleString('de-DE', { style: 'currency', currency: 'USD' });
  }

}

