import { ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  EDIT,
  FormNotificationConst,
  SearchConst,
  VIEW,
  VoucherManagement,
} from "@shared/AppConsts";
import { FormNotificationComponent } from "@shared/components/form-notification/form-notification.component";
import { CrudComponentBase } from "@shared/crud-component-base";
import {
  IActionTable,
  IConstant,
  IHeaderColumn,
} from "@shared/interface/InterfaceConst.interface";
import { VoucherManagementModel } from "@shared/interface/voucher-management/VoucherManagement.model";
import { Page } from "@shared/model/page";
import { VoucherManagementService } from "@shared/services/voucher-management-service";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormSetDisplayColumnComponent } from "src/app/form-general/form-set-display-column/form-set-display-column/form-set-display-column.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { ApplyVoucherDialogComponent } from "./apply-voucher-dialog/apply-voucher-dialog.component";
import { CreateOrEditVoucherDialogComponent } from "./create-or-edit-voucher-dialog/create-or-edit-voucher-dialog.component";

@Component({
  selector: "voucher-management",
  templateUrl: "./voucher-management.component.html",
  styleUrls: ["./voucher-management.component.scss"],
})
export class VoucherManagementComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private voucherManagementService: VoucherManagementService
  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Quản lý ưu đãi" },
    ]);
  }

  dataSource: VoucherManagementModel[] = [];
  isLoading: boolean;
  page: Page;
  listAction: IActionTable[][] = [];
  selectedColumns: IHeaderColumn[] = [];
  headerColumns: IHeaderColumn[] = [];
  filter: {
    keyword: string;
    status: number | undefined;
    applyDate: any | undefined;
    expireDate: any | undefined;
  } = {
    keyword: "",
    status: undefined,
    applyDate: "",
    expireDate: "",
  };
  public baseUrl: string = "";

  public get listStatus() {
    return VoucherManagement.listStatus;
  }

  public get listVoucherType() {
    return VoucherManagement.listVoucherType;
  }

  public getStatusSeverity(code: any) {
    return VoucherManagement.getStatus(code, "severity");
  }

  public getStatusName(code: any) {
    return VoucherManagement.getStatus(code, "label");
  }

  ngOnInit(): void {
    this.baseUrl = this.AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.headerColumns = [
      { field: "name", header: "Tên voucher", width: "20rem", isPin: true },
      { field: "type", header: "Loại voucher", width: "10rem", isPin: true },
      { field: "value", header: "Giá trị", width: "10rem", isPin: true },
      { field: "customer", header: "Khách hàng", width: "15rem", isPin: true },
      { field: "applyDate", header: "Ngày áp dụng", width: "10rem" },
      { field: "expireDate", header: "Ngày hết hạn", width: "10rem" },
      { field: "createDate", header: "Ngày tạo", width: "15rem" },
      { field: "createUser", header: "Người tạo", width: "15rem" },
      { field: "deliveryDate", header: "Ngày giao", width: "15rem" },
    ].map((item: IHeaderColumn, index: number) => {
      item.position = index + 1;
      return item;
    });
    this.selectedColumns =
      this.getLocalStorage(VoucherManagement.keyStorage) ?? this.headerColumns;
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

    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
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
          VoucherManagement.keyStorage
        );
      }
    });
  }

  genListAction() {
    this.listAction = this.dataSource.map(
      (data: VoucherManagementModel, index: number) => {
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

          // voucher trạng thái KHỞI TẠO => có thể CẤP PHÁT VOUCHER
          data.status === VoucherManagement.KHOI_TAO &&
            actions.push({
              data: data,
              label: "Cấp phát voucher",
              icon: "pi pi-pencil",
              command: ($event) => {
                this.apply($event.item.data);
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

  detail(data: VoucherManagementModel) {
    if (data.voucherId) {
      this.voucherManagementService
        .getVoucherById(data.voucherId, data.voucherInvestorId)
        .subscribe((res: any) => {
          if (res) {
            this.dialogService.open(CreateOrEditVoucherDialogComponent, {
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

  edit(data: VoucherManagementModel) {
    if (data.voucherId) {
      this.voucherManagementService
        .getVoucherById(data.voucherId, data.voucherInvestorId)
        .subscribe((res: any) => {
          if (res) {
            const ref = this.dialogService.open(
              CreateOrEditVoucherDialogComponent,
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

  apply(data: VoucherManagementModel) {
    if (data.voucherId) {
      const ref = this.dialogService.open(ApplyVoucherDialogComponent, {
        header: "Thêm khách hàng",
        width: "1200px",
        baseZIndex: 10000,
        data: {
          voucherId: data.voucherId,
        },
      });
      ref.onClose.subscribe((response) => {
        if (this.handleResponseInterceptor(response, "")) {
          this.messageService.add({
            severity: "success",
            summary: "",
            detail: "Gán voucher thành công cho khách hàng",
            life: 1500,
          });
          this.setPage({ page: this.offset });
        }
      });
    }
  }

  deactivate(data: VoucherManagementModel) {
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

  activate(data: VoucherManagementModel) {
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

  delete(data: VoucherManagementModel) {
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

  import(event: any) {
    if (event) {
      if (event?.files[0]) {
        this.voucherManagementService
          .importVoucher(event?.files[0])
          .subscribe((data) => {
            if (this.handleResponseInterceptor(data, "")) {
              this.messageService.add({
                severity: "success",
                summary: "",
                detail: "Tải lên thành công",
                life: 1500,
              });
              this.setPage({ page: this.offset });
            }
          });
      }
    }
  }

  create(event: any) {
    if (event) {
      const ref = this.dialogService.open(CreateOrEditVoucherDialogComponent, {
        header: "Thêm mới voucher",
        width: "1200px",
        baseZIndex: 10000,
      });
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

  changeFilter(value) {
    this.setPage({ page: this.offset });
  }

  setPage(pageInfo?: any) {
    this.isLoading = true;
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.filter.keyword;
    let filter = { ...this.filter };
    filter.applyDate &&
      (filter.applyDate = this.formatCalendarItem(filter.applyDate));
    filter.expireDate &&
      (filter.expireDate = this.formatCalendarItem(filter.expireDate));

    this.voucherManagementService.getAllVoucher(this.page, filter).subscribe(
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
                  type:
                    this.listVoucherType.find(
                      (e: IConstant) => e.id === item.voucherType
                    )?.value || "",
                  value: this.formatCurrency(item.value),
                  customer: item.username,
                  applyDate: item.startDate
                    ? this.formatDate(item.startDate)
                    : "",
                  expireDate: item.endDate ? this.formatDate(item.endDate) : "",
                  createDate: item.createdDate
                    ? this.formatDateTime(item.createdDate)
                    : "",
                  deliveryDate: item.voucherInvestorCreatedDate
                    ? this.formatDateTime(item.voucherInvestorCreatedDate)
                    : "",
                  createUser: item.createdBy,
                  status: item.status,
                } as VoucherManagementModel)
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
}
