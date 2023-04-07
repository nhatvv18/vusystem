
import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { ActiveDeactiveConst, AppConsts, FormNotificationConst, InvestorConst, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { debounceTime } from "rxjs/operators";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";
import { OBJECT_INVESTOR_EKYC } from "@shared/base-object";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { ReplaceIdentificationComponent } from "./replace-identification/replace-identification.component";
const { MODAL_EKYC_TYPE, DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;
@Component({
	selector: 'app-investor-file',
	templateUrl: './investor-file.component.html',
	styleUrls: ['./investor-file.component.scss']
})

export class InvestorFileComponent extends CrudComponentBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		private confirmationService: ConfirmationService,
		private routeActive: ActivatedRoute,
		private router: Router,
		private _investorService: InvestorServiceProxy,
		private breadcrumbService: BreadcrumbService,
		private _bankService: BankServiceProxy,
		private _dialogService: DialogService,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
	}
	MODAL_EKYC_TYPE = MODAL_EKYC_TYPE;
	investorId: number;
	@Input() investorFile: any = {};
	ref: DynamicDialogRef;
	faceImage: any = DEFAULT_IMAGE.IMAGE_AVATAR;
	modalDialog: boolean;
	deleteItemDialog: boolean = false;
	modalDialogEkyc: boolean = false;

	confirmRequestDialog: boolean = false;
	rows: any[] = [
	];
	rowsIdentifi: any[] = [
	];
	list: any = {};

	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
	ActiveDeactiveConst = ActiveDeactiveConst;
	isTemp = InvestorConst.TEMP.YES;

	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];

	page = new Page();
	offset = 0;
	isToastIdentifi: boolean = true;
	investor: any = {
		investorId: 0,
		investorGroupId: 0,
		notice: "",
	};

	fieldDateInit = {
		identification: ["idDate", "idExpiredDate"],
		investor: ["birthDate"],
	};

	ngOnInit(): void {
		this.setPage();

	}



	replaceIdentification(identification) {
		console.log("identification___", identification);
		const ref = this._dialogService.open(ReplaceIdentificationComponent, {
			header: "Cập nhật giấy tờ hiện có",
			width: '800px',
			height: '90%',
			contentStyle: { overflow: "auto", "margin-bottom": "60px", },
			baseZIndex: 10000,
			data: {
				listIdentification: identification,

			},
		});
		//
		ref.onClose.subscribe((res) => {
			if(res) {
				this.setPage();
			}
			
		});

	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}

	setPage() {
		this.isLoading = true;
		this._investorService.getInvestor(this.investorId, this.isTemp).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, "")) {
				if (res.data.defaultIdentification && Object.keys(res.data.defaultIdentification).length > 0) {
					this.fieldDateInit.identification.forEach((key) => {
						const value = res.data.defaultIdentification[key];
						if (value) {
							res.data.defaultIdentification[key] = new Date(value);
						}
					});
					//
					if (res?.data?.defaultIdentification?.fullname && !res.data.name) {
						res.data.name = res.data.defaultIdentification.fullname;
					}

				}

				this.investor = res.data;
				this.rows.push({
					'title': "Ảnh khuôn mặt",
					'url': this.investor.faceImageUrl ? `${AppConsts.remoteServiceBaseUrl}/${this.investor.faceImageUrl}` : this.faceImage,
					'rate': this.investor.faceImageSimilarity ? `Tin cậy: ${this.investor.faceImageSimilarity}%` : `Độ tin cậy`,
					'rateCheck': this.investor.faceImageSimilarity,
				});
				this.rows.push({
					'title': "Ảnh nháy mắt",
					'url': this.investor.faceImageUrl1 ? `${AppConsts.remoteServiceBaseUrl}/${this.investor.faceImageUrl1}` : this.faceImage,
					'rate': this.investor.faceImageSimilarity1 ? `Tin cậy: ${this.investor.faceImageSimilarity1}%` : `Độ tin cậy`,
					'rateCheck': this.investor.faceImageSimilarity1,
				});
				this.rows.push({
					'title': "Ảnh quay sang trái",
					'url': this.investor.faceImageUrl2 ? `${AppConsts.remoteServiceBaseUrl}/${this.investor.faceImageUrl2}` : this.faceImage,
					'rate': this.investor.faceImageSimilarity2 ? `Tin cậy: ${this.investor.faceImageSimilarity2}%` : `Độ tin cậy`,
					'rateCheck': this.investor.faceImageSimilarity2,
				});
				this.rows.push({
					'title': "Ảnh quay sang phải",
					'url': this.investor.faceImageUrl3 ? `${AppConsts.remoteServiceBaseUrl}/${this.investor.faceImageUrl3}` : this.faceImage,
					'rate': this.investor.faceImageSimilarity3 ? `Tin cậy: ${this.investor.faceImageSimilarity3}%` : `Độ tin cậy`,
					'rateCheck': this.investor.faceImageSimilarity3,
				});



				this.genListAction(this.investor.listIdentification);

			}
		})
			.add(() => {
				this.isLoading = false;
			});
	}

	genListAction(data = []) {
		this.actions = data.map((item) => {
			console.log("item___", item);

			const action = [];
			if (item.isDefault !== this.YesNoConst.YES && ((this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_GiayTo_SetDefault]) && this.isTemp == InvestorConst.TEMP.YES)
				|| (this.isGranted([this.PermissionCoreConst.CoreKHCN_GiayTo_SetDefault]) && this.isTemp == InvestorConst.TEMP.NO))) {
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
		console.log("actions", this.actions);
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
					title: "Bạn muốn chọn giấy tờ này thành mặc định?",
					icon: FormNotificationConst.IMAGE_APPROVE,
				},
			}
		);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				isTemp: this.isTemp == 1 ? true : false,
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
						this.setPage();
					}
				});
			}
		});
	}


	hideDialog() {
		this.modalDialog = false;
		this.submitted = false;
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}

	openModalAddIdentification() {
		this.modalDialogEkyc = true;
	}

	/* THEM IDENTIFICATION THANH CONG */
	onSaveIdentification() {
		this.setPage();
	}

}
