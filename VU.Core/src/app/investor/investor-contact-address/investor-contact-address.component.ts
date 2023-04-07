import { Component, Injector, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { BusinessCustomerConst, FormNotificationConst, InvestorConst, SearchConst, YesNoConst } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import { Page } from "@shared/model/page";
import { ContractTemplateServiceProxy, DistributionContractFileServiceProxy } from "@shared/service-proxies/bond-manager-service";
import { InvestorServiceProxy } from "@shared/service-proxies/investor-service";
import { ProvinceServiceProxy } from "@shared/service-proxies/province-service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from "primeng/tristatecheckbox";
import { debounceTime } from "rxjs/operators";
import { FormNotificationComponent } from "src/app/form-notification/form-notification.component";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";

@Component({
  selector: 'app-investor-contact-address',
  templateUrl: './investor-contact-address.component.html',
  styleUrls: ['./investor-contact-address.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class InvestorContactAddressComponent extends CrudComponentBase {

  constructor(
		injector: Injector,
		messageService: MessageService,
		private confirmationService: ConfirmationService,
		private routeActive: ActivatedRoute,
		private router: Router,
		private _investorService: InvestorServiceProxy,
		private breadcrumbService: BreadcrumbService,
		private _provinceService: ProvinceServiceProxy,
		private _dialogService: DialogService,
	) {
		super(injector, messageService);
		this.investorId = +this.cryptDecode(this.routeActive.snapshot.paramMap.get('id'));
		this.isTemp = +this.routeActive.snapshot.paramMap.get("isTemp");
	}

	investorId: number;
	@Input() investorDetail: any = {};
	ref: DynamicDialogRef;

	modalDialog: boolean;
	deleteItemDialog: boolean = false;

	confirmRequestDialog: boolean = false;
	rows: any[] = [];
	list: any = {};

	InvestorConst = InvestorConst;
	YesNoConst = YesNoConst;
	isTemp = InvestorConst.TEMP.YES;

	fieldErrors = {};
	submitted: boolean;

	isDetail = false;
	actionsDisplay: any[] = [];
	actions: any[] = [];

	page = new Page();
	offset = 0;

	provinces: any = {};
	districts: any = {};
	wards: any = {};
	provinceCode: string;
	districtCode: string;

	detailTemp: string = '';
	provinceTemp: string = '';
	districtTemp: string = '';
	wardTemp: string = '';

	testDetailValue = document.getElementById("detailAddress") as HTMLInputElement;


	investorContactAddress: any = {
		"detailAddress" : null,

	}
	

	ngOnInit(): void {
		this.setPage();
		this.getAllProvince();
	}

	setAddress() {
		
		if (this.detailTemp != '' && this.provinceTemp != ''){
			this.investorContactAddress.contactAddress = this.detailTemp + ' -' + ' '+ this.wardTemp + ' ' + this.districtTemp + ' ' + this.provinceTemp  ;
		} else{
			this.investorContactAddress.contactAddress = this.detailTemp + ' '+ this.wardTemp + ' ' + this.districtTemp + ' ' + this.provinceTemp  ;
		}
	}

	setDetailAddress(){
		this.detailTemp = this.investorContactAddress.detailAddress;

		this.setAddress();
	}

	selectProvinces(provinceCode) {
		console.log("provinceId",provinceCode);
		const province = this.provinces.find(item => item.code == provinceCode);
		this.provinceTemp =province.fullName;
		this.districtTemp= "";
		this.wardTemp= "";
		this.setAddress();
		this.getAllDistrict(provinceCode);
	}

	selectDisTricts(districtCode) {
		const district  = this.districts.find(item => item.code == districtCode);
		this.districtTemp = district.fullName + ' -';
		this.wardTemp = "";
		this.setAddress();
		console.log({ districts: this.investorContactAddress.detailAddress });
		this.getAllWard(districtCode);
	}

	selectWards (wardCode) {
		const ward = this.wards.find(item => item.code == wardCode);
		this.wardTemp = ward.fullName + ' -';
		this.setAddress();
		console.log({ wards: this.investorContactAddress.detailAddress });
	}

	getAllProvince() {
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this._provinceService.getAllProvince(this.page).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.provinces = res.data;
					console.log({ provinces: res.data, totalItems: res.data.totalItems });
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	getAllDistrict(code?: string) {
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this.provinceCode = code;
		console.log("provinceCodeGet",this.provinceCode);
		
		this._provinceService.getAllDistrict(this.page, this.provinceCode).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					if(this.provinceCode == null) {
						this.districts = null;
					} else if(this.provinceCode != null) {
						this.districts = res.data;
					}
					
					console.log({ districts: res.data, totalItems: res.data.totalItems });
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	getAllWard(codeDistrict?: string) {
		this.page.keyword = this.keyword;
		this.isLoading = true;
		this.districtCode = codeDistrict;
		console.log("this.districtCode",this.districtCode);
		
		this._provinceService.getAllWard(this.page, this.districtCode).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.wards = res.data;
					console.log({ wards: res.data, totalItems: res.data.totalItems });
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	genListAction(data = []) {
		this.actions = data.map((item) => {
			const action = [
				// {
				// 	data: item,
				// 	label: "Sửa",
				// 	icon: "pi pi-pencil",
				// 	statusActive: [1, 2, 3, 4],
				// 	permission: this.isGranted([]),
				// 	command: ($event) => {
				// 		this.edit($event.item.data);
				// 	},
				// },
			];

			if (item.isDefault !== this.YesNoConst.YES && ((this.isGranted([this.PermissionCoreConst.CoreDuyetKHCN_DiaChi_SetDefault]) && this.isTemp == InvestorConst.TEMP.YES) || (this.isGranted([this.PermissionCoreConst.CoreKHCN_DiaChi_SetDefault]) && this.isTemp == InvestorConst.TEMP.NO))) {
				action.push({
					data: item,
					label: "Chọn mặc định",
					icon: "pi pi-check",
					statusActive: [1, 2, 3, 4],
					permission: this.isGranted([]),
					command: ($event) => {
						this.setDefaultContactAddress($event.item.data);
					},
				});
			}
			return action;
		});
	}

	setPage(pageInfo?: any) {
		this.page.pageNumber = pageInfo?.page ?? this.offset;
		this.page.keyword = this.keyword;
		this.isLoading = true;

		this._investorService.getAllContactAddress(this.page, this.isTemp, this.investorId).subscribe(
			(res) => {
				this.isLoading = false;
				if (this.handleResponseInterceptor(res, "")) {
					this.page.totalItems = res.data.totalItems;
					this.rows = res.data.items;
					this.genListAction(this.rows);
					setTimeout(() => {
					}, 2000);
				}
			},
			() => {
				this.isLoading = false;
			}
		);
	}

	clickDropdown(row) {
		this.investorContactAddress = { ...row };
		console.log({ investorContactAddress: row });
		this.actionsDisplay = this.actions.filter((action) => action.statusActive.includes(+row.status) && action.permission);
	}

	setFieldError() {
		for (const [key, value] of Object.entries(this.investorContactAddress)) {
			this.fieldErrors[key] = false;
		}
		console.log({ filedError: this.fieldErrors });
	}

	header(): string {
		return !this.investorContactAddress?.investorId ? "Thêm địa chỉ liên hệ" : "Sửa địa chỉ liên hệ";
	}

	createContactAddress() {
		console.log("this.investorContactAddress create",this.investorContactAddress);
		
		this.isDetail = false;
		this.investorContactAddress = {};
		this.submitted = false;
		this.modalDialog = true;
		this.districts = null;
		this.wards = null;
		this.investorContactAddress.detailAddress = "";
		this.investorContactAddress.contactAddress = "";
		this.detailTemp = "";
		this.investorContactAddress.provinceCode = "";
	}

	edit(row) {
		this.investorContactAddress = {
			...row,
		};
		console.log({ investorContactAddress: this.investorContactAddress });
		this.modalDialog = true;
	}

	// setDefaultContactAddress(row) {
	// 	console.log("body",this.investorId, row);
		
	// 	this.confirmationService.confirm({
	// 		message: "Bạn muốn chọn địa chỉ liên hệ này thành mặc định?",
	// 		header: "Thiết lập địa chỉ liên hệ mặc định",
	// 		acceptLabel: "Đồng ý",
	// 		rejectLabel: "Hủy",
	// 		icon: "pi pi-question-circle",
	// 		accept: () => {
	// 			const body = {
	// 				investorId: this.investorId,
	// 				isTemp: this.isTemp == 1 ? true : false,
	// 				contactAddressId: row?.contactAddressId,
	// 			};
	// 			this._investorService.setDefaultContactAddress(body).subscribe((res) => {
	// 				this.handleResponseInterceptor(res, "Set thành công");
	// 				this.setPage();
	// 			});
	// 		},
	// 		reject: () => {},
	// 	});
	// }

	setDefaultContactAddress(row) {
		const ref = this._dialogService.open(
				FormNotificationComponent,
				{
					header: "Thông báo",
					width: '600px',
					contentStyle: { "max-height": "600px", "overflow": "auto", "padding-bottom": "50px" },
					styleClass: 'p-dialog-custom',
					baseZIndex: 10000,
					data: {
						title : "Bạn muốn chọn địa chỉ liên hệ này thành mặc định?",
						icon: FormNotificationConst.IMAGE_APPROVE,
					},
				}
			);
		ref.onClose.subscribe((dataCallBack) => {
			console.log({ dataCallBack });
			const body = {
				investorId: this.investorId,
				isTemp: this.isTemp == InvestorConst.TEMP.YES ? true : false,
				contactAddressId: row?.contactAddressId,
			};
			if (dataCallBack?.accept) {
			this._investorService.setDefaultContactAddress(body).subscribe((response) => {
			  if (
				this.handleResponseInterceptor(
				  response,
				  "Chọn địa chỉ liên hệ này thành mặc định thành công"
				)
			  ) {
				this.setPage();
			  }
			});
			}
		});
	  }

	detail() {
		this.isDetail = true;
		this.investorContactAddress = {
			...this.investorContactAddress,
		};

		console.log({ investorContactAddress: this.investorContactAddress });
		this.modalDialog = true;
	}

	// confirmDelete() {
	//   this.deleteItemDialog = false;
	//   this._investorService.delete(this.investorContactAddress.investorContactAddressId).subscribe(
	//     (response) => {
	//       if (this.handleResponseInterceptor(response, 'Xóa thành công')) {
	//         this.setPage({ page: this.page.pageNumber });
	//         this.investorContactAddress = {};
	//       }
	//     }, () => {
	//       this.messageService.add({
	//         severity: 'error',
	//         summary: '',
	//         detail: `Không xóa được hợp đồng phân phối!`,
	//         life: 3000,
	//       });
	//     }
	//   );
	// }

	// delete(row) {
	//   this.confirmationService.confirm({
	//     message: 'Bạn có chắc chắn xóa tài khoản ngân hàng này?',
	//     header: 'Xóa thanh toán',
	//     icon: 'pi pi-exclamation-triangle',
	//     accept: () => {
	//       this._investorService.delete(row.investorContactAddressId).subscribe((response) => {
	//         if (this.handleResponseInterceptor(response, "")) {
	//           this.messageService.add({ severity: 'success', summary: '', detail: 'Xóa thành công', life: 1500 });
	//           this.setPage();
	//         }
	//       });
	//     },
	//     reject: () => {

	//     },
	//   });
	// }

	changeKeyword() {
		if (this.keyword === "") {
			this.setPage({ page: this.offset });
		}
	}

	hideDialog() {
		this.modalDialog = false;
		this.submitted = false;
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}

	viewUpdate(idTemp) {
		this.router.navigate(["/customer/investor/" + this.cryptEncode(idTemp) + "/temp/1"]).then(() => {
			window.location.reload();
		});
	}


	save() {
		this.submitted = true;

		console.log({ investorContactAddress: this.investorContactAddress });
		console.log(this.investorContactAddress.contactAddressId);

		if (this.investorContactAddress.contactAddressId) {
			this._investorService.updateContactAddress(this.investorContactAddress).subscribe(
				(response) => {
					this.callTriggerFiledError(response, this.fieldErrors);
					if (this.handleResponseInterceptor(response, "Cập nhật thành công")) {
						this.submitted = false;
						this.setPage({ page: this.page.pageNumber });
						this.hideDialog();
					} else {
						this.callTriggerFiledError(response, this.fieldErrors);
						this.submitted = false;
					}
				},
				() => {
					this.submitted = false;
				}
			);
		} else {
			const body = {
				...this.investorContactAddress,
				investorId: this.investorDetail.investorId,
				investorGroupId: this.investorDetail.investorGroupId,
				isTemp: this.isTemp == InvestorConst.TEMP.YES,
			};

			this._investorService.createContactAddress(body).subscribe(
				(response) => {
					if (this.handleResponseInterceptor(response, "Thêm thành công")) {
						this.submitted = false;
						
						this.hideDialog();
						if (this.isTemp === 0) {
							this.viewUpdate(response.data);
						} else {
							this.setPage();
						}
						
					} else {
						this.callTriggerFiledError(response, this.fieldErrors);
						this.submitted = false;
					}
				},
				() => {
					this.submitted = false;
				}
			);
		}
	}

	validForm(): boolean {
		const validRequired = this.investorContactAddress?.contactAddress?.trim() && this.investorContactAddress?.provinceCode 
							&& this.investorContactAddress.detailAddress?.trim() && this.investorContactAddress.districtCode
							&& this.investorContactAddress.wardCode;

		return validRequired;
	}

}
