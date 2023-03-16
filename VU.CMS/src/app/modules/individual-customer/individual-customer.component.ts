import { ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  IndividualCustomer,
  SearchConst,
  VoucherManagement,
} from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { IndividualCustomerModel } from "@shared/interface/individual-customer/IndividualCustomer.model";
import {
  IActionTable,
  IConstant,
  IHeaderColumn,
} from "@shared/interface/InterfaceConst.interface";
import { Page } from "@shared/model/page";
import { IndividualCustomerService } from "@shared/services/individual-customer-service";
import { MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { FormSetDisplayColumnComponent } from "src/app/form-general/form-set-display-column/form-set-display-column/form-set-display-column.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";

@Component({
  selector: "individual-customer",
  templateUrl: "./individual-customer.component.html",
  styleUrls: ["./individual-customer.component.scss"],
})
export class IndividualCustomerComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private dialogService: DialogService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private individualCustomerService: IndividualCustomerService
  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Khách hàng cá nhân" },
    ]);
  }

  dataSource: IndividualCustomerModel[] = [];
  isLoading: boolean;
  page: Page;
  listAction: IActionTable[][] = [];
  selectedColumns: IHeaderColumn[] = [];
  headerColumns: IHeaderColumn[] = [];
  filter: {
    keyword: string;
    gender: number | undefined;
    voucherLevel: number | undefined;
    account: number | undefined;
    class: number | undefined;
  } = {
    keyword: "",
    gender: undefined,
    voucherLevel: undefined,
    account: undefined,
    class: undefined,
  };

  public get listGender() {
    return IndividualCustomer.listGender;
  }

  public get listVoucherLevel() {
    return IndividualCustomer.listVoucherLevel;
  }

  public get listAccountType() {
    return IndividualCustomer.listAccountType;
  }

  public get listClass() {
    return IndividualCustomer.listClass;
  }

  public getStatusSeverity(code: any) {
    return IndividualCustomer.getStatus(code, "severity");
  }

  public getStatusName(code: any) {
    return IndividualCustomer.getStatus(code, "label");
  }

  ngOnInit(): void {
    this.headerColumns = [
      { field: "code", header: "Mã khách hàng", width: "10rem", isPin: true },
      { field: "name", header: "Tên khách hàng", width: "20rem", isPin: true },
      {
        field: "phoneNumber",
        header: "Số điện thoại",
        width: "10rem",
        isPin: true,
      },
      {
        field: "email",
        header: "Email",
        width: "20rem",
        isPin: true,
        class: "text-ellipsis",
      },
      { field: "gender", header: "Giới tính", width: "10rem", isPin: true },
      { field: "class", header: "Hạng", width: "10rem", isPin: true },
      { field: "voucherNumber", header: "Số voucher", width: "10rem" },
      { field: "point", header: "Điểm", width: "10rem" },
      { field: "event", header: "Sự kiện tham gia", width: "10rem" },
    ].map((item: IHeaderColumn, index: number) => {
      item.position = index + 1;
      return item;
    });
    this.selectedColumns =
      this.getLocalStorage(IndividualCustomer.keyStorage) ?? this.headerColumns;
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

  public setColumn(col, selectedColumns) {
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
          IndividualCustomer.keyStorage
        );
      }
    });
  }

  private genListAction() {
    this.listAction = this.dataSource.map(
      (data: IndividualCustomerModel, index: number) => {
        const actions: IActionTable[] = [];

        actions.push({
          data: data,
          label: "Thông tin chi tiết",
          icon: "pi pi-info-circle",
          command: ($event) => {
            this.detail($event.item.data);
          },
        });

        actions.push({
          data: data,
          label: "Chỉnh sửa",
          icon: "pi pi-pencil",
          command: ($event) => {
            this.edit($event.item.data);
          },
        });
        return actions;
      }
    );
  }

  public detail(data: IndividualCustomerModel) {
    this.router.navigate([
      "individual-customer/detail/" + this.cryptEncode(data.id),
    ]);
  }

  public edit(data: IndividualCustomerModel) {
    this.router.navigate([
      "individual-customer/edit/" + this.cryptEncode(data.id),
    ]);
  }

  public changeFilter(value) {
    this.setPage({ page: this.offset });
  }

  public setPage(pageInfo?: any) {
    this.isLoading = true;
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    if (pageInfo?.rows) this.page.pageSize = pageInfo?.rows;
    this.page.keyword = this.filter.keyword;

    this.individualCustomerService
      .getAllIndividualCustomer(this.page, this.filter)
      .subscribe(
        (res) => {
          this.isLoading = false;
          if (this.handleResponseInterceptor(res, "")) {
            this.page.totalItems = res.data.totalItems;
            if (res.data?.items) {
              this.dataSource = res.data.items.map(
                (item: any) =>
                  ({
                    id: item.investorId,
                    code: item.cifCode,
                    name: item.fullname,
                    phoneNumber: item.phone,
                    email: item.email,
                    gender:
                      IndividualCustomer.listSex.find(
                        (e: IConstant) => e.id === item.sex
                      )?.value || "",
                    class: item.rank,
                    voucherNumber: item.voucherNum,
                    point: item.point,
                    status: item.isVerified,
                  } as IndividualCustomerModel)
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
