import { Component, Injector, Input, OnInit } from "@angular/core";
import { ModalDialogBase } from "@shared/app-modal-dialog-base";
import { OBJECT_INVESTOR_EKYC } from "@shared/base-object";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

const { DEFAULT_IMAGE } = OBJECT_INVESTOR_EKYC;
@Component({
	selector: "app-approve-trading-provider",
	templateUrl: "./approve-trading-provider.component.html",
	styleUrls: ["./approve-trading-provider.component.scss"],
})
export class ApproveTradingProviderComponent extends ModalDialogBase {
	constructor(
		injector: Injector,
		messageService: MessageService,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private _investorService: InvestorServiceProxy
	) {
		super(injector, messageService);
	}

	ekycMatch: any = {
		faceImage: DEFAULT_IMAGE.IMAGE_FRONT,
		idCardImage: "",
	};

	model = {
		isVerifiedIdentification: "N",
		identificationId: 0,
		investorGroupId: 0,
		notice: "",
	};

	ngOnInit(): void {
		const { isVerifiedIdentification, idFrontImageUrl, id } = this.config.data.defaultIdentification;

		this.model = {
			...this.model,
			identificationId: id,
			investorGroupId: this.config.data.investorGroupId,
			isVerifiedIdentification,
		};

		// this.imageToBlob(`${this._investorService.getBaseApiUrl()}/${idFrontImageUrl}`);
		this.ekycMatch.idCardImage = `${this._investorService.getBaseApiUrl()}/${idFrontImageUrl}`;
	}

	srcToFile(src, fileName = "idCard.jpg") {
		return fetch(src)
			.then(function (res) {
				return res.arrayBuffer();
			})
			.then(function (buf) {
				return new File([buf], fileName, { type: "image/jpeg" });
			});
	}

	/**
	 * DLSC DUYỆT KHÁCH HÀNG
	 */
	async approve() {
		console.log(this.ekycMatch);
		const url_ = `${this._investorService.getBaseApiUrl()}/${this.config.data.defaultIdentification.idFrontImageUrl}`;
		const idCardImage = await this.srcToFile(url_);

		const body = {
			...this.model,
			isVerifiedIdentification: this.model.isVerifiedIdentification ? "Y" : "N",
			idCardImage,
			faceImage: this.ekycMatch.faceImage,
		};

		this.isLoading = true;
		this._investorService.approve(body).subscribe(
			(res) => {
				if (this.handleResponseInterceptor(res, "Duyệt khách hàng thành công")) {
					this.ref.close();
				}
			},
			() => {
				this.messageService.add({
					severity: "error",
					summary: "",
					detail: "Có sự cố xảy ra khi duyệt. Vui lòng thử lại sau.",
					life: 3000,
				});
			}
		).add(() => {
			this.isLoading = false;
		});
	}
}
