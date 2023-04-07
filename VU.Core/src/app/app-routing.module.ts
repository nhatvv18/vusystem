import { DepartmentComponent } from './department/department.component';
import { LoginUrlComponent } from './login-url/login-url.component';
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./layout/main/app.main.component";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";

import { BusinessCustomerApproveComponent } from "./business-customer/business-customer-approve/business-customer-approve.component";
import { BusinessCustomerApproveDetailComponent } from "./business-customer/business-customer-approve/business-customer-approve-detail/business-customer-approve-detail.component";
import { BusinessCustomerComponent } from "./business-customer/business-customer/business-customer.component";
import { BusinessCustomerDetailComponent } from "./business-customer/business-customer/business-customer-detail/business-customer-detail.component";
import { PartnerComponent } from "./partner-manager/partner/partner.component";
import { PartnerDetailComponent } from "./partner-manager/partner/partner-detail/partner-detail.component";
import { InvestorComponent } from "./investor/investor.component";
import { BroadcastNewsComponent } from "./broadcast/news/broadcast-news.component";
import { MediaComponent } from "./broadcast/media/media.component";

import { InvestorDetailComponent } from "./investor/investor-detail/investor-detail.component";
import { ApproveComponent } from "./approve-manager/approve/approve.component";
import { InvestorApproveComponent } from "./investor-approve/investor-approve.component";
import { NotificationTemplateComponent } from "./notification/notification-template/notification-template.component";
import { NotificationManagerComponent } from "./notification/notification-manager/notification-manager.component";
import { InvestorListAccountComponent } from "./investor-list-account/investor-list-account.component";
import { NotificationDetailComponent } from "./notification/notification-detail/notification-detail.component";
import { KnowledgeBaseComponent } from "./broadcast/knowledge-base/knowledge-base.component";
import { SystemTemplateComponent } from './notification/system-template/system-template.component';
import { ChatComponent } from './support/chat/chat.component';
import { RocketChatPageComponent } from './rocket-chat/rocket-chat-page/rocket-chat-page.component';
import { SaleTemporaryComponent } from './sale/sale-temporary/sale-temporary.component';
import { SaleTemporaryDetailComponent } from './sale/sale-temporary/sale-temporary-detail/sale-temporary-detail.component';
import { SaleActiveComponent } from './sale/sale-active/sale-active.component';
import { SaleActiveDetailComponent } from './sale/sale-active/sale-active-detail/sale-active-detail.component';
import { CollabContractTemplateComponent } from './sale/collab-contract-template/collab-contract-template.component';
import { CollabContractComponent } from './sale/sale-active/sale-active-detail/collab-contract/collab-contract.component';	
import { SaleRegisterComponent } from './sale/sale-register/sale-register.component';
import { DefaultSystemTemplateComponent } from './notification/default-system-template/system-template.component';
import { PermissionCoreConst } from '@shared/AppConsts';
import { ProviderConfigurationComponent } from './notification/provider-configuration/provider-configuration.component';
import { PaymentManagerComponent } from './payment-manager/payment-manager.component';
import { DigitalSignComponent } from './notification/digital-sign/digital-sign.component';
import { ManagementReportComponent } from './export-report/management-report/management-report.component';
import { OperationalReportComponent } from './export-report/operational-report/operational-report.component';
import { BusinessReportComponent } from './export-report/business-report/business-report.component';
import { ApproveEmailPhoneComponent } from './approve-manager/approve-email-phone/approve-email-phone.component';
import { WhileListIpComponent } from './notification/while-list-ip/while-list-ip.component';
import { SystemReportComponent } from './export-report/system-report/system-report.component';
import { MsbPrefixAccountComponent } from './notification/msb-prefix-account/msb-prefix-account.component';
import { UserAccountComponent } from './app-account/user-account/user-account.component';
import { NotVerifiedComponent } from './app-account/not-verified/not-verified.component';
import { TradingProviderComponent } from './partner-manager/trading-provider/trading-provider.component';
import { TradingProviderDetailComponent } from './partner-manager/trading-provider/trading-provider-detail/trading-provider-detail.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: AppMainComponent,
				children: [
					{ path: "login/url/:accessToken/:refreshToken", component: LoginUrlComponent},
					{ path: "home", component: HomeComponent, canActivate: [AppRouteGuard] },
					{ path: "rocketchat", component: RocketChatPageComponent },
					{ path: "user", component: UserComponent, canActivate: [AppRouteGuard] },
					{ path: "investor-account", component: InvestorListAccountComponent, data: {permissions: [PermissionCoreConst.CorePageInvestorAccount]}, canActivate: [AppRouteGuard] },
					{
						path: "app-account",
						children: [
							{
								path: "user-account",
								component: InvestorListAccountComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "not-verified",
								component: NotVerifiedComponent,
								canActivate: [AppRouteGuard],
							},
						],
					},
					{
						path: 'customer',
						children: [
							{ path: 'investor', component: InvestorComponent, data: {permissions: [PermissionCoreConst.CoreMenuKHCN]}, canActivate: [AppRouteGuard] },
							{ path: 'investor/approve', component: InvestorApproveComponent, data: {permissions: [PermissionCoreConst.CoreMenuDuyetKHCN]}, canActivate: [AppRouteGuard] },
							{
								path: 'investor/:id/temp/:isTemp',
								data: {permissions: [PermissionCoreConst.CoreDuyetKHCN_ThongTinKhachHang, PermissionCoreConst.CoreKHCN_ThongTinKhachHang]},
								component: InvestorDetailComponent,
								canActivate: [AppRouteGuard], 
							},
							{
								path: 'investor/:id/temp/:isTemp/:isApprove',
								data: {permissions: [PermissionCoreConst.CoreQLPD_KHCN_ThongTinChiTiet]},
								component: InvestorDetailComponent,
								canActivate: [AppRouteGuard], 
							},
							{
								path: "business-customer/business-customer-approve", component: BusinessCustomerApproveComponent, data: {permissions: [PermissionCoreConst.CoreMenuDuyetKHDN]}, canActivate: [AppRouteGuard],
							},
							{ 
								path: 'business-customer/business-customer-approve/detail/:id', component: BusinessCustomerApproveDetailComponent, data: {permissions: [PermissionCoreConst.CoreDuyetKHDN_ThongTinKhachHang]}, canActivate: [AppRouteGuard] 
							},

							{ 
								path: 'business-customer/business-customer-approve/detail/:id/:isApprove', 
								data: {permissions: [PermissionCoreConst.CoreDuyetKHDN_ThongTinKhachHang]}, 
								component: BusinessCustomerApproveDetailComponent, 
								canActivate: [AppRouteGuard] 
							},

							{
								path: 'business-customer/business-customer', component: BusinessCustomerComponent, data: {permissions: [PermissionCoreConst.CoreMenuKHDN]}, canActivate: [AppRouteGuard], 
							},
							{
								path: 'business-customer/business-customer/detail/:id', component: BusinessCustomerDetailComponent, data: {permissions: [PermissionCoreConst.CoreKHDN_ThongTinKhachHang]}, canActivate: [AppRouteGuard], 
							},

						],
					},
					{
						path: "partner-manager",
						children: [
							{ 
								path: 'partner',
								data: {permissions: [PermissionCoreConst.CoreMenu_DoiTac]}, 
								component: PartnerComponent, 
								canActivate: [AppRouteGuard] 
							},
							{
								path: "partner/detail/:id",
								data: {permissions: [PermissionCoreConst.CoreDoiTac_ThongTinChiTiet]}, 
								component: PartnerDetailComponent,
								canActivate: [AppRouteGuard],
							},
							{ 
								path: 'trading-provider',
								data: {permissions: [PermissionCoreConst.CoreMenu_DaiLy]}, 
								component: TradingProviderComponent, 
								canActivate: [AppRouteGuard] 
							},
							{
								path: "trading-provider/detail/:id",
								data: {permissions: [PermissionCoreConst.CoreDaiLy_ThongTinChiTiet]}, 
								component: TradingProviderDetailComponent,
								canActivate: [AppRouteGuard],
							}
						],
					},
					{
						path: "sale-manager",
						children: [
							{ path: 'sale-active', component: SaleActiveComponent, data: {permissions: [PermissionCoreConst.CoreMenuSaleActive]}, canActivate: [AppRouteGuard] },
							{ path: "sale-active/detail/:id", component: SaleActiveDetailComponent, data: {permissions: [PermissionCoreConst.CoreSaleActive_ThongTinSale]}, canActivate: [AppRouteGuard] },
							{ path: 'sale-temporary', component: SaleTemporaryComponent, data: {permissions: [PermissionCoreConst.CoreMenuDuyetSale]}, canActivate: [AppRouteGuard] },
							{ path: "sale-temporary/detail/:id", component: SaleTemporaryDetailComponent, data: {permissions: [PermissionCoreConst.CoreDuyetSale_ThongTinSale]}, canActivate: [AppRouteGuard] },
							{ path: "sale-register", component: SaleRegisterComponent, data: {permissions: [PermissionCoreConst.CoreMenuSaleApp]}, canActivate: [AppRouteGuard] },
							{ path: "collab-contract-template", component: CollabContractTemplateComponent, data: {permissions: [PermissionCoreConst.CoreMenu_HDCT_Template]}, canActivate: [AppRouteGuard]},
						],
					},
					{
						path: "approve-manager",
						children: [
							{ 
								path: 'approve/:dataType', 
								data: {permissions: [
										PermissionCoreConst.CoreQLPD_KHCN_DanhSach, 
										PermissionCoreConst.CoreQLPD_KHDN_DanhSach, 
										PermissionCoreConst.CoreQLPD_NDTCN_DanhSach, 
										PermissionCoreConst.CoreQLPD_Sale_DanhSach
									]
								}, 
								component: ApproveComponent, 
								canActivate: [AppRouteGuard] 
							},
							{ 
								path: 'approve-email-phone/:dataType', 
								data: {permissions: [
										PermissionCoreConst.CoreQLPD_Email_DanhSach, 
										PermissionCoreConst.CoreQLPD_Phone_DanhSach, 
									]
								}, 
								component: ApproveEmailPhoneComponent, 
								canActivate: [AppRouteGuard] 
							},
						],
					},
					{
						path: "broadcast",
						children: [
							{
								path: "broadcast-news",
								data: {permissions: [PermissionCoreConst.CoreMenu_TinTuc]}, 
								component: BroadcastNewsComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "broadcast-media",
								data: {permissions: [PermissionCoreConst.CoreMenu_HinhAnh]}, 
								component: MediaComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "knowledge-base",
								data: {permissions: [PermissionCoreConst.CoreMenu_KienThucDauTu]}, 
								component: KnowledgeBaseComponent,
								canActivate: [AppRouteGuard],
							}
						],
					},
					{
						path: "notification",
						children: [
							{
								path: "system-notification-config",
								data: {permissions: [PermissionCoreConst.CoreMenu_CauHinhThongBaoHeThong]}, 
								component: SystemTemplateComponent,
								canActivate: [AppRouteGuard],
							}, 
							{
								path: "default-system-notification-config",
								data: {permissions: [PermissionCoreConst.CoreMenu_ThongBaoMacDinh]}, 
								component: DefaultSystemTemplateComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "notification-template",
								data: {permissions: [PermissionCoreConst.CoreMenu_MauThongBao]}, 
								component: NotificationTemplateComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "notification-manager",
								data: {permissions: [PermissionCoreConst.CoreMenu_QLTB]}, 
								component: NotificationManagerComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "notification-detail",
								data: {permissions: [PermissionCoreConst.CoreQLTB_PageChiTiet]}, 
								component: NotificationDetailComponent,
								canActivate: [AppRouteGuard],
							},
							{
								path: "provider-config",
								data: {permission: PermissionCoreConst.CoreMenu_CauHinhNCC}, 
								component: ProviderConfigurationComponent,
								canActivate: [AppRouteGuard],
							}, 
						],
					},
					{
						path: "establish",
						children: [
							{
								path: "system-notification-config",
								data: {permissions: [PermissionCoreConst.CoreMenu_CauHinhThongBaoHeThong]}, 
								component: SystemTemplateComponent,
								canActivate: [AppRouteGuard],
							}, 
							// {
							// 	path: "default-system-notification-config",
							// 	data: {permissions: [PermissionCoreConst.CoreMenu_ThongBaoMacDinh]}, 
							// 	component: DefaultSystemTemplateComponent,
							// 	canActivate: [AppRouteGuard],
							// },
							// {
							// 	path: "notification-template",
							// 	data: {permissions: [PermissionCoreConst.CoreMenu_MauThongBao]}, 
							// 	component: NotificationTemplateComponent,
							// 	canActivate: [AppRouteGuard],
							// },
							// {
							// 	path: "notification-manager",
							// 	data: {permissions: [PermissionCoreConst.CoreMenu_QLTB]}, 
							// 	component: NotificationManagerComponent,
							// 	canActivate: [AppRouteGuard],
							// },
							// {
							// 	path: "notification-detail",
							// 	data: {permissions: [PermissionCoreConst.CoreQLTB_PageChiTiet]}, 
							// 	component: NotificationDetailComponent,
							// 	canActivate: [AppRouteGuard],
							// },
							{
								path: "provider-config",
								data: {permission: PermissionCoreConst.CoreMenu_CauHinhNCC}, 
								component: ProviderConfigurationComponent,
								canActivate: [AppRouteGuard],
							}, 
							{
								path: "digital-sign",
								data: {permissions: [PermissionCoreConst.CoreMenu_CauHinhCKS]}, 
								component: DigitalSignComponent,
								canActivate: [AppRouteGuard],
							}, 
							{
								path: "whitelist-ip",
								data: {permissions: [PermissionCoreConst.CoreMenu_WhitelistIp]}, 
								component: WhileListIpComponent,
								canActivate: [AppRouteGuard],
							}, 
							{
								path: "msb-prefix-account",
								data: {permissions: [PermissionCoreConst.CoreMenu_MsbPrefix]}, 
								component: MsbPrefixAccountComponent,
								canActivate: [AppRouteGuard],
							}, 
						],
					},
					{
						path: "support",
						children: [
							{
								path: "chat",
								component: ChatComponent,
								canActivate: [AppRouteGuard],
							}
						],
					},
					{
						path: "department",
						data: {permissions: [PermissionCoreConst.CoreMenu_PhongBan]}, 
						component: DepartmentComponent,
						canActivate: [AppRouteGuard],
					},
					{	
						path: "collab-contract", 
						data: {permissions: [PermissionCoreConst.CoreSaleActive_HDCT]}, 
						component: CollabContractComponent, 
						canActivate: [AppRouteGuard]
					},
					{
						path: "payment-manager",
						// data: {permissions: [PermissionCoreConst.CoreMenu_PhongBan]}, 
						component: PaymentManagerComponent,
						canActivate: [AppRouteGuard],
					},
					
					{ 
						path: "export-report", 
						children: [
							{path: "management-report", component: ManagementReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_QuanTri], canActivate: [AppRouteGuard]}},
							{path: "operational-report", component: OperationalReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_VanHanh], canActivate: [AppRouteGuard]}},
							{path: "business-report", component: BusinessReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_KinhDoanh], canActivate: [AppRouteGuard]}},
							{path: "system-report", component: SystemReportComponent, data: {permissions: [PermissionCoreConst.Core_BaoCao_HeThong], canActivate: [AppRouteGuard]}},
							
						],
					},
				],
			},
		]),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
