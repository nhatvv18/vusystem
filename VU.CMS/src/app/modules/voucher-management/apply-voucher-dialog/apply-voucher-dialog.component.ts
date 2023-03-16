import { ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormNotificationConst,
  SearchConst,
  VoucherManagement,
} from "@shared/AppConsts";
import { FormNotificationComponent } from "@shared/components/form-notification/form-notification.component";
import { CrudComponentBase } from "@shared/crud-component-base";
import { IHeaderColumn } from "@shared/interface/InterfaceConst.interface";
import {
  ApplyVoucher,
  CustomerSearchModel,
} from "@shared/interface/voucher-management/VoucherManagement.model";
import { VoucherManagementService } from "@shared/services/voucher-management-service";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "apply-voucher-dialog",
  templateUrl: "./apply-voucher-dialog.component.html",
  styleUrls: ["./apply-voucher-dialog.component.scss"],
})
export class ApplyVoucherDialogComponent extends CrudComponentBase {
  public activeIndex: number;
  public dataSource: CustomerSearchModel[] = [];
  public selectedColumns: IHeaderColumn[] = [];
  public headerColumns: any[] = [];
  public applyVoucher: ApplyVoucher = new ApplyVoucher();
  public selectedUser: CustomerSearchModel = new CustomerSearchModel();

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private router: Router,
    private ref: DynamicDialogRef,
    private changeDetectorRef: ChangeDetectorRef,
    private config: DynamicDialogConfig,
    private voucherManagementService: VoucherManagementService
  ) {
    super(injector, messageService);
  }

  public get CUSTOMER() {
    return VoucherManagement.CUSTOMER;
  }

  ngOnInit() {
    this.activeIndex = this.CUSTOMER.INDIVIDUAL;
    if (this.config.data.voucherId) {
      this.applyVoucher.voucherId = this.config.data.voucherId;
    }
    this.applyVoucher.createDate = this.formatDate(
      this.voucherManagementService.currentTime
    );
    this.applyVoucher.createUser = this.voucherManagementService.currentUser;
    this.headerColumns = [
      {
        key: this.CUSTOMER.INDIVIDUAL,
        value: [
          { field: "name", header: "Tên" },
          { field: "numberPhone", header: "Số điện thoại" },
          { field: "idNo", header: "Số giấy tờ" },
          { field: "email", header: "Email" },
        ],
      },
      {
        key: this.CUSTOMER.BUSINESS,
        value: [
          { field: "name", header: "Tên" },
          { field: "abbreviation", header: "Tên viết tắt" },
          { field: "taxCode", header: "Mã số thuế" },
          { field: "email", header: "Email" },
          { field: "numberPhone", header: "Số điện thoại" },
        ],
      },
    ];
    this.getCustomer();
  }

  ngAfterViewInit() {
    this.subject.keyword
      .pipe(debounceTime(SearchConst.DEBOUNCE_TIME))
      .subscribe(() => {
        if (this.keyword.trim()) {
          this.getCustomer();
        } else {
          this.dataSource = [];
        }
      });
  }

  public changeTabview(event: any) {
    if (event) {
      this.getCustomer();
    }
  }

  public getCustomer() {
    this.selectedColumns =
      this.headerColumns.find((e: any) => e.key === this.activeIndex)?.value ||
      [];
    this.keyword = this.keyword.trim();
    if (this.keyword.length) {
      this.isLoading = true;
      this.voucherManagementService
        .getCustomer(this.keyword, !!this.activeIndex)
        .subscribe(
          (res) => {
            if (this.handleResponseInterceptor(res, "")) {
              if (this.activeIndex === this.CUSTOMER.INDIVIDUAL) {
                this.dataSource = res?.data?.items.map(
                  (e: any) =>
                    ({
                      id: e?.defaultIdentification?.investorId,
                      name: e?.defaultIdentification?.fullname || "",
                      numberPhone: e.phone,
                      idNo: e?.defaultIdentification?.idNo,
                      email: e.email,
                      isSelected:
                        this.selectedUser.id === e?.defaultIdentification?.id,
                    } as CustomerSearchModel)
                );
              } else if (this.activeIndex === this.CUSTOMER.BUSINESS) {
                this.dataSource = res?.data?.items.map(
                  (e: any) =>
                    ({
                      id: e.id,
                      name: e.name,
                      abbreviation: e.shortName,
                      taxCode: e.taxCode,
                      numberPhone: e.phone,
                      email: e.email,
                    } as CustomerSearchModel)
                );
              }
              if (!this.dataSource.length)
                this.messageService.add({
                  severity: "error",
                  summary: "",
                  detail: "Không tìm thấy dữ liệu",
                  life: 1200,
                });
              this.isLoading = false;
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    } else {
      this.dataSource = [];
    }
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
  }

  public save(event?: any) {
    if (event) {
      this.applyVoucher.individualId = this.selectedUser?.id;
      if (this.applyVoucher.isValidData()) {
        this.voucherManagementService
          .applyVoucher(this.applyVoucher.toObjectSendToAPI())
          .subscribe(
            (response) => {
              if (this.handleResponseInterceptor(response, "")) {
                this.ref.close(response);
              }
            },
            (err) => {}
          );
      } else {
        const messageError = this.applyVoucher.dataValidator.length
          ? this.applyVoucher.dataValidator[0].message
          : undefined;
        messageError && this.messageError(messageError);
      }
    }
  }

  public close(event: any) {
    this.ref.close();
  }

  public remove(event: any, row: CustomerSearchModel) {
    if (event) {
      const ref = this.dialogService.open(FormNotificationComponent, {
        header: "Thông báo",
        width: "600px",
        contentStyle: {
          "max-height": "600px",
          overflow: "auto",
          "padding-bottom": "50px",
        },
        styleClass: "p-dialog-custom",
        baseZIndex: 10000,
        data: {
          title: "Bạn có chắc chắn muốn bỏ chọn khách hàng?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      });
      ref.onClose.subscribe((dataCallBack) => {
        if (dataCallBack?.accept) {
          this.dataSource = this.dataSource.filter(
            (e: CustomerSearchModel) => e.id !== row.id
          );
          this.selectedUser = new CustomerSearchModel();
          !this.dataSource.length && (this.keyword = "");
        }
      });
    }
  }

  public select(event: any, row: CustomerSearchModel) {
    if (event && row) {
      this.selectedUser = { ...row, isSelected: true };
      this.dataSource = this.dataSource.map((e: CustomerSearchModel) => {
        if (e.id === row.id) e.isSelected = true;
        return e;
      });
    }
  }
}
