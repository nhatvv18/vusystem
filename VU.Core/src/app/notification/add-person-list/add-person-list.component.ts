import { Component, Injector, OnInit } from '@angular/core';
import { SearchConst, SendNotifySizeConst } from '@shared/AppConsts';
import { CrudComponentBase } from '@shared/crud-component-base';
import { Page } from '@shared/model/page';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { NotificationService } from '@shared/service-proxies/notification-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-person-list',
  templateUrl: './add-person-list.component.html',
  styleUrls: ['./add-person-list.component.scss']
})
export class AddPersonListComponent extends CrudComponentBase implements OnInit {

  selectedCustomers: any[] = []
  isLoadingPersonList: boolean = true;
  rows: any[] = [];
  personListPage = new Page()
  inputData: any;
  statusCheckedAll: boolean = false;
  uniqCustomers: any[] = [];
  exitedPersonCodeList: any[] = [];
  filters: {
    pushAppStatus: any,
    sendEmailStatus: any,
    sendSMSStatus: any,
    sendNotifySize: any,
  }

  constructor(
    protected messageService: MessageService,
    private _investorService: InvestorServiceProxy,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private notificationService: NotificationService,
    injector: Injector) {
    super(injector, messageService);
    this.filters = {
      pushAppStatus: null,
      sendEmailStatus: null,
      sendSMSStatus: null,
      sendNotifySize: SendNotifySizeConst.PAGE,
    }
  }

  ngOnInit(): void {
    this.setPersonList(this.personListPage)
    this.inputData = this.config.data.inputData;

    // this.setPage({ page: this.offset });
    this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
      if (this.keyword === "") {
        this.setPersonList({ page: this.offset });
      } else {
        this.setPersonList();
      }
    })

    let filters = {
      'sendSMSStatus': this.filters.sendSMSStatus?.map(status => { return status.value }),
      'pushAppStatus': this.filters.pushAppStatus?.map(status => { return status.value }),
      'sendEmailStatus': this.filters.sendEmailStatus?.map(status => { return status.value }),
    }
    this.notificationService.getPersonList(this.inputData.id, this.personListPage, filters, true).subscribe((res) => {
      this.exitedPersonCodeList = res.results.map(person => { return Number(person.personCode) });
    });
  }

  findCustomer() {
  }

  addPeopleToSendingList() {
    let customers = this.selectedCustomers.map(customer => {
      return {
        fullName: customer?.name,
        personCode: customer?.userId,
        phoneNumber: customer.phone,
        email: customer?.email,
        notification: this.inputData.id,
        fcmTokens: [...customer?.fcmTokens]
      }
    })
    // lọc danh sách ko trùng personCode
    this.uniqCustomers = customers.filter((item) => ( !this.exitedPersonCodeList.includes(item.personCode) ));
        
    this.isLoadingPersonList = true;
    this.notificationService.addPeopleToNotification({ sendingList: this.uniqCustomers }, this.inputData.id)
      .subscribe(results => {
        this.isLoadingPersonList = false;
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Thành công', detail: 'Cập nhật danh sách người nhận thành công' });
        this.ref.close(null);
      }, error => {
        this.isLoadingPersonList = false;
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra. Vui lòng thử lại!' });
      })

  }

  setPersonList(pageInfo?: any) {
    this.personListPage.pageNumber = pageInfo?.page ?? this.offset;
    this.personListPage.keyword = this.keyword;
    this.isLoadingPersonList = true;
    this._investorService.getInvestorListNotify(this.personListPage, "").subscribe((res) => {
        if (this.handleResponseInterceptor(res, "")) {
          this.personListPage.totalItems = res.data.totalItems;
          console.log(' this.personListPage.totalItems: ', this.personListPage.totalItems);
          
          // this.rows = res.data.items;
          if (Array.isArray(res.data?.items)) {
            let i = 0;
            this.rows = res.data?.items.map(item => {
              return {
                ...item,
                id: i++
              }
            });
            console.log({ 'rows': this.rows });
          }
        }
        this.isLoadingPersonList = false;
      },
      () => {
        this.isLoadingPersonList = false;
      }
    );
  }

  onRowSelect(event) {
    console.log('eventSelect', event);
  }

  onRowUnSelect($event) {
    console.log('eventSelect', this.selectedCustomers);
  }

  selectedAll(statusCheckedAll) {
    if(statusCheckedAll) {
      this.isLoadingPersonList = true;
      this._investorService.getAllInvestorListNotify().subscribe((res) => {
          if (this.handleResponseInterceptor(res, "")) {
            if (Array.isArray(res.data?.items)) {
              let i = 0;
              this.selectedCustomers = res.data?.items.map(item => {
                return { ...item, id: i++ }
              });
              console.log('selectAll', this.selectedCustomers);
            }
          }
          this.isLoadingPersonList = false;
        }
      );
    } else {
      this.selectedCustomers = [];
    }
    //
    this.statusCheckedAll = statusCheckedAll;
  }
}
