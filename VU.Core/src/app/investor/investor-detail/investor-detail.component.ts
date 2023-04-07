import { Component, Injector, OnInit, ViewChild  } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ApproveConst, FormNotificationConst, InvestorConst, KeyFilter, PermissionCoreConst, YesNoConst } from "@shared/AppConsts";
import { OBJECT_INVESTOR_EKYC } from "@shared/base-object";
import { CrudComponentBase } from "@shared/crud-component-base";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { ApproveTradingProviderComponent } from "../approve-trading-provider/approve-trading-provider.component";
import { NationalityConst } from "@shared/nationality-list";
import { FormApproveComponent } from "src/app/form-request-approve-cancel/form-approve/form-approve.component";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { FormRequestComponent } from "src/app/form-request-approve-cancel/form-request/form-request.component";
import { FileServiceProxy } from "@shared/service-proxies/file-service";
import { FormCancelComponent } from "src/app/form-request-approve-cancel/form-cancel/form-cancel.component";
import { InvestorDiffComponent } from "../investor-diff/investor-diff.component";
import { FormApproveInvestorComponent } from "../form-approve-investor/form-approve-investor.component";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { TabPanel, TabView } from "primeng/tabview";
import { InvestorRequestPhoneComponent } from "./investor-request-phone/investor-request-phone.component";
import { InvestorCancelHistoryComponent } from "../investor-cancel-history/investor-cancel-history.component";
const { MODAL_EKYC_TYPE, DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;

@Component({
  selector: "app-investor-detail",
  templateUrl: "./investor-detail.component.html",
  styleUrls: ["./investor-detail.component.scss"],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class InvestorDetailComponent extends CrudComponentBase {
  constructor(
    injector: Injector,
    public route: ActivatedRoute,
    messageService: MessageService,
    private location: Location,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private routeActive: ActivatedRoute,
    public _investorService: InvestorServiceProxy,
    private _bankService: BankServiceProxy,
    private _dialogService: DialogService,
    private _fileService: FileServiceProxy,
    private confirmationService: ConfirmationService
  ) {
    super(injector, messageService);
    this.investor.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
    this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
    this.isApprove = this.routeActive.snapshot.paramMap.get("isApprove");

    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      {
        label: this.isTemp
          ? "Thêm khách hàng cá nhân"
          : "Danh sách khách hàng cá nhân",
        routerLink: ["/customer/investor" + (this.isTemp ? "/approve" : "")],
      },
      { label: "Thông tin khách hàng" },
    ]);

  }
  
  /* Check isApprove */
  isApprove = null;

  /* CONST */
  InvestorConst = InvestorConst;
  YesNoConst = YesNoConst;
  PermissionCoreConst = PermissionCoreConst;
  
  KeyFilter = KeyFilter;
  NatinalityList = NationalityConst.List;
  MODAL_EKYC_TYPE = MODAL_EKYC_TYPE;
  checkbox_approve: boolean = true;
  actions: any[] = [];
  actionsIndetification: any[] = [];
  banks: any = {};
  actionsDisplay: any[] = [];
  listAction: any[] = [];
  isEdit = false;
  fieldDates = ["dateOfBirth", "idDate", "idExpiredDate"];
  fieldErrors = {};
  investorDetail = {};
  labelButtonEdit = "Chỉnh sửa";
  diffDetail1: any = {};
  diffDetail2: any = {};

  // TOAST
  isToast: boolean = true;

  /* TAB VIEW */
  activeIndex = 0;

  /* MAIN */
  investor: any = {
    investorId: 0,
    investorGroupId: 0,
    notice: "",
    referralCodeSelf: "",
  };

  // XEM INVESTOR CÓ PHẢI LÀ TEMP KO
  // TEMP => YES | 1 => DÙNG VỚI API THÌ TRUYỀN TRUE
  // TEMP => NO | 0 => DÙNG VỚI API THÌ TRUYỀN FALSE
  isTemp = InvestorConst.TEMP.YES;

  fieldDateInit = {
    identification: ["idDate", "idExpiredDate", "dateOfBirth"],
    investor: ["birthDate"],
  };

  faceImage: any = DEFAULT_IMAGE.IMAGE_AVATAR;
  checkImage: any = DEFAULT_IMAGE.IMAGE_AVATAR;

  /* */
  viewImage = {
    url: "",
    modalVisible: false,
  };

  /* MODAL EKYC */
  modalDialogEkyc: boolean = false;
  isLoading: boolean = false;
  isLoadingPage: boolean = false;
  modalDialog: boolean;

  tabViewActive = {
    'thongTinChung': true,
    'taiKhoanNganHang': true,
    'quanLyTaiKhoan': false,
    'fileDinhKem': false,
    'diaChiLienHe': false,
    'chungMinhNDTCN': false,
    'tuVanVien': false,
    'nguoiGioiThieu': false,
    'taiKhoanChungKhoan': false,
  };

  @ViewChild(TabView) tabView: TabView;

  /* METHODS */
  ngOnInit() {
    const isEdit = localStorage.getItem("isEditInvestor");
    if (isEdit == "true") {
      localStorage.removeItem("isEditInvestor");
      this.isEdit = true;
    }
    this.initData();
    this.getAllBank();
  }

  cancelHistory(investor) {
    const ref = this._dialogService.open(
      InvestorCancelHistoryComponent,
      {
        header: "Xem lý do hủy duyệt",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto","padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          investor : investor,
        },
      }
    );
  }

  approveSharing(investor) {
    console.log("investorRRRRRRRR",investor);
    
    const ref = this._dialogService.open(
      FormApproveInvestorComponent,
      {
        header: "Xử lý yêu cầu",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto","padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          investorId: investor?.approve?.approveID,
          actionType: investor?.approve?.actionType,
          requestDate: investor?.approve?.requestDate,
          approveDate: investor?.approve?.approveDate,
        },
      }
    );

    console.log("abc", investor?.referIdTemp);
    ref.onClose.subscribe((dataCallBack) => {
      if (dataCallBack?.accept) {
        console.log("dataCallBack",dataCallBack);
        let body1 = {
          notice: dataCallBack?.data?.approveNote,
          investorId: investor.investorId,
          investorIdTemp: investor.investorId,
          incorrectFields: dataCallBack?.cancelHistory,
        }
        // body1.incorrectFields = dataCallBack?.cancelHistory;
        console.log("dataCallBack?.checkApprove ", dataCallBack?.cancelHistory);
        
        if ( dataCallBack?.checkApprove == true) {
          this._investorService.approve(body1).subscribe((response) => {
           if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
            this.initData(false);
           };
          });
        } else if ( dataCallBack?.checkApprove == false) { 
          this._investorService.cancel(body1).subscribe((response) => {
            console.log("data cô bách: " + dataCallBack.data.approveNote);
            if (this.handleResponseInterceptor(response, "Hủy duyệt thành công")) {
              this.initData(false);
            }
          });
        }
      }
    });
  }

  changeTabview(e) {
    let tabHeader = this.tabView.tabs[e.index].header;
    this.tabViewActive[tabHeader] = true;
  }

  resetForm() {
    this.undo();
  }

  fixFloatToast() {
    this.isToast = false;
    setTimeout(() => {
      this.isToast = true;
    }, 0);
  }

  requestEmail(investor) {
    console.log("investorrrr",investor.phone);
    
    const data = {
      phone : investor?.email,
      id: investor?.investorId,
      summary:
        investor?.defaultIdentification?.fullname + " - " + investor.phone,
      actionType:
        investor?.isUpdate === "Y"
          ? ApproveConst.ACTION_UPDATE
          : ApproveConst.ACTION_ADD,
    };
    const ref = this._dialogService.open(
      InvestorRequestPhoneComponent,
      {
        header: "Yêu cầu đổi Email",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {

  
          phone: data?.phone ?? null,
          title : "Email hiện tại",
          titleRequest : "Email mới"
        },
      }
    );
    //
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack, investor });

      if (dataCallBack?.accept) {
        const body = {
          investorId: investor.investorId,
          email: dataCallBack?.data?.requestNote,
          isTemp: false
        };
        this.fixFloatToast();
        this._investorService.requestEmail(body).subscribe((res) => {
          if (this.handleResponseInterceptor(res, "Yêu cầu thành công!")) {
            this.initData(false);
          }
        }, (err) => {
          console.log('Error-------', err);
        });
      }
    });
  }

  requestPhone(investor) {
    console.log("investorrrr",investor.phone);
    
    const data = {
      phone : investor?.phone,
      id: investor?.investorId,
      summary:
        investor?.defaultIdentification?.fullname + " - " + investor.phone,
      actionType:
        investor?.isUpdate === "Y"
          ? ApproveConst.ACTION_UPDATE
          : ApproveConst.ACTION_ADD,
    };
    const ref = this._dialogService.open(
      InvestorRequestPhoneComponent,
      {
        header: "Yêu cầu đổi số điện thoại",
        width: '600px',
        contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
        styleClass: 'p-dialog-custom',
        baseZIndex: 10000,
        data: {
          phone: data?.phone ?? null,
          title : "Số điện thoại hiện tại",
          titleRequest : "Số điện thoại mới"
        },
      }
    );
    //
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack, investor });

      if (dataCallBack?.accept) {
        const body = {
          investorId: investor.investorId,
          phone: dataCallBack?.data?.requestNote,
          isTemp: false
        };
        this.fixFloatToast();
        this._investorService.requestPhone(body).subscribe((res) => {
          if (this.handleResponseInterceptor(res, "Yêu cầu thành công!")) {
            this.initData(false);
          }
        }, (err) => {
          console.log('Error-------', err);
        });
      }
    });
  }

  request(investor) {
    console.log("investorrrr",investor);
    
    const data = {
      id: investor?.investorId,
      summary:
        investor?.defaultIdentification?.fullname + " - " + investor.phone,
      actionType:
        investor?.isUpdate === "Y"
          ? ApproveConst.ACTION_UPDATE
          : ApproveConst.ACTION_ADD,
    };
    const ref = this._dialogService.open(
      FormRequestComponent,
      this.getConfigDialogServiceRAC("Trình duyệt", data)
    );
    //
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack, investor });

      if (dataCallBack?.accept) {
        const body = {
          investorId: investor.investorId,
          investorGroupId: investor?.investorGroupId,
          action: data?.actionType,
          notice: dataCallBack?.data?.requestNote,
          userApproveId: null,
          summary: data?.summary,
        };
        this.fixFloatToast();
        this._investorService.request(body).subscribe((res) => {
          if (this.handleResponseInterceptor(res, "Trình duyệt thành công!")) {
            this.initData(false);
          }
        }, (err) => {
          console.log('Error-------', err);
        });
      }
    });
  }

  checkFace() {
    const body = {
      FaceImage: this.checkImage,
      investorId: this.investor.investorId,
      investorGroupId: this.investor.investorGroupId,
      isTemp: this.isTemp === InvestorConst.TEMP.YES ? true : false,
    };
    console.log("this.faceImage UPLOAD", this.faceImage);

    this.isLoading = true;
    this.fixFloatToast();
    this._investorService.checkFace(body).subscribe(
      (res) => {
        this.isLoading = false;
        if (
          this.handleResponseInterceptor(res, "Đã xác minh mặt thành công!")
        ) {
          this.modalDialog = false;
          this.initData(false);
        }
      },
      (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        this.messageService.add({
          severity: "error",
          summary: "Có lỗi khi xác minh, vui lòng thử lại",
          detail: "",
        });
      }
    );
  }

  onSave() {
    this.checkFace();
  }

  saveLabel() {
    return "Gửi";
  }

  undo() {
    this.checkImage = DEFAULT_IMAGE.IMAGE_AVATAR;
  }

  genListActionIndentification(data = []) {
    this.actionsIndetification = data.map((item) => {
      const action = [];

      if (item.isDefault !== this.YesNoConst.YES) {
        action.push({
          data: item,
          label: "Chọn mặc định",
          icon: "pi pi-check",
          command: ($event) => {
            this.setDefaultIdentification($event.item.data);
          },
        });
      }


      return action;
    });
    console.log("actions", this.actionsIndetification);
  }

  setDefaultIdentification(row) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn muốn chọn giấy tờ này thành mặc định?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
        isTemp: this.isTemp == InvestorConst.TEMP.YES ? true : false,
        identificationId: row?.id,
			};
			if (dataCallBack?.accept) {
			this._investorService.setDefaultIdentification(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Chọn giấy tờ này thành mặc định thành công"
				)
			  ) {
				this.initData(false);
			  }
			});
			}
		});
	  }

  //DROPDOWN ACTIONS
  genListAction(invsetorItem) {
    this.actions = [];

    if (
      invsetorItem?.defaultIdentification?.isVerifiedFace != "Y" &&
      ((this.isGranted([PermissionCoreConst.CoreDuyetKHCN_CheckFace]) && this.isTemp == InvestorConst.TEMP.YES) 
			|| (this.isGranted([PermissionCoreConst.CoreKHCN_CheckFace]) && this.isTemp == InvestorConst.TEMP.NO))
    ) {
      this.actions.push({
        data: invsetorItem,
        label: "Kiểm tra mặt",
        icon: "pi pi-eye",
        command: ($event) => {
          this.showDialogCheckFace($event.item.data);
        },
      });
    }

    if (this.isApprove == 'approve') {
      this.actions.push({
        data: invsetorItem,
        label: "Phê duyệt",
        icon: "pi pi-check",
        command: ($event) => {
          this.approve($event.item.data);
        },
      });
    }
    
    // if (
    //   invsetorItem.approve.status == this.InvestorConst.STATUS.TRINH_DUYET &&
    //   this.isGranted([])
    // ) {
    //   this.actions.push({
    //     data: invsetorItem,
    //     label: "Phê duyệt",
    //     icon: "pi pi-check",
    //     command: ($event) => {
    //       this.approve($event.item.data?.invsetorId);
    //     },
    //   });
    // }
    if (invsetorItem.approve.status == this.InvestorConst.STATUS.KHOI_TAO && this.isTemp == InvestorConst.TEMP.YES && this.isGranted([PermissionCoreConst.CoreDuyetKHCN_TrinhDuyet])) {
      this.actions.push({
        data: invsetorItem,
        label: "Trình duyệt",
        icon: "pi pi-arrow-up",
        command: ($event) => {
          this.request($event.item.data);
        },
      });
    }
  }

  showDialogCheckFace(investor) {
    this.modalDialog = true;
  }

  //ROUTER KHI KẾT THÚC BẢNG TẠM
  view() {
    this.router.navigate(["/customer/investor"]);
  }

  viewUpdate(idTemp) {
    this.router
      .navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"])
      .then(() => {
        window.location.reload();
      });
  }

  //CHO PHEP DUYET
  approve(investorId) {
    const ref = this._dialogService.open(FormApproveInvestorComponent, {
      header: "Phê duyệt",
      width: "600px",
      contentStyle: {
        "max-height": "600px",
        overflow: "auto",
        "padding-bottom": "50px",
      },
      styleClass: "p-dialog-custom",
      baseZIndex: 10000,
      data: {
        investorId: this.investor?.investorId,
        cifCode: this.investor?.cifCode,
      },
    });

    ref.onClose.subscribe((dataCallBack) => {
      const body = {
        notice: dataCallBack?.data?.approveNote,
        investorId: this.investor.investorId,
        investorGroupId: this.investor.investorGroupId,
        investorIdTemp: this.investor.investorId,
      };
      console.log('databackkk', dataCallBack);
      if (dataCallBack.checkApprove) {
        if (dataCallBack?.accept) {
          this._investorService.approve(body).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Phê duyệt thành công")) {
              setTimeout(() => {
                this.view();
              }, 800);
            }
          });
        }
      } else {
        if (dataCallBack?.accept) {
          this._investorService.cancel(body).subscribe((response) => {
            if (this.handleResponseInterceptor(response, "Hủy phê duyệt thành công")) {
              setTimeout(() => {
                this.view();
              }, 800);
            }
          });
        }
      }
    });
  }

  cancel(investorId) {
    const ref = this._dialogService.open(
      FormCancelComponent,
      this.getConfigDialogServiceRAC("Hủy duyệt", this.investor?.investorId)
    );
    ref.onClose.subscribe((dataCallBack) => {
      const body = {
        notice: dataCallBack?.data?.cancelNote,
        investorIdTemp: this.investor.investorId,
      };

      if (dataCallBack?.accept) {
        this._investorService.cancel(body).subscribe((response) => {
          if (
            this.handleResponseInterceptor(response, "Hủy duyệt thành công")
          ) {
            this.initData(false);
          }
        });
      }
    });
  }

  // LỌC ACTIONSIndetification
  getActionsDisplay() {
    this.actionsDisplay = this.actions.filter((action) =>
      action.statusActive.includes(this.investor.status)
    );
  }

  initData(isLoadingPage = true) {
    this.isLoadingPage = isLoadingPage;

    console.log("=== INIT DATA");
    this._investorService
      .getInvestor(this.investor.investorId, this.isTemp)
      .subscribe((res) => {
        if (this.handleResponseInterceptor(res, "")) {
          if (res?.data?.avatarImageUrl) {
            this.faceImage = `${this._investorService.getBaseApiUrl()}/${
              res.data.avatarImageUrl
            }`;
          }
          if (res?.data?.faceImageUrl) {
            this.checkImage = `${this._investorService.getBaseApiUrl()}/${
              res.data.faceImageUrl
            }`;
          }

          this.fieldDateInit.investor.forEach((key) => {
            const value = res.data[key];
            if (value) {
              res.data[key] = new Date(value);
            }
          });

          if (
            res?.data?.defaultIdentification &&
            Object.keys(res?.data?.defaultIdentification).length > 0
          ) {
            //
            this.fieldDateInit.identification.forEach((key) => {
              const value = res?.data?.defaultIdentification[key];
              if (value) {
                res.data.defaultIdentification[key] = new Date(value);
              }
            });
            //
            if (
              res?.data?.defaultIdentification?.fullname &&
              !res?.data?.name
            ) {
              res.data.name = res?.data?.defaultIdentification.fullname;
            }
          }

          this.investor = res?.data;
          console.log('investor', this.investor);
          
          this.genListAction(this.investor);
          this.genListActionIndentification(this.investor.listIdentification);
        }
      })
      .add(() => {
        this.isLoadingPage = false;
      });
  }

  getAllBank() {
    this.page.keyword = this.keyword;
    this.isLoading = true;
    this._bankService.getAllBank(this.page).subscribe(
      (res) => {
        this.isLoading = false;
        if (this.handleResponseInterceptor(res, "")) {
          this.page.totalItems = res.data.totalItems;
          this.banks = res.data.items.map((item) => ({
            ...item,
            bankId: item.bankId,
          }));
          this.banks = this.banks.map((bank) => {
            bank.labelName = bank.bankName + " - " + bank.fullBankName;
            return bank;
          });
          console.log({
            banks: res.data.items,
            totalItems: res.data.totalItems,
          });
        }
      },
      (err) => {
        this.isLoading = false;
        console.log('Error-------', err);
        
      }
    );
  }

  /**
   * MO MODAL IDENTIFICATION
   */
  openModalAddIdentification() {
    this.modalDialogEkyc = true;
  }

  /* THEM IDENTIFICATION THANH CONG */
  onSaveIdentification() {
    this.initData(false);
  }

  /**
   * MỞ MODAL DLSC APPROVE
   * @param data
   */
  openModalDlscApprove() {
    const ref = this._dialogService.open(ApproveTradingProviderComponent, {
      header: "Duyệt khách hàng",
      data: this.investor,
    });

    ref.onClose.subscribe((res) => {
      this.initData();
    });
  }

  /**
   * VIEW IMAGE
   */
  openModalViewImage(url) {
    this.viewImage = {
      url,
      modalVisible: true,
    };
  }

  /**
   * CẬP NHẬT INVESTOR
   */
  saveInvestor() {
    let defaultIdentification = this.formatCalendar(this.fieldDates, {...this.investor.defaultIdentification});
    const body = { 
      ...this.investor,
      defaultIdentification: defaultIdentification, 
      isTemp: this.isTemp == InvestorConst.TEMP.YES 
    };

    this.isLoading = true;
    this._investorService.updateInvestor(body).subscribe((res) => {
          if (this.handleResponseInterceptor(res, "Cập nhật thành công")) {
            this.location.back();
          } 
        },
        (err) => {}
      )
      .add(() => {
        this.isLoading = false;
      });
  }

  /**
   * UPLOAD ANH
   */
  uploadFaceImage() {
    const body = {
      avatar: this.faceImage,
      investorId: this.investor.investorId,
      investorGroupId: this.investor.investorGroupId,
      isTemp: this.isTemp === InvestorConst.TEMP.YES ? true : false,
    };
    console.log("this.faceImage UPLOAD", this.faceImage);

    this.isLoading = true;
    this._investorService
      .createAvatar(body)
      .subscribe(
        (res) => {
          if (this.handleResponseInterceptor(res, "Cập nhật ảnh thành công!")) {
          } else {
          }
        },
        (err) => {}
      )
      .add(() => {
        this.initData(false);
        this.isLoading = false;
      });
  }

  changeEdit() {
    const body = { ...this.investor, isTemp: this.isTemp == InvestorConst.TEMP.YES };

    console.log(this.investor);
    if (this.isEdit) {
      body.defaultIdentification = this.formatCalendar(this.fieldDates, {...body.defaultIdentification});
      this._investorService.updateInvestor(body).subscribe((response) => {
        if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
          this.setStatusEdit();
          console.log("data", response.data);
          if (this.isTemp === 0) {
            this.isLoadingPage = true;
            setTimeout(() => {
              this.viewUpdate(response.data);
            }, 500);
          } else {
            this.initData(false);
          }
        } 
      });
    } else {
      this.setStatusEdit();
    }
  }

  setStatusEdit() {
    this.isEdit = !this.isEdit;
    this.editorConfig.editable = this.isEdit;
  }

  check(investor) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn có chắc chắn xác minh khách hàng này không?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				investorId: investor?.investorId,
				investorGroupId: investor?.investorGroupId,
			};
			if (dataCallBack?.accept) {
			this._investorService.checkInvestor(body).subscribe((response) => {
			  this.handleResponseInterceptor(response,"Xác minh khách hàng thành công")
			});
			}
		});
	}
}
