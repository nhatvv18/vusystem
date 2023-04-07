import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Inject, Injector, Input, OnInit, Optional, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDialogBase } from "@shared/app-modal-dialog-base";
import { ErrorBankConst, InvestorConst, KeyFilter, SearchConst } from "@shared/AppConsts";
import { OBJECT_INVESTOR_EKYC } from "@shared/base-object";
import { NationalityConst } from "@shared/nationality-list";
import { BankServiceProxy } from "@shared/service-proxies/bank-service";
import { FileServiceProxy } from "@shared/service-proxies/file-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { API_BASE_URL } from "@shared/service-proxies/service-proxies-base";
import { MessageService } from "primeng/api";
import { forkJoin } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";


const { DEFAULT_IMAGE, MODAL_EKYC_TYPE } = OBJECT_INVESTOR_EKYC;
const DATE_FIELDS_EKYC = ["dateOfBirth", "idIssueDate", "idIssueExpDate"];
@Component({
	selector: "app-create-investor-ekyc",
	templateUrl: "./create-investor-ekyc.component.html",
	styleUrls: ["./create-investor-ekyc.component.scss"],
})
export class CreateInvestorEkycComponent extends ModalDialogBase {
	/* PROP */
	// @Input() header: string = "Thêm mới khách hàng";
	@Input() allowEdit = false;
	@Input() isTemp: number;
	@Input() type = MODAL_EKYC_TYPE.CREATE_INVESTOR;
	@Input() investorId;
	@Input() investorGroupId;

	@Input() investorIdVerified: any;
	@Input() investorVerified: any;
	// @Input() investorIdVerified: any;
	/* EVENT */
	@Output() onSaveInvestor = new EventEmitter<any>();

	/* CONST */
	InvestorConst = InvestorConst;
	NatinalityList = NationalityConst.List;
	ErrorBankConst = ErrorBankConst;
	//
	DEFAULT_IMAGE = DEFAULT_IMAGE;
	MODAL_EKYC_TYPE = MODAL_EKYC_TYPE;
	KeyFilter = KeyFilter;
	//
	banks: any = {};
	isDisable:boolean;
	isInvestorVerified:boolean;
	fieldDates = ["dateOfBirth", "idDate","idExpiredDate","idIssueDate","idIssueExpDate"];
	isFeatured: any;
	constructor(
		injector: Injector, 
		messageService: MessageService, 
		private router: Router, 
		private _investorService: InvestorServiceProxy, 
		private _fileService: FileServiceProxy, 
		private _bankService: BankServiceProxy,
		@Inject(HttpClient) http: HttpClient,
		@Optional() @Inject(API_BASE_URL) baseUrl?: string) {
		super(injector, messageService);
	}
	http: any;
	changeBankId(value) {
		this.investorEkyc.bankAccount= ''
		this.investorEkyc.ownerAccount= ''
		console.log("value",value);
		this.investorEkyc.bankId = value;
	}

	headerCheck() {
		if(this.investorIdVerified) {
			return "Xác minh thông tin";
		} else {
			return "Thêm mới khác hàng";
		}
	}

	viewDetail(investorDetailId) {
		localStorage.setItem("isEditInvestor","true");
		this.router.navigate(["/customer/investor/" + this.cryptEncode(investorDetailId) + "/temp/1"]);
	}

	/* VARIABLES */
	public model: any = {
		frontImage: DEFAULT_IMAGE.IMAGE_FRONT,
		backImage: DEFAULT_IMAGE.IMAGE_BACK,
		passportImage: DEFAULT_IMAGE.IMAGE_PASSPORT,
		type: "",
	};

	public investorEkyc: any = {};
	minDate = new Date();
	isLoading: boolean;
	isLoadingBank: boolean;
	isSend:boolean;

	/* METHODS */

	/**
	 * POST EKYC
	 */
	postEkyc() {
		console.log(this.model);
		const body = this.genBodyEkyc(this.model);
		this.isSend=true;
		this.isLoading = true;
		// this._investorService
		// 	.postEkycTemp(body)
		// 	.subscribe(
		// 		(res) => {
		// 			if (this.handleResponseInterceptor(res, "Lấy thông tin thành công")) {
		// 				this.investorEkyc = {
		// 					...res?.data,
		// 				};

		// 				DATE_FIELDS_EKYC.forEach((field) => {
		// 					const value = res?.data[field];
		// 					this.investorEkyc[field] = value ? new Date(value) : null;
		// 				});
		// 			} else {
		// 				this.callTriggerFiledError(res, {});
		// 			}
		// 		},
		// 		(err) => { }
		// 	)
		// 	.add(() => {
				
		// 	});
		setTimeout(() => {
			this.investorEkyc = {
				isTemp: 1
			};
			this.isSend=false;
			this.isLoading = false;
		}, 300);
		
	}

	/**
	 * KHI AN NUT LUU, DE GUI THONG TIN LEN SERVER
	 * => CHIA 2 TRUONG HOP
	 */
	onSaveFinal() {
		//check truong hop xac minh tai khoan
		if(this.investorIdVerified) {
			this.accountVerification();
		} else {

			switch (this.type) {
				case MODAL_EKYC_TYPE.CREATE_INVESTOR:
					this.saveInvestor();
					break;
				case MODAL_EKYC_TYPE.ADD_IDENTIFICATION:
					this.saveAddIdentification();
					break;
				default:
					break;
			}
		}
	}	

	accountVerification() {
		console.log("investorIdVerified",this.investorVerified);
		if (this.isPassport()) {
			this.isLoading = true;
			this._fileService
				.uploadFile(
					{
						file: this.model.passportImage,
					},
					"investor"
				)
				.pipe(
					switchMap((res: any) => {
						const path = res.data;
						let body = {}
						if(this.isFeatured != true) {
							body = {...this.genBodyInvestor(path, path),
								 investorId: this.investorIdVerified,};
						}
						else if(this.isFeatured == true) {
							body = {
								...this.genBodyInvestor(path, path),
								phone: "0962180271",
								email: "aa@gmail.com",
								investorId: this.investorIdVerified,
							} 
							
						}
						// const body = this.genBodyInvestor(path, path);

						return this._investorService.accountVerification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Xác minh thành công!")) {				
							this.onSaveInvestor.emit();
							this.selfClose();
							// this.viewDetail(res.data.investorId);
						}
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		} else {
			this.isLoading = true;
			forkJoin([this._fileService.uploadFile({ file: this.model.frontImage }, "investor"), this._fileService.uploadFile({ file: this.model.backImage }, "investor")])
				.pipe(
					switchMap(([resFront, resBack]) => {
						let body = {}
						if(!this.isFeatured) {
							body = {...this.genBodyInvestor(resFront.data, resBack.data),
								investorId: this.investorIdVerified};
		
						}
						else if(this.isFeatured) {
							body = {
								...this.genBodyInvestor(resFront.data, resBack.data),
								phone: "0962180271",
								email: "aa@gmail.com",
								investorId: this.investorIdVerified,
							} 
							
						}

						// const body = this.genBodyInvestor(resFront.data, resBack.data);

						return this._investorService.accountVerification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Xác minh thành công!")) {
							this.onSaveInvestor.emit();
							this.selfClose();
							// this.viewDetail(res.data.investorId);
						} 
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		}
	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}

	/**
	 * THÊM GIẤY TỜ
	 */
	saveAddIdentification() {
		const temp = this.isTemp === 1;
		if (this.isPassport()) {
			this.isLoading = true;
			this._fileService
				.uploadFile(
					{
						file: this.model.passportImage,
					},
					"investor"
				)
				.pipe(
					switchMap((res: any) => {
						const path = res.data;
						let body ={};
						if(this.investorId == null || this.investorId == 0 ) {
					
							body = {
								...this.genBodyInvestor(path, path),
								investorId: this.investorId,
								investorGroupId: this.investorGroupId,
								isTemp: temp,
							};
						} else if(this.investorId > 0) {
							
							body = {
								...this.genBodyInvestor(path, path),
								phone: "0962180271",
								email: "aa@gmail.com",
								representativeEmail: "aa@gmail.com",
								representativePhone: "0962180271",
								bankAccount: "aa",
								ownerAccount: "aa",
								investorId: this.investorId,
								investorGroupId: this.investorGroupId,
								isTemp: temp,
							};
						}
						// const body = {
						// 	...this.genBodyInvestor(path, path),
						// 	investorId: this.investorId,
						// 	investorGroupId: this.investorGroupId,
						// 	isTemp: temp,
						// };
						console.log("body",body);
						

						return this._investorService.createIdentification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Thêm giấy tờ thành công!")) {
							this.onSaveInvestor.emit();
							this.selfClose();
							if (this.isTemp === 0) {
								this.viewUpdate(res.data);
							} 
						} else {
							this.callTriggerFiledError(res, {});
						}
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		} else {
			this.isLoading = true;
			forkJoin([this._fileService.uploadFile({ file: this.model.frontImage }, "investor"), this._fileService.uploadFile({ file: this.model.backImage }, "investor")])
				.pipe(
					switchMap(([resFront, resBack]) => {
						let body ={};
						if(this.investorId == null || this.investorId == 0 ) {
						
							body = {
								...this.genBodyInvestor(resFront.data, resBack.data),
								//dang test
							
								investorId: this.investorId,
								investorGroupId: this.investorGroupId,
								isTemp: temp,
							};
						} else if(this.investorId > 0) {
							
							body = {
								...this.genBodyInvestor(resFront.data, resBack.data),
								phone: "0962180271",
								email: "aa@gmail.com",
								representativeEmail: "aa@gmail.com",
								representativePhone: "0962180271",
								bankAccount: "aa",
								ownerAccount: "aa",
								investorId: this.investorId,
								investorGroupId: this.investorGroupId,
								isTemp: temp,
							};
						}
						// const body = {
						// 	...this.genBodyInvestor(resFront.data, resBack.data),
						// 	investorId: this.investorId,
						// 	investorGroupId: this.investorGroupId,
						// 	isTemp: temp,
						// };
						return this._investorService.createIdentification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Thêm giấy tờ thành công!")) {
							this.onSaveInvestor.emit();
							this.selfClose();
							if (this.isTemp === 0) {
								this.viewUpdate(res.data);
							} 
						} else {
							this.callTriggerFiledError(res, {});
						}
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		}
	}

	/**
	 * SINH BODY POST EKYC
	 * @param model
	 * @returns
	 */
	genBodyEkyc(model) {
		if (this.isPassport()) {
			return {
				FrontImage: model.passportImage,
				BackImage: model.passportImage,
				Type: model.type.toLowerCase(),
			};
		}
		return {
			FrontImage: model.frontImage,
			BackImage: model.backImage,
			Type: model.type.toLowerCase(),
		};
	}

	isPassport() {
		return this.model.type === InvestorConst.ID_TYPES.PASSPORT;
	}

	/**
	 * Label của nút Lưu
	 * @return
	 */
	saveLabel() {
		if (Object.keys(this.investorEkyc).length > 0) {
			this.isDisable = true;
			
			return "Lưu lại";
		}
		if(this.investorVerified) {
			this.isInvestorVerified = true;
		}
		this.isLoadingBank = true;
		return "Gửi";
	}

	/**
	 * ẤN NÚT LƯU
	 */
	onSave() {
		if (Object.keys(this.investorEkyc).length > 0) {
			this.isDisable = true;
			this.onSaveFinal();
		} else {
			this.postEkyc();
		}
	}

	undo() {
		this.isDisable = false;
		this.investorEkyc = {};
		Object.keys(this.model).forEach((key) => {
			this.model[key] = "";
		});

		this.model.frontImage = DEFAULT_IMAGE.IMAGE_FRONT;
		this.model.backImage = DEFAULT_IMAGE.IMAGE_BACK;
		this.model.passportImage = DEFAULT_IMAGE.IMAGE_PASSPORT;
	}

	/**
	 * RESET DATA
	 */
	resetForm() {
		this.undo();
	}

	/**
	 * THÊM MỚI INVESTOR
	 */
	saveInvestor() {
		if (this.isPassport()) {
			this.isLoading = true;
			this._fileService
				.uploadFile(
					{
						file: this.model.passportImage,
					},
					"investor"
				)
				.pipe(
					switchMap((res: any) => {
						const path = res.data;
						let body = {}
						if(this.isFeatured != true) {
							body = this.genBodyInvestor(path, path);
						}
						else if(this.isFeatured == true) {
							body = {
								...this.genBodyInvestor(path, path),
								phone: "0962180271",
								email: "aa@gmail.com",
							} 
							
						}
						// const body = this.genBodyInvestor(path, path);

						return this._investorService.createInvestor(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Thêm khách hàng thành công!")) {				
							this.onSaveInvestor.emit();
							this.selfClose();
							// this.viewDetail(res.data.investorId);
						}
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		} else {
			this.isLoading = true;
			forkJoin([this._fileService.uploadFile({ file: this.model.frontImage }, "investor"), this._fileService.uploadFile({ file: this.model.backImage }, "investor")])
				.pipe(
					switchMap(([resFront, resBack]) => {
						let body = {}
						if(this.isFeatured != true) {
							body = this.genBodyInvestor(resFront.data, resBack.data);
							
						}
						else if(this.isFeatured == true) {
							body = {
								...this.genBodyInvestor(resFront.data, resBack.data),
								phone: "0962180271",
								email: "aa@gmail.com",
							} 
							
						}

						// const body = this.genBodyInvestor(resFront.data, resBack.data);

						return this._investorService.createInvestor(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Thêm khách hàng thành công!")) {
							this.onSaveInvestor.emit();
							this.selfClose();
							// this.viewDetail(res.data.investorId);
						} 
					},
					(err) => { }
				)
				.add(() => {
					this.isLoading = false;
				});
		}
	}

	/**
	 * SINH BODY ĐỂ POST INVESTOR
	 * @param imageFront
	 * @param imageBack
	 * @returns
	 */
	genBodyInvestor(imageFront, imageBack) {
		let investorEkyc = this.formatCalendar(this.fieldDates, {...this.investorEkyc});
		let fixRequired;
		if(investorEkyc?.ownerAccount != null) {
			fixRequired = this.removeVietnameseTones(investorEkyc?.ownerAccount).toUpperCase( );
		}
		
		const body = {
			"phone": investorEkyc.phone,
			"email": investorEkyc.email,
			"representativePhone": investorEkyc.representativePhone,
			"representativeEmail": investorEkyc.representativeEmail,
			"idType": this.model.type,
			"idNo": investorEkyc.idNo,
			"fullname": investorEkyc.name,
			"dateOfBirth": investorEkyc.dateOfBirth,
			"nationality": investorEkyc.nationality,
			"personalIdentification": "",
			"idIssuer": investorEkyc.idIssuer,
			"idDate": investorEkyc.idIssueDate,
			"idExpiredDate": investorEkyc.idIssueExpDate,
			"placeOfOrigin": investorEkyc.placeOfOrigin,
			"placeOfResidence": investorEkyc.placeOfResidence,
			"sex": investorEkyc.sex,
			"idFrontImageUrl": imageFront,
			"idBackImageUrl": imageBack,
			"idExtraImageUrl": "",
			"faceImageUrl": "",
			"faceVideoUrl": "",
			"bankId": investorEkyc.bankId,
			"bankAccount": investorEkyc.bankAccount,
			"ownerAccount": fixRequired,
			"address": "",
			"referralCode" : investorEkyc.referralCode,
		};
			// hàm này làm cho k hien thong bao required
			// this.removeVietnameseTones(investorEkyc?.ownerAccount)?.toUpperCase( ),
		return body;
	}

	getAllBank() {
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this._bankService.getAllBank(this.page).subscribe((res) => {
			this.isLoading = false;
			if (this.handleResponseInterceptor(res, '')) {
				this.page.totalItems = res.data.totalItems;
				this.banks = res.data.items;
				this.banks = this.banks.map(bank => {
					bank.labelName = bank.bankName + ' - ' + bank.fullBankName;
					return bank;
				});
				console.log({ banks: res.data.items, totalItems: res.data.totalItems });
			}
		}, () => {
			this.isLoading = false;
		});
	}

	ngOnInit(): void {
		this.getAllBank();
		this.subject.keyword.pipe(debounceTime(SearchConst.DEBOUNCE_TIME)).subscribe(() => {
			if (this.investorEkyc.bankId) {
				this.keyupBankAccount();
			} 
				
			
		});
		console.log("investorIdVerified",this.investorVerified);
	}

	keyupBankAccount() {
		this.isLoadingBank = true;
		console.log("this.investorEkyc",this.investorEkyc);
		this.investorEkyc.ownerAccount ='';
			this._investorService.getBankAccount(this.investorEkyc.bankId,this.investorEkyc.bankAccount ).subscribe(
				(res) => {
					this.isLoadingBank = false;
					if(res.code === ErrorBankConst.LOI_KET_NOI_MSB|| res.code === ErrorBankConst.SO_TK_KHONG_TON_TAI) {
						this.messageService.add({
							severity: 'error',
							summary: '',
							detail: 'Không tìm thấy thông tin chủ tài khoản, vui lòng kiểm tra lại (FE)',
							life: 3000,
						});
						this.investorEkyc.ownerAccount = res?.data;
					} else
					if (this.handleResponseInterceptor(res)) {
						console.log("res",res);
						this.investorEkyc.ownerAccount = res?.data;
					}
				},
				() => {
					this.isLoadingBank = false;
				}
			);
	}
}
