import { ChangeDetectorRef, Component, Injector, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CREATE, EDIT, VIEW, VoucherManagement } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { ISelectButton } from "@shared/interface/InterfaceConst.interface";
import { CreateOrEditVoucher } from "@shared/interface/voucher-management/VoucherManagement.model";
import { IndividualCustomerService } from "@shared/services/individual-customer-service";
import { VoucherManagementService } from "@shared/services/voucher-management-service";
import { MessageService } from "primeng/api";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
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
  selector: "create-or-edit-voucher-customer",
  templateUrl: "./create-or-edit-voucher-customer.component.html",
  styleUrls: ["./create-or-edit-voucher-customer.component.scss"],
})
export class CreateOrEditVoucherCustomerComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    messageService: MessageService,
    private router: Router,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private config: DynamicDialogConfig,
    private individualCustomerService: IndividualCustomerService,
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
  public imgBackground = "assets/layout/images/add-image-voucher-bg.svg";
  public selectedImageVoucher: {
    src: string;
    width: number;
    height: number;
  };
  public type: string = CREATE;

  public get listVoucherType() {
    return VoucherManagement.listVoucherTypeDropdown;
  }

  public get MARKDOWN_OPTIONS() {
    return MARKDOWN_OPTIONS;
  }

  ngOnInit() {
    this.baseUrl = this.AppConsts.remoteServiceBaseUrl ?? this.baseUrl;
    this.selectedImageVoucher = {
      src: this.imgBackground,
      width: 547,
      height: 150,
    };
    if (this.config.data) {
      this.type = this.config.data.type;
    }
    if (this.type === CREATE) {
      this.crudVoucher.type = this.listVoucherType[0].value.toString();
      this.crudVoucher.contentType = MARKDOWN_OPTIONS.MARKDOWN;
    } else {
      this.crudVoucher.mapData(this.config.data.dataSource);
      this.crudVoucher.avatar &&
        (this.selectedImageVoucher = {
          src: this.crudVoucher.avatar,
          ...DEFAULT_IMAGE_SIZE,
        });
      this.crudVoucher.createDate = this.formatDateYMD(
        this.crudVoucher.createDate
      );
    }
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

  public save(event?: any) {
    if (event) {
      this.crudVoucher.individualId =
        this.individualCustomerService.individualCustomerId;
      this.crudVoucher.businessId = undefined;
      if (this.crudVoucher.isValidData(this.type === EDIT)) {
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

  public getCaretPos(oField) {
    if (oField.selectionStart || oField.selectionStart == "0") {
      this.caretPos = oField.selectionStart;
    }
  }

  public get displayContent() {
    if (this.crudVoucher.content) return this.crudVoucher.content;
    return "Nội dung hiển thị";
  }

  public get isDisable() {
    return this.type === VIEW;
  }
}
