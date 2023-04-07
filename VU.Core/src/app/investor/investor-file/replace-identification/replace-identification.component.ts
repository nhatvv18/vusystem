import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestorConst, KeyFilter, ReplaceIdentificationConst } from '@shared/AppConsts';
import { OBJECT_INVESTOR_EKYC } from '@shared/base-object';
import { CrudComponentBase } from '@shared/crud-component-base';
import { NationalityConst } from '@shared/nationality-list';
import { FileServiceProxy } from '@shared/service-proxies/file-service';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { AppUtilsService } from '@shared/services/utils.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
const { DEFAULT_IMAGE, MODAL_EKYC_TYPE } = OBJECT_INVESTOR_EKYC;
const DATE_FIELDS_EKYC = ["dateOfBirth", "idIssueDate", "idIssueExpDate"];

  @Component({
    selector: 'app-replace-identification',
    templateUrl: './replace-identification.component.html',
    styleUrls: ['./replace-identification.component.scss']
  })
  export class ReplaceIdentificationComponent extends CrudComponentBase {
  
    constructor(
      injector: Injector,
      messageService: MessageService,
      public ref: DynamicDialogRef,
      public configDialog: DynamicDialogConfig,
      private _utilsService: AppUtilsService,
      private _investorService: InvestorServiceProxy, 
      private routeActive: ActivatedRoute,
      private _fileService: FileServiceProxy,
    ) { 
      super(injector, messageService);
      this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
      this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
    }
    isTemp: any;
    investorId: any;
    fieldErrors: any = {};
    isSend:boolean;
      row: any;
      col: any;
      ReplaceIdentificationConst = ReplaceIdentificationConst;
      InvestorConst = InvestorConst;
      NatinalityList = NationalityConst.List;
      KeyFilter = KeyFilter;
      replaceIdentification: any = {
      }
      isInvestorVerified:boolean;
      listIdentification: any;
      investorGroupId: any;
      isLoadingBank: boolean;
      blockText: RegExp = /[0-9,.]/;
      submitted: boolean;
      cols: any[];
      statuses: any[];
      public investorEkyc: any = {};
      isDisable:boolean;
      public model: any = {
        frontImage: DEFAULT_IMAGE.IMAGE_FRONT,
        backImage: DEFAULT_IMAGE.IMAGE_BACK,
        passportImage: DEFAULT_IMAGE.IMAGE_PASSPORT,
        type: "",
      };
      fieldDates = ["dateOfBirth", "idDate","idExpiredDate","idIssueDate","idIssueExpDate"];
      isToastIdentifi: boolean = true;

    ngOnInit(): void {
      if( this.configDialog?.data?.listIdentification) {
        this.listIdentification = this.configDialog?.data?.listIdentification?.listIdentification;
        this.investorGroupId = this.configDialog?.data?.listIdentification?.investorGroupId;
        this.listIdentification = this.listIdentification.map(listIdentification => {
					listIdentification.labelName = listIdentification.idType + ' - ' + listIdentification.idNo + ' - ' + listIdentification.fullname ;
					return listIdentification;
				});
      }
      console.log("listIdentification", this.listIdentification);
    }

    fixFloatToast() {
      this.isToastIdentifi = false;
      setTimeout(() => {
        this.isToastIdentifi = true;
      }, 0);
    }

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
        "securityCompany": 0,
        "stockTradingAccount": "",
        "investorId": 0,
        "investorGroupId": 0,
        "isTemp": true,
        "identificationId": this.replaceIdentification.identificationId
      };

      return body;
    }

    onSaveFinal() {
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
                identificationId:  this.replaceIdentification.identificationId,
							};

            this.fixFloatToast();
						return this._investorService.replaceIdentification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Cập nhật thành công!")) {
              this.close(true)
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
                identificationId:  this.replaceIdentification.identificationId,
							};
						}
            this.fixFloatToast();
						return this._investorService.replaceIdentification(body);
					})
				)
				.subscribe(
					(res) => {
						if (this.handleResponseInterceptor(res, "Cập nhật thành công!")) {
              this.close(true)
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

    postEkyc() {
      console.log(this.model);
      const body = this.genBodyEkyc(this.model);
      this.isSend=true;
      this.isLoading = true;
      this._investorService
        .postEkyc(body)
        .subscribe(
          (res) => {
            if (this.handleResponseInterceptor(res, "Lấy thông tin thành công")) {
              this.investorEkyc = {
                ...res?.data,
              };
  
              DATE_FIELDS_EKYC.forEach((field) => {
                const value = res?.data[field];
                this.investorEkyc[field] = value ? new Date(value) : null;
              });
            } else {
              this.callTriggerFiledError(res, {});
            }
          },
          (err) => { }
        )
        .add(() => {
          this.isSend=false;
          this.isLoading = false;
        });
    }

    onSave() {
      if (Object.keys(this.investorEkyc).length > 0) {
        this.isDisable = true;
        this.onSaveFinal();
      } else {
        this.postEkyc();
      }
    }

    saveLabel() {
      if (Object.keys(this.investorEkyc).length > 0) {
        this.isDisable = true;
        
        return "Lưu lại";
      }
      return "Gửi";
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

    isPassport() {
      return this.model.type === InvestorConst.ID_TYPES.PASSPORT;
    }
  
  
   
  
    close(statusResponse?: boolean) {
      this.ref.close(statusResponse);
    }
  
  
    validForm(): boolean {
      const validRequired = this.replaceIdentification?.name;
                            
      return validRequired;
    }
  
    resetValid(field) {
      this.fieldErrors[field] = false;
    }
  
  }
  
  