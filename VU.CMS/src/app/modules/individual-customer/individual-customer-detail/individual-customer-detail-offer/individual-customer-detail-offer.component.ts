import { Component, Injector, OnInit } from "@angular/core";
import {
  EDIT,
  FormNotificationConst,
  IndividualCustomer,
  SearchConst,
  VIEW,
  VoucherManagement,
} from "@shared/AppConsts";
import { FormNotificationComponent } from "@shared/components/form-notification/form-notification.component";
import { CrudComponentBase } from "@shared/crud-component-base";
import { IndividualCustomerDetailOfferModel } from "@shared/interface/individual-customer/IndividualCustomer.model";
import {
  IActionTable,
  IDropdown,
  IHeaderColumn,
} from "@shared/interface/InterfaceConst.interface";
import { Page } from "@shared/model/page";
import { IndividualCustomerService } from "@shared/services/individual-customer-service";
import { VoucherManagementService } from "@shared/services/voucher-management-service";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormSetDisplayColumnComponent } from "src/app/form-general/form-set-display-column/form-set-display-column/form-set-display-column.component";
import { CreateOrEditVoucherCustomerComponent } from "./create-or-edit-voucher-customer/create-or-edit-voucher-customer.component";

@Component({
  selector: "individual-customer-detail-offer",
  templateUrl: "./individual-customer-detail-offer.component.html",
  styleUrls: ["./individual-customer-detail-offer.component.scss"],
})
export class IndividualCustomerDetailOfferComponent extends CrudComponentBase {
  public dataSource: IndividualCustomerDetailOfferModel[] = [];
  public page: Page = new Page();
  public selectedColumns: IHeaderColumn[] = [];
  public headerColumns: IHeaderColumn[] = [];
  public filter: {
    keyword: string;
    voucherType: number | undefined;
    status: number | undefined;
  } = {
    keyword: "",
    voucherType: undefined,
    status: undefined,
  };
  public listAction: IActionTable[][] = [];

  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private individualCustomerService: IndividualCustomerService,
    private voucherManagementService: VoucherManagementService
  ) {
    super(injector, messageService);
  }

  public get listVoucherType() {
    return IndividualCustomer.listVoucherType;
  }

  public get listStatus() {
    return VoucherManagement.listStatus;
  }

  public getStatusSeverity(code: any) {
    return VoucherManagement.getStatus(code, "severity");
  }

  public getStatusName(code: any) {
    return VoucherManagement.getStatus(code, "label");
  }

  ngOnInit() {
    this.headerColumns = [
      { field: "name", header: "Tên voucher", width: "30rem", isPin: true },
      { field: "type", header: "Loại voucher", width: "15rem", isPin: true },
      { field: "value", header: "Giá trị", width: "15rem", isPin: true },
      { field: "applyDate", header: "Ngày áp dụng", width: "15rem" },
      { field: "expireDate", header: "Ngày hết hạn", width: "15rem" },
      { field: "createDate", header: "Ngày tạo", width: "15rem" },
      { field: "createUser", header: "Người tạo", width: "15rem" },
    ].map((item: IHeaderColumn, index: number) => {
      item.position = index + 1;
      return item;
    });
    this.selectedColumns =
      this.getLocalStorage(IndividualCustomer.keyStorageDetailOffer) ??
      this.headerColumns;
    this.setPage({ page: this.offset });
  }

  ngAfterViewInit() {
    this.subject.keyword
      .pipe(debounceTime(SearchConst.DEBOUNCE_TIME))
      .subscribe(() => {
        if (this.filter.keyword === "") {
          this.setPage({ page: this.offset });
        } else {
          this.setPage();
        }
      });
  }

  setColumn(col, selectedColumns) {
    const ref = this.dialogService.open(
      FormSetDisplayColumnComponent,
      this.getConfigDialogServiceDisplayTableColumn(col, selectedColumns)
    );
    ref.onClose.subscribe((dataCallBack) => {
      if (dataCallBack?.accept) {
        this.selectedColumns = dataCallBack.data.sort(function (a, b) {
          return a.position - b.position;
        });
        this.setLocalStorage(
          this.selectedColumns,
          IndividualCustomer.keyStorageDetailOffer
        );
      }
    });
  }

  public setPage(pageInfo?: any) {
    this.isLoading = true;
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.individualCustomerService
      .getListVoucherByCustomerId(this.page, this.filter)
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (this.handleResponseInterceptor(res, "")) {
            this.page.totalItems = res.data.totalItems;
            if (res.data?.items) {
              this.dataSource = res.data.items.map(
                (item: any) =>
                  ({
                    voucherId: item.voucherId,
                    voucherInvestorId: item.voucherInvestorId,
                    name: item.name,
                    type: IndividualCustomer.listVoucherType.find(
                      (e: IDropdown) => e.value === item.voucherType
                    )?.label,
                    value: this.formatCurrency(item.value),
                    applyDate: item.startDate
                      ? this.formatDate(item.startDate)
                      : "",
                    expireDate: item.endDate
                      ? this.formatDate(item.endDate)
                      : "",
                    createDate: item.createdDate
                      ? this.formatDateTime(item.createdDate)
                      : "",
                    createUser: item.createdBy,
                    status: item.status,
                  } as IndividualCustomerDetailOfferModel)
              );
              this.genListAction();
            }
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  public genListAction() {
    this.listAction = this.dataSource.map(
      (data: IndividualCustomerDetailOfferModel, index: number) => {
        const actions: IActionTable[] = [];

        actions.push({
          data: data,
          label: "Thông tin chi tiết",
          icon: "pi pi-info-circle",
          command: ($event) => {
            this.detail($event.item.data);
          },
        });

        // voucher trạng thái !== XÓA
        if (data.status !== VoucherManagement.DA_XOA) {
          // voucher trạng thái !== HẾT HẠN
          data.status !== VoucherManagement.HET_HAN &&
            actions.push({
              data: data,
              label: "Chỉnh sửa",
              icon: "pi pi-pencil",
              command: ($event) => {
                this.edit($event.item.data);
              },
            });

          // voucher trạng thái KÍCH HOẠT => có thể HỦY KÍCH HOẠT
          data.status === VoucherManagement.KICH_HOAT &&
            actions.push({
              data: data,
              label: "Hủy kích hoạt",
              icon: "pi pi-pencil",
              command: ($event) => {
                this.deactivate($event.item.data);
              },
            });

          // voucher trạng thái HỦY KÍCH HOẠT => có thể KÍCH HOẠT
          data.status === VoucherManagement.HUY_KICH_HOAT &&
            actions.push({
              data: data,
              label: "Kích hoạt",
              icon: "pi pi-pencil",
              command: ($event) => {
                this.activate($event.item.data);
              },
            });

          actions.push({
            data: data,
            label: "Xóa",
            icon: "pi pi-trash",
            command: ($event) => {
              this.delete($event.item.data);
            },
          });
        }
        return actions;
      }
    );
  }

  public create(event: any) {
    if (event) {
      const ref = this.dialogService.open(
        CreateOrEditVoucherCustomerComponent,
        {
          header: "Thêm mới voucher",
          width: "1200px",
          baseZIndex: 10000,
        }
      );
      ref.onClose.subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
          this.messageService.add({
            severity: "success",
            summary: "",
            detail: "Thêm mới thành công",
            life: 1500,
          });
          this.setPage({ page: this.offset });
        }
      });
    }
  }

  public detail(data: IndividualCustomerDetailOfferModel) {
    if (data.voucherId) {
      this.voucherManagementService
        .getVoucherById(data.voucherId, data.voucherInvestorId)
        .subscribe((res: any) => {
          if (res) {
            this.dialogService.open(CreateOrEditVoucherCustomerComponent, {
              header: "Xem chi tiết voucher",
              width: "1200px",
              baseZIndex: 10000,
              data: {
                dataSource: res.data,
                type: VIEW,
              },
            });
          }
        });
    }
  }

  public edit(data: IndividualCustomerDetailOfferModel) {
    if (data.voucherId) {
      this.voucherManagementService
        .getVoucherById(data.voucherId, data.voucherInvestorId)
        .subscribe((res: any) => {
          if (res) {
            const ref = this.dialogService.open(
              CreateOrEditVoucherCustomerComponent,
              {
                header: "Chỉnh sửa voucher",
                width: "1200px",
                baseZIndex: 10000,
                data: {
                  dataSource: res.data,
                  type: EDIT,
                },
              }
            );
            ref.onClose.subscribe((response) => {
              if (this.handleResponseInterceptor(response, "")) {
                this.messageService.add({
                  severity: "success",
                  summary: "",
                  detail: "Chỉnh sửa thành công",
                  life: 1500,
                });
                this.setPage({ page: this.offset });
              }
            });
          }
        });
    }
  }

  deactivate(data: IndividualCustomerDetailOfferModel) {
    if (data) {
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
          title: "Bạn có chắc chắn muốn hủy kích hoạt?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      });
      ref.onClose.subscribe((dataCallBack) => {
        if (dataCallBack?.accept) {
          this.voucherManagementService
            .changeStatusVoucher(
              VoucherManagement.HUY_KICH_HOAT,
              data.voucherInvestorId
            )
            .subscribe(
              (response) => {
                if (
                  this.handleResponseInterceptor(
                    response,
                    "Hủy kích hoạt thành công"
                  )
                ) {
                  this.setPage({ page: this.offset });
                }
              },
              (err) => {
                this.messageError(`Không hủy kích hoạt được voucher`);
              }
            );
        }
      });
    }
  }

  activate(data: IndividualCustomerDetailOfferModel) {
    if (data) {
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
          title: "Bạn có chắc chắn muốn kích hoạt?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      });
      ref.onClose.subscribe((dataCallBack) => {
        if (dataCallBack?.accept) {
          this.voucherManagementService
            .changeStatusVoucher(
              VoucherManagement.KICH_HOAT,
              data.voucherInvestorId
            )
            .subscribe(
              (response) => {
                if (
                  this.handleResponseInterceptor(
                    response,
                    "Kích hoạt thành công"
                  )
                ) {
                  this.setPage({ page: this.offset });
                }
              },
              (err) => {
                this.messageError(`Kủy kích hoạt được voucher`);
              }
            );
        }
      });
    }
  }

  delete(data: IndividualCustomerDetailOfferModel) {
    if (data) {
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
          title: "Bạn có chắc chắn muốn xóa voucher?",
          icon: FormNotificationConst.IMAGE_CLOSE,
        },
      });
      ref.onClose.subscribe((dataCallBack) => {
        if (dataCallBack?.accept) {
          this.voucherManagementService
            .deleteVoucher(data.voucherId, data.voucherInvestorId)
            .subscribe(
              (response) => {
                if (
                  this.handleResponseInterceptor(response, "Xóa thành công")
                ) {
                  this.setPage({ page: this.offset });
                }
              },
              (err) => {
                this.messageError(`Không xóa được voucher`);
              }
            );
        }
      });
    }
  }

  public changeFilter(event: any) {
    if (event) {
      this.setPage({ page: this.offset });
    }
  }
}
