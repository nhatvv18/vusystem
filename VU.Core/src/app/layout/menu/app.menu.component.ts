import { UserServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { PermissionCoreConst, UserTypes } from '@shared/AppConsts';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from '../main/app.main.component';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent extends AppComponentBase {

    model: any[];

    @Input() permissions: any[] = [];

    isLoading: boolean = false;

    constructor(
        public appMain: AppMainComponent,
        private _userService: UserServiceProxy,
        injector: Injector,
        messageService: MessageService,
    ) {
        super(injector, messageService);
        this.userLogin = this.getUser();
        console.log('userLogin____', this.userLogin); 
    }

    userLogin: any = {};
    // _tokenService: TokenService;
    UserTypes = UserTypes;

    ngOnInit() {
        this.model = [
            // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'], isShow: this.isPermission(PermissionCoreConst.CorePageDashboard) },
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'], isShow: true },
            // { label: 'Tài khoản', icon: 'pi pi-id-card', routerLink: ['/user'] },
            // { label: 'Tài khoản người dùng', icon: 'pi pi-id-card', routerLink: ['/investor-account'], isShow: this.isPermission(PermissionCoreConst.CorePageInvestorAccount) },
            {
                label: 'Tài khoản ứng dụng', icon: 'pi pi-sitemap', routerLink: ['/app-account'], isShow: this.isPermission(PermissionCoreConst.Core_Menu_TK_UngDung),
                items: [
                    
                    { label: 'Tài khoản người dùng', icon: '', routerLink: ['/app-account/user-account'], isShow: this.isPermission(PermissionCoreConst.CorePageInvestorAccount) }, 
                    { label: 'Chưa xác minh', icon: '', routerLink: ['/app-account/not-verified'], isShow: this.isPermission(PermissionCoreConst.Core_TK_ChuaXacMinh) }, 
                ]
            },
            {
                label: 'Khách hàng', icon: 'pi pi-users', routerLink: ['/customer'], isShow: true,//this.isPermission(PermissionCoreConst.CoreMenuKhachHang)
                items: [
                    { label: 'Thêm KH Cá nhân', icon: '', routerLink: ['/customer/investor/approve'], isShow: true }, //this.isPermission(PermissionCoreConst.CoreMenuDuyetKHCN)
                    { label: 'Khách hàng cá nhân', icon: '', routerLink: ['/customer/investor'], isShow: true }, //this.isPermission(PermissionCoreConst.CoreMenuKHCN)
                    { label: 'Thêm KH doanh nghiệp', icon: '', routerLink: ['/customer/business-customer/business-customer-approve'], isShow: this.isPermission(PermissionCoreConst.CoreMenuDuyetKHDN) },
                    { label: 'Khách hàng doanh nghiệp', icon: '', routerLink: ['/customer/business-customer/business-customer'], isShow: this.isPermission(PermissionCoreConst.CoreMenuKHDN) },
                ]
            },
            {
                label: 'Sale', icon: 'pi pi-users', routerLink: ['/sale-manager'], isShow: this.isPermission(PermissionCoreConst.CoreMenuSale) && UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type),
                items: [
                    { label: 'Duyệt thông tin Sale', icon: '', routerLink: ['/sale-manager/sale-temporary'], isShow: this.isPermission(PermissionCoreConst.CoreMenuDuyetSale) },
                    { label: 'Danh sách Sale', icon: '', routerLink: ['/sale-manager/sale-active'], isShow: this.isPermission(PermissionCoreConst.CoreMenuSaleActive) },
                    { label: 'Điều hướng Sale App', icon: '', routerLink: ['/sale-manager/sale-register'], isShow: this.isPermission(PermissionCoreConst.CoreMenuSaleApp) },
                    { label: 'Mẫu hợp đồng cộng tác', icon: '', routerLink: ['/sale-manager/collab-contract-template'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_HDCT_Template) },
                ]
            },
            {
                label: 'Quản lý đối tác', icon: 'pi pi-sitemap', routerLink: ['/partner-manager'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_QLDoiTac) && !UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type),
                items: [
                    { label: 'Danh sách đối tác', icon: '', routerLink: ['/partner-manager/partner'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_DoiTac) },
                    { label: 'Danh sách đại lý', icon: '', routerLink: ['/partner-manager/trading-provider'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_DaiLy) },
                ]
            },
            // {
            //     label: 'QL khách hàng doanh nghiệp', icon: 'pi pi-th-large', routerLink: ['/business-customer'],
            //     items: [
            //         { label: 'Duyệt KH doanh nghiệp', icon: '', routerLink: ['/business-customer/business-customer-approve'] },
            //         { label: 'Khách hàng doanh nghiệp', icon: '', routerLink: ['/business-customer/business-customer'] },
            //     ]
            // },
            // {label: 'Table Demo', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table']},   
            {
                label: 'Truyền thông', icon: 'pi pi-send', routerLink: ['/broadcast'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_TruyenThong),
                items: [
                    { label: 'Tin tức', icon: '', routerLink: ['broadcast/broadcast-news'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_TinTuc) },
                    { label: 'Hình ảnh', icon: '', routerLink: ['broadcast/broadcast-media'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_HinhAnh) },
                    { label: 'Kiến thức đầu tư', icon: '', routerLink: ['broadcast/knowledge-base'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_KienThucDauTu) },
                    // Hòm thư góp ý chưa xử lý nên comment lại
                    // { label: 'Hòm thư góp ý', icon: '', routerLink: ['broadcast/broadcast-news'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_HomThuGopY) }
                ]
            },
            {
                label: 'Thông báo', icon: 'pi pi-comment', routerLink: ['/notification'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_ThongBao),
                items: [
                    { label: 'Thông báo mặc định', icon: '', routerLink: ['/notification/default-system-notification-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_ThongBaoMacDinh) },
                    // { label: 'Cấu hình thông báo hệ thống', icon: '', routerLink: ['/notification/system-notification-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_CauHinhThongBaoHeThong) },
                    { label: 'Mẫu thông báo', icon: '', routerLink: ['/notification/notification-template'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_MauThongBao) },
                    { label: 'Quản lý thông báo', icon: '', routerLink: ['/notification/notification-manager'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_QLTB) },
                    // { label: 'Cấu hình nhà cung cấp', icon: '', routerLink: ['/notification/provider-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_CauHinhNCC) }
                ]
            },
            {
                label: 'Thiết lập', icon: 'pi pi-th-large', routerLink: ['/establish'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_ThongBao),
                items: [
                    // { label: 'Thông báo mặc định', icon: '', routerLink: ['/notification/default-system-notification-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_ThongBaoMacDinh) },
                    { label: 'Cấu hình thông báo hệ thống', icon: '', routerLink: ['/establish/system-notification-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_CauHinhThongBaoHeThong) },
                    // { label: 'Mẫu thông báo', icon: '', routerLink: ['/notification/notification-template'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_MauThongBao) },
                    // { label: 'Quản lý thông báo', icon: '', routerLink: ['/notification/notification-manager'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_QLTB) },
                    { label: 'Server thông báo', icon: '', routerLink: ['/establish/provider-config'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_CauHinhNCC) },
                    { label: 'Cấu hình chữ ký số', icon: '', routerLink: ['/establish/digital-sign'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_CauHinhCKS) }, 
                    { label: 'Whilelist ip', icon: '', routerLink: ['/establish/whitelist-ip'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_WhitelistIp) }, 
                    { label: 'Cấu hình giao dịch MSB', icon: '', routerLink: ['/establish/msb-prefix-account'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_MsbPrefix) && UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type)}, 
                ]
            },
            {
                label: 'Quản lý phòng ban', icon: 'pi pi-box', routerLink: ['/department'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_PhongBan) && UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type),
            },
            {
                label: 'Quản lý phê duyệt', icon: 'pi pi-check', routerLink: ['/approve-manager'], isShow: this.isPermission(PermissionCoreConst.CoreMenu_QLPD),
                items: [
                    // { label: 'Phê duyệt người dùng', icon: '', routerLink: ['/approve-manager/approve/1'] },
                    { label: 'Phê duyệt KH cá nhân', icon: '', routerLink: ['/approve-manager/approve/2'], isShow: this.isPermission(PermissionCoreConst.CoreQLPD_KHCN) },
                    { label: 'Phê duyệt KH doanh nghiệp', icon: '', routerLink: ['/approve-manager/approve/3'], isShow: this.isPermission(PermissionCoreConst.CoreQLPD_KHDN) },
                    { label: 'Phê duyệt NĐT chuyên nghiệp', icon: '', routerLink: ['/approve-manager/approve/10'], isShow: this.isPermission(PermissionCoreConst.CoreQLPD_NDTCN) },
                    { label: 'Phê duyệt sale', icon: '', routerLink: ['/approve-manager/approve/8'], isShow: this.isPermission(PermissionCoreConst.CoreQLPD_Sale) && UserTypes.TYPE_TRADING_PROVIDERS.includes(this.userLogin.user_type)},
                    { label: 'Phê duyệt Email', icon: '', routerLink: ['/approve-manager/approve-email-phone/13'] , isShow: this.isPermission(PermissionCoreConst.CoreQLPD_Email)},
                    { label: 'Phê duyệt số điện thoại', icon: '', routerLink: ['/approve-manager/approve-email-phone/12'] , isShow: this.isPermission(PermissionCoreConst.CoreQLPD_Phone)},
                ]
            },
            // {
            //     label: 'Quản lý giao dịch', icon: 'pi pi-building', routerLink: ['/payment-manager'], isShow: true,
            // },
            

            {
                label: 'Báo cáo thống kê', icon: 'pi pi-file', routerLink: ['/export-report'], isShow: this.isPermission(PermissionCoreConst.Core_Menu_BaoCao),
                items: [
                    { label: 'Báo cáo quản trị', icon: '', routerLink: ['/export-report/management-report'], isShow: this.isPermission(PermissionCoreConst.Core_BaoCao_QuanTri)},
                    { label: 'Báo cáo vận hành', icon: '', routerLink: ['/export-report/operational-report'], isShow: this.isPermission(PermissionCoreConst.Core_BaoCao_VanHanh)},
                    { label: 'Báo cáo kinh doanh', icon: '', routerLink: ['/export-report/business-report'], isShow: this.isPermission(PermissionCoreConst.Core_BaoCao_KinhDoanh)},
                    { label: 'Báo cáo hệ thống', icon: '', routerLink: ['/export-report/system-report'], isShow: this.isPermission(PermissionCoreConst.Core_BaoCao_HeThong)}
                ]
            },
            // {
            //     label: 'Chat', icon: 'pi pi-envelope', routerLink: ['/rocketchat'],
            // },
           
        ];
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }

    isPermission(keyName) {
        // return true;
        return this.permissions.includes(keyName);
    }
}
