import { ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AppConsts,
  CREATE,
  EDIT,
  FormNotificationConst,
  SearchConst,
  VIEW,
  VoucherManagement,
} from "@shared/AppConsts";
import { FormNotificationComponent } from "@shared/components/form-notification/form-notification.component";
import { CrudComponentBase } from "@shared/crud-component-base";
import {
  IHeaderColumn,
  ISelectButton,
} from "@shared/interface/InterfaceConst.interface";
import {
  CreateOrEditVoucher,
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
import { UploadImageComponent } from "src/app/components-general/upload-image/upload-image.component";
export const MARKDOWN_OPTIONS = {
  MARKDOWN: "MARKDOWN",
  HTML: "HTML",
};
export const DEFAULT_IMAGE_SIZE = {
  width: 343,
  height: 117,
};

@Component({
  selector: "create-or-edit-voucher-dialog",
  templateUrl: "./create-or-edit-voucher-dialog.component.html",
  styleUrls: ["./create-or-edit-voucher-dialog.component.scss"],
})
export class CreateOrEditVoucherDialogComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private router: Router,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private config: DynamicDialogConfig,
    private voucherManagementService: VoucherManagementService
  ) {
    super(injector, messageService);
  }
  public crudVoucher: CreateOrEditVoucher = new CreateOrEditVoucher();
  public htmlMarkdownOptions: ISelectButton[] = [
    {
      name: "MARKDOWN",
      value: MARKDOWN_OPTIONS.MARKDOWN,
    },
    {
      name: "HTML",
      value: MARKDOWN_OPTIONS.HTML,
    },
  ];
  public baseUrl: string = "";
  public caretPos: number = 0;
  public activeIndex: number;
  public isLoading: boolean;
  public dataSource: CustomerSearchModel[] = [];
  public selectedColumns: IHeaderColumn[] = [];
  public headerColumns: any[] = [];
  public keyword: string = "";
  public imgBackground = "assets/layout/images/add-image-voucher-bg.svg";
  public selectedImageVoucher: {
    src: string;
    width: number;
    height: number;
  };
  public type: string = "create";
  public selectedUser: CustomerSearchModel = new CustomerSearchModel();
  private isHasVoucherInvestor: boolean = false;

  public get listVoucherType() {
    return VoucherManagement.listVoucherTypeDropdown;
  }

  public get MARKDOWN_OPTIONS() {
    return MARKDOWN_OPTIONS;
  }

  public get CUSTOMER() {
    return VoucherManagement.CUSTOMER;
  }

  ngOnInit() {
    this.baseUrl = AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.selectedImageVoucher = {
      src: this.imgBackground,
      width: 547,
      height: 150,
    };
    if (this.config.data) {
      this.type = this.config.data.type;
    }
    if (this.type === CREATE) {
      this.activeIndex = this.CUSTOMER.INDIVIDUAL;
      this.crudVoucher.type = this.listVoucherType[0].value.toString();
      this.crudVoucher.contentType = MARKDOWN_OPTIONS.MARKDOWN;
      this.crudVoucher.createDate = this.voucherManagementService.currentTime;
      this.crudVoucher.createUser = this.voucherManagementService.currentUser;
    } else {
      this.crudVoucher.mapData(this.config.data.dataSource);
      this.crudVoucher.avatar &&
        (this.selectedImageVoucher = {
          src: this.crudVoucher.avatar,
          ...DEFAULT_IMAGE_SIZE,
        });
      this.isHasVoucherInvestor = !!this.crudVoucher.voucherInvestorId;
      this.crudVoucher.individualId &&
        this.voucherManagementService
          .getCustomerDetail(this.crudVoucher.individualId)
          .subscribe((res) => {
            if (res.data) {
              this.activeIndex = this.CUSTOMER.INDIVIDUAL;
              this.dataSource = [
                {
                  id: res.data?.defaultIdentification?.id,
                  name: res.data?.defaultIdentification?.fullname || "",
                  numberPhone: res.data.phone,
                  idNo: res.data?.defaultIdentification?.idNo,
                  email: res.data.email,
                  isSelected: true,
                } as CustomerSearchModel,
              ];
              this.selectedUser = {
                id: res.data?.defaultIdentification?.id,
                name: res.data?.defaultIdentification?.fullname || "",
                numberPhone: res.data.phone,
                idNo: res.data?.defaultIdentification?.idNo,
                email: res.data.email,
                isSelected: true,
              } as CustomerSearchModel;
              this.type === EDIT && (this.keyword = res.data.phone);
            }
          });
    }
    this.crudVoucher.createDate = this.formatDate(this.crudVoucher.createDate);
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

  public insertImageContent() {
    const ref = this.dialogService.open(UploadImageComponent, {
      data: {
        inputData: [],
        showOrder: false,
      },
      header: "Chèn hình ảnh",
      width: "600px",
      footer: "",
    });
    ref.onClose.subscribe((images) => {
      let imagesUrl = "";
      images?.forEach((image) => {
        imagesUrl += `![](${this.baseUrl}/${image.data}) \n`;
      });

      let oldContentValue = this.crudVoucher.content;
      let a =
        oldContentValue.slice(0, this.caretPos) +
        imagesUrl +
        oldContentValue.slice(this.caretPos);
      this.crudVoucher.content = a;
    });
  }

  public get displayContent() {
    if (this.crudVoucher.content) return this.crudVoucher.content;
    return "Nội dung hiển thị";
  }

  public getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == "0") {
      this.caretPos = oField.selectionStart;
    }
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
    this.dataSource = [];
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
            }
            this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
          }
        );
    }
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
  }

  public save(event?: any) {
    if (event) {
      const customerId = this.selectedUser?.id;
      if (this.activeIndex === this.CUSTOMER.INDIVIDUAL) {
        this.crudVoucher.individualId = customerId;
        this.crudVoucher.businessId = undefined;
      } else if (this.activeIndex === this.CUSTOMER.BUSINESS) {
        this.crudVoucher.individualId = undefined;
        this.crudVoucher.businessId = customerId;
      }
      if (this.crudVoucher.isValidData(this.isHasVoucherInvestor)) {
        this.crudVoucher.applyDate &&
          (this.crudVoucher.applyDate = this.formatCalendarItem(
            this.crudVoucher.applyDate
          ));
        this.crudVoucher.expireDate &&
          (this.crudVoucher.expireDate = this.formatCalendarItem(
            this.crudVoucher.expireDate
          ));
        this.voucherManagementService
          .createOrEditVoucher(
            this.crudVoucher.toObjectSendToAPI(this.type === EDIT),
            this.type === EDIT
          )
          .subscribe(
            (response) => {
              if (this.handleResponseInterceptor(response, "")) {
                this.ref.close(response);
              }
            },
            (err) => {}
          );
      } else {
        const messageError = this.crudVoucher.dataValidator.length
          ? this.crudVoucher.dataValidator[0].message
          : undefined;
        messageError && this.messageError(messageError);
      }
    }
  }

  public close(event: any) {
    this.ref.close();
  }

  public insertImageVoucher(event: any) {
    if (event && !this.isDisable) {
      const ref = this.dialogService.open(UploadImageComponent, {
        data: {
          inputData: [],
          showOrder: false,
          isImage: true,
        },
        header: "Chèn hình ảnh",
        width: "600px",
        footer: "",
      });
      ref.onClose.subscribe((images) => {
        if (images) {
          let imagesUrl = "";
          images?.forEach((image) => {
            imagesUrl += `${this.baseUrl}/${image.data}`;
          });

          this.selectedImageVoucher = {
            src: `${this.baseUrl}/${
              images && images.length ? images[0].data : ""
            }`,
            ...DEFAULT_IMAGE_SIZE,
          };
          this.crudVoucher.avatar = imagesUrl;
        }
      });
    }
  }

  public remove(event: any, row: CustomerSearchModel) {
    if (event && !this.isDisable) {
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

  public onClickSearch(event: any) {
    if (event && !this.isDisable) {
      this.getCustomer();
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

  public get isDisable() {
    return this.type === VIEW;
  }
}
