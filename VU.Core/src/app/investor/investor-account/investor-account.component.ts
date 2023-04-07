import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormNotificationConst, InvestorConst, UserConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { CreateUserComponent } from "../create-user/create-user.component";
import { UserResetPasswordComponent } from "../user-reset-password/user-reset-password.component";

@Component({
  selector: "app-investor-account",
  templateUrl: "./investor-account.component.html",
  styleUrls: ["./investor-account.component.scss"],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class InvestorAccountComponent extends CrudComponentBase {
  InvestorConst = InvestorConst;
  UserConst = UserConst;

  constructor(
    injector: Injector,
    messageService: MessageService,
    private routeActive: ActivatedRoute,
    private _investorService: InvestorServiceProxy,
    private _dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    super(injector, messageService);
    this.investor.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id')); 

    console.log("init ivesntor id => ", this.investor.investorId);
  }

  isLoading: boolean = false;
  FormNotificationConst = FormNotificationConst;
  YesNoConst = YesNoConst;
  listUsers: any = [];
  listAction: any = [];
  investor: any = {
    investorId: 0,
  };

  ngOnInit(): void {
    this.setPage();
  }

  setPage(pageInfo?: any) {
    this.page.pageNumber = pageInfo?.page ?? this.offset;
    this.page.keyword = this.keyword;
    this.isLoading = true;

    this._investorService
      .getListUsers(this.page, this.investor.investorId)
      .subscribe(
        (res) => {
          if (this.handleResponseInterceptor(res, "")) {
            this.page.totalItems = res.data.totalItems;
            // this.rows = res.data.items;
            if (Array.isArray(res.data?.items)) {
              this.listUsers = res.data?.items;
            }
            this.getListAction(this.listUsers);
            console.log({
              rows: res.data.items,
              totalItems: res.data.totalItems,
            });
          }
        },
        () => {}
      )
      .add(() => {
        this.isLoading = false;
      });
  }

  getListAction(data = []) {
    this.listAction = data.map((item) => {
      const status = item?.status;

      const actions = [];

      if (this.isGranted([this.PermissionCoreConst.CoreKHCN_Account_ResetPassword])) {
        actions.push({
          data: item,
          label: "Reset mật khẩu",
          icon: "pi pi-undo",
          command: ($event) => {
            this.resetPassword($event.item.data);
          },
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreKHCN_Account_ResetPin])) {
        actions.push({
          data: item,
          label: "Đặt lại mã PIN",
          icon: "pi pi-refresh",
          command: ($event) => {
            this.restPin($event.item.data);
          },
        })
      }

      if (this.isGranted([this.PermissionCoreConst.CoreKHCN_Account_Delete])) {
        actions.push({
          data: item,
          label: "Xóa tài khoản",
          icon: "pi pi-trash",
          command: ($event) => {
            this.delete($event.item.data);            
          },
        })
      }

      if (status !== UserConst.STATUS.DEACTIVE && this.isGranted([this.PermissionCoreConst.CoreKHCN_Account_ChangeStatus])) {
        actions.push({
          data: item,
          label: "Đóng tài khoản",
          icon: "pi pi-lock",
          command: ($event) => {
            this.changeStatusUser($event.item.data, UserConst.STATUS.DEACTIVE);
          },
        });
      }

      if (status === UserConst.STATUS.DEACTIVE && this.isGranted([this.PermissionCoreConst.CoreKHCN_Account_ChangeStatus])) {
        actions.push({
          data: item,
          label: "Mở tài khoản",
          icon: "pi pi-check",
          command: ($event) => {
            this.changeStatusUser($event.item.data, UserConst.STATUS.ACTIVE);
          },
        });
      }

      return actions;
    });
  }

  delete(user) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Xóa tài khoản",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn xóa tài khoản này không?",
					icon: FormNotificationConst.IMAGE_CLOSE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
        this._investorService.deleteInvestorAccount(user?.userId).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Xóa tài khoản thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }

  restPin(user) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Đặt lại mã PIN",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn đặt lại mã PIN khách hàng này không?",
					icon: FormNotificationConst.IMAGE_APPROVE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
    		const body = {
          userId: user?.userId,
        };
        this._investorService.resetPin(body).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Đặt lại mã PIN thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }

  /**
   * ĐỔI TRẠNG THÁI
   * @param user
   * @param status
   */
  changeStatusUser(user, status) {
    
    this._investorService
      .changeUserStatus({
        userId: user.userId,
        investorId:  this.investor.investorId,
        status,
      })
      .subscribe(
        (res) => {
          if (this.handleResponseInterceptor(res, "Thực hiện thành công!")) {
            this.setPage();
          }
        },
        (err) => {
          this.messageError("Có sự cố khi thực hiện thao tác");
        }
      );
  }

  /**
   * THAY ĐỔI MẬT KHẨU
   * @param user
   */
  resetPassword(user) {
    const ref = this._dialogService.open(
			FormNotificationComponent,
			{
				header: "Đặt lại mật khẩu",
				width: '600px',
				contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
				styleClass: 'p-dialog-custom',
				baseZIndex: 10000,
				data: {
					title : "Bạn có chắc chắn đặt lại mật khẩu tài khoản này không?",
					icon: FormNotificationConst.IMAGE_APPROVE,
				},
			}
		);
    ref.onClose.subscribe((dataCallBack) => {
    	console.log({ dataCallBack });
    	if (dataCallBack?.accept) {
    		const body = {
                userId: user.userId,
                investorId: this.investor.investorId,
              };
        this._investorService.resetPassword(body).subscribe((response) => {
          if (
            this.handleResponseInterceptor(
              response,
              "Đặt lại mật khẩu thành công"
            )
          ) {
            this.setPage();
          }
        });
    	}
    });
  }

  /**
   * TẠO TÀI KHOẢN
   */
  createUser() {
    const ref = this._dialogService.open(CreateUserComponent, {
      header: "Tạo mới tài khoản",
      width: "40%",
      styleClass: "p-dialog-custom filter-trading-provider customModal",
      height: "60%",
    });
    //
    ref.onClose.subscribe((dataCallBack) => {
      console.log({ dataCallBack });

      if (dataCallBack?.user) {
        const { user } = dataCallBack;

        const body = {
          investorId: this.investor.investorId,
          userName: user.userName,
          password: user.password,
        };

        this._investorService.createUser(body).subscribe(
          (res) => {
            if (
              this.handleResponseInterceptor(res, "Tạo tài khoản thành công")
            ) {
              this.setPage();
            }
          },
          (err) => {
            this.messageError(
              "Có sự cố khi tạo tài khoản. Vui lòng thực hiện lại sau ít phút."
            );
          }
        );
      }
    });
  }
}
