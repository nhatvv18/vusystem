
export class AppConsts {
    static remoteServiceBaseUrl: string;
    static nodeBaseUrl: string;
    static rocketchatUrl: string;
    static rocketchat = {
        api: '',
        iframeSrc: '',
    };
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static redicrectHrefOpenDocs = "https://docs.google.com/viewerng/viewer?url=";
    static baseUrlHome: string;
    static permissions: string;

    static readonly grantType = {
        password: 'password',
        refreshToken: 'refresh_token',
    };

    static clientId: string;
    static clientSecret: string;

    static keyCrypt = 'idCrypt';

    static localeMappings: any = [];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly authorization = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        encryptedAuthTokenName: 'enc_auth_token'
    };

    static readonly localRefreshAction = {
        setToken: 'setToken',
        doNothing: 'doNothing',
    }
}

export class PermissionCoreConst {
    
    private static readonly Web: string = "web_";
    private static readonly Menu: string = "menu_";
    private static readonly Tab: string = "tab_";
    private static readonly Page: string = "page_";
    private static readonly Table: string = "table_";
    private static readonly Form: string = "form_";
    private static readonly ButtonTable: string = "btn_table_";
    private static readonly ButtonForm: string = "btn_form_";
    private static readonly ButtonAction: string = "btn_action_";

    public static readonly CoreModule: string = "core.";
    public static readonly CoreWeb: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Web}`;
    
    //
    public static readonly CorePageDashboard: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}dashboard`;
   
    public static readonly Core_Menu_TK_UngDung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}tk_ung_dung`;

    public static readonly Core_TK_ChuaXacMinh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}tk_chua_xac_minh`;
    public static readonly Core_TK_ChuaXacMinh_XacMinh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tk_chua_xac_minh_xac_minh`;
    public static readonly Core_TK_ChuaXacMinh_ResetMatKhau: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tk_chua_xac_minh_reset_mat_khau`;
    public static readonly Core_TK_ChuaXacMinh_XoaTaiKhoan: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tk_chua_xac_minh_xoa_tai_khoan`;

    public static readonly CorePageInvestorAccount: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}investor_account`;
    public static readonly CorePageInvestorAccount_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}investor_account_chi_tiet`;
    public static readonly CorePageInvestorAccount_ChangeStatus: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}investor_account_change_status`;
    public static readonly CorePageInvestorAccount_ResetMatKhau: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}investor_account_reset_mat_khau`;
    public static readonly CorePageInvestorAccount_DatMaPin: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}investor_account_dat_ma_pin`;
    public static readonly CorePageInvestorAccount_XoaTaiKhoan: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}investor_account_xoa_tai_khoan`;

    // khcn = KHCN = Khách hàng cá nhân; ds = danh sách; TKNH = Tài khoản ngân hàng
    public static readonly CoreMenuKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}khach_hang`;
    
    // Module Duyệt khách hàng cá nhân
    public static readonly CoreMenuDuyetKHCN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}duyet_khcn`;
    public static readonly CoreDuyetKHCN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khcn_danh_sach`;
    public static readonly CoreDuyetKHCN_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_them_moi`;
        
    //
    public static readonly CoreDuyetKHCN_ThongTinKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}duyet_khcn_thong_tin_khach_hang`;
    public static readonly CoreDuyetKHCN_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khcn_thong_tin_chung`;
    public static readonly CoreDuyetKHCN_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}duyet_khcn_chi_tiet`;
    public static readonly CoreDuyetKHCN_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_cap_nhat`;
    public static readonly CoreDuyetKHCN_TrinhDuyet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_trinh_duyet`;
    public static readonly CoreDuyetKHCN_CheckFace: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_check_face`;
   
    // tab TKNH = Tài khoản ngân hàng
    public static readonly CoreDuyetKHCN_TKNH: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khcn_tknh`;
    public static readonly CoreDuyetKHCN_TKNH_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khcn_tknh_danh_sach`;
    public static readonly CoreDuyetKHCN_TKNH_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tknh_them_moi`;
    public static readonly CoreDuyetKHCN_TKNH_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tknh_set_default`;
    public static readonly CoreDuyetKHCN_TKNH_Sua: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tknh_sua`;
    public static readonly CoreDuyetKHCN_TKNH_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tknh_xoa`;
   
    // tab TKCK = Tài khoản chứng khoán
    public static readonly CoreDuyetKHCN_TKCK: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khcn_tkck`;
    public static readonly CoreDuyetKHCN_TKCK_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khcn_tkck_danh_sach`;
    public static readonly CoreDuyetKHCN_TKCK_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tkck_them_moi`;
    public static readonly CoreDuyetKHCN_TKCK_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_tkck_set_default`;
   
    // tab TKCK = Tài khoản chứng khoán
    // public static readonly CoreKHCN_TKCK: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_tkck`;
    // public static readonly CoreKHCN_TKCK_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_tkck_danh_sach`;
    // public static readonly CoreKHCN_TKCK_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tkck_them_moi`;
    // public static readonly CoreKHCN_TKCK_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tkck_set_default`;

    // tab Quản lý giấy tờ tùy thân
    public static readonly CoreDuyetKHCN_GiayTo: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khcn_giay_to`;
    public static readonly CoreDuyetKHCN_GiayTo_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khcn_giay_to_danh_sach`;
    public static readonly CoreDuyetKHCN_GiayTo_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_giay_to_them_moi`;
    public static readonly CoreDuyetKHCN_GiayTo_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_giay_to_cap_nhat`;
    public static readonly CoreDuyetKHCN_GiayTo_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_giay_to_set_default`;
  
    // tab Quản lý địa chỉ liên hệ
    public static readonly CoreDuyetKHCN_DiaChi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khcn_dia_chi`;
    public static readonly CoreDuyetKHCN_DiaChi_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khcn_dia_chi_danh_sach`;
    public static readonly CoreDuyetKHCN_DiaChi_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_dia_chi_them_moi`;
    public static readonly CoreDuyetKHCN_DiaChi_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khcn_dia_chi_set_default`;

    // Module Khách hàng cá nhân
    // khcn = KHCN = Khách hàng cá nhân; ds = danh sách; TKNH = Tài khoản ngân hàng
    public static readonly CoreMenuKHCN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}khcn`;
    public static readonly CoreKHCN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_danh_sach`;
    public static readonly CoreKHCN_XacMinh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_xac_minh`;
        
    //
    public static readonly CoreKHCN_ThongTinKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}khcn_thong_tin_khach_hang`;
    public static readonly CoreKHCN_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_thong_tin_chung`;
    public static readonly CoreKHCN_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}khcn_chi_tiet`;
    public static readonly CoreKHCN_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_cap_nhat`;
    public static readonly CoreKHCN_CheckFace: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_check_face`;
    public static readonly CoreKHCN_DoiSDT: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_doi_sdt`;
    public static readonly CoreKHCN_DoiEmail: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_doi_email`;
    
    // tab TKNH = Tài khoản ngân hàng
    public static readonly CoreKHCN_TKNH: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_tknh`;
    public static readonly CoreKHCN_TKNH_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_tknh_danh_sach`;
    public static readonly CoreKHCN_TKNH_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tknh_them_moi`;
    public static readonly CoreKHCN_TKNH_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tknh_set_default`;
    public static readonly CoreKHCN_TKNH_Sua: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tknh_sua`;
    public static readonly CoreKHCN_TKNH_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tknh_xoa`;
   
    // tab TKCK = Tài khoản chứng khoán
    public static readonly CoreKHCN_TKCK: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_tkck`;
    public static readonly CoreKHCN_TKCK_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_tkck_danh_sach`;
    public static readonly CoreKHCN_TKCK_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tkck_them_moi`;
    public static readonly CoreKHCN_TKCK_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tkck_set_default`;
    
    // tab tài khoản đăng nhập
    public static readonly CoreKHCN_Account: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_account`;
    public static readonly CoreKHCN_Account_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_account_danh_sach`;
    public static readonly CoreKHCN_Account_ResetPassword: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_account_reset_password`;
    public static readonly CoreKHCN_Account_ResetPin: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_account_reset_pin`;
    public static readonly CoreKHCN_Account_ChangeStatus: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_account_change_status`;
    public static readonly CoreKHCN_Account_Delete: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_account_delete`;
    
    // tab Quản lý giấy tờ tùy thân
    public static readonly CoreKHCN_GiayTo: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_giay_to`;
    public static readonly CoreKHCN_GiayTo_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_giay_to_danh_sach`;
    public static readonly CoreKHCN_GiayTo_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_giay_to_them_moi`;
    public static readonly CoreKHCN_GiayTo_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_giay_to_cap_nhat`;
    public static readonly CoreKHCN_GiayTo_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_giay_to_set_default`;
        
    // tab Quản lý địa chỉ liên hệ
    public static readonly CoreKHCN_DiaChi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_dia_chi`;
    public static readonly CoreKHCN_DiaChi_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_dia_chi_danh_sach`;
    public static readonly CoreKHCN_DiaChi_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_dia_chi_them_moi`;
    public static readonly CoreKHCN_DiaChi_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_dia_chi_set_default`;
        
    // tab lịch sử chứng minh nhà đầu tư chuyên nghiệp ; NDTCN = Nhà Đầu Tư Chuyên Nghiệp
    public static readonly CoreKHCN_NDTCN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_ndtcn`;
    public static readonly CoreKHCN_NDTCN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_ndtcn_danh_sach`;
       
    // tab quản lý tư vấn viên ; TVV = Tư vấn viên
    public static readonly CoreKHCN_TuVanVien: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_tu_van_vien`;
    public static readonly CoreKHCN_TuVanVien_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_tu_van_vien_danh_sach`;
    public static readonly CoreKHCN_TuVanVien_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tu_van_vien_them_moi`;
    public static readonly CoreKHCN_TuVanVien_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khcn_tu_van_vien_set_default`;
        
    // tab quản lý người giới thiệu
    public static readonly CoreKHCN_NguoiGioiThieu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khcn_nguoi_gioi_thieu`;
    public static readonly CoreKHCN_NguoiGioiThieu_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khcn_nguoi_gioi_thieu_danh_sach`;
    //

    // Module Duyệt KHDN = Khách hàng doanh nghiệp
    public static readonly CoreMenuDuyetKHDN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}duyet_khdn`;
    public static readonly CoreDuyetKHDN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khdn_danh_sach`;
    public static readonly CoreDuyetKHDN_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_them_moi`;
    
    //
    public static readonly CoreDuyetKHDN_ThongTinKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}duyet_khdn_thong_tin_khach_hang`;
    public static readonly CoreDuyetKHDN_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khdn_thong_tin_chung`;
    public static readonly CoreDuyetKHDN_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}duyet_khdn_chi_tiet`;
    public static readonly CoreDuyetKHDN_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_cap_nhat`;
    public static readonly CoreDuyetKHDN_TrinhDuyet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_trinh_duyet`;
    
    // tab TKNH = Tài khoản ngân hàng
    public static readonly CoreDuyetKHDN_TKNH: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khdn_tknh`;
    public static readonly CoreDuyetKHDN_TKNH_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khdn_tknh_danh_sach`;
    public static readonly CoreDuyetKHDN_TKNH_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_tknh_them_moi`;
    public static readonly CoreDuyetKHDN_TKNH_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_tknh_set_default`;
    
    // tab CKS = Chữ ký số
    public static readonly CoreDuyetKHDN_CKS: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khdn_chu_ky_so`;
    public static readonly CoreDuyetKHDN_CauHinhChuKySo: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_cau_hinh_chu_ky_so`;
    
    // tab DKKD = Đăng ký kinh doanh
    public static readonly CoreDuyetKHDN_DKKD: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_khdn_dkkd`;
    public static readonly CoreDuyetKHDN_DKKD_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_khdn_dkkd_danh_sach`;
    public static readonly CoreDuyetKHDN_DKKD_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_dkkd_them_moi`;
    public static readonly CoreDuyetKHDN_DKKD_XemFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_dkkd_xem_file`;
    public static readonly CoreDuyetKHDN_DKKD_TaiFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_dkkd_tai_file`;
    public static readonly CoreDuyetKHDN_DKKD_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_dkkd_cap_nhat`;
    public static readonly CoreDuyetKHDN_DKKD_XoaFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_khdn_dkkd_xoa_file`;

    // Module KHDN = Khách hàng doanh nghiệp
    public static readonly CoreMenuKHDN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}khdn`;
    public static readonly CoreKHDN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khdn_danh_sach`;
    public static readonly CoreKHDN_XacMinh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_xac_minh`;
    
    // Thông tin chung
    public static readonly CoreKHDN_ThongTinKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}khdn_thong_tin_khach_hang`;
    public static readonly CoreKHDN_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khdn_thong_tin_chung`;
    public static readonly CoreKHDN_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}khdn_chi_tiet`;
    public static readonly CoreKHDN_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_cap_nhat`;
    
    // tab TKNH = Tài khoản ngân hàng
    public static readonly CoreKHDN_TKNH: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khdn_tknh`;
    public static readonly CoreKHDN_TKNH_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khdn_tknh_danh_sach`;
    public static readonly CoreKHDN_TKNH_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_tknh_them_moi`;
    public static readonly CoreKHDN_TKNH_SetDefault: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_tknh_set_default`;

    // tab CKS = Chữ ký số
    public static readonly CoreKHDN_CKS: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khdn_chu_ky_so`;
    public static readonly CoreKHDN_CauHinhChuKySo: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_cau_hinh_chu_ky_so`;

    // tab DKKD = Đăng ký kinh doanh
    public static readonly CoreKHDN_DKKD: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}khdn_dkkd`;
    public static readonly CoreKHDN_DKKD_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}khdn_dkkd_danh_sach`;
    public static readonly CoreKHDN_DKKD_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_dkkd_them_moi`;
    public static readonly CoreKHDN_DKKD_XemFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_dkkd_xem_file`;
    public static readonly CoreKHDN_DKKD_TaiFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_dkkd_tai_file`;
    public static readonly CoreKHDN_DKKD_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_dkkd_cap_nhat`;
    public static readonly CoreKHDN_DKKD_XoaFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}khdn_dkkd_xoa_file`;

    // Menu Sale
    public static readonly CoreMenuSale: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}sale`;
    
    // Menu duyệt sale -----------
    public static readonly CoreMenuDuyetSale: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}duyet_sale`;
    public static readonly CoreDuyetSale_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}duyet_sale_danh_sach`;
    public static readonly CoreDuyetSale_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_sale_them_moi`;
    public static readonly CoreDuyetSale_ThongTinSale: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}duyet_sale_thong_tin_sale`;
        
    // Thông tin chung
    public static readonly CoreDuyetSale_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}duyet_sale_thong_tin_chung`;
    public static readonly CoreDuyetSale_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}duyet_sale_chi_tiet`;
    public static readonly CoreDuyetSale_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_sale_cap_nhat`;
    public static readonly CoreDuyetSale_TrinhDuyet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}duyet_sale_trinh_duyet`;
    
    // Menu sale đã duyệt ---------
    public static readonly CoreMenuSaleActive: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}sale_active`;
    public static readonly CoreSaleActive_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}sale_active_danh_sach`;
    public static readonly CoreSaleActive_KichHoat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_kich_hoat`;
    public static readonly CoreSaleActive_ThongTinSale: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}sale_active_thong_tin_sale`;
        
    // Thông tin chung
    public static readonly CoreSaleActive_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}sale_active_thong_tin_chung`;
    public static readonly CoreSaleActive_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}sale_active_chi_tiet`;
    public static readonly CoreSaleActive_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_cap_nhat`;
        
    // Hợp đồng cộng tác = HDCT
    public static readonly CoreSaleActive_HDCT: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}sale_active_hdct`;
    public static readonly CoreSaleActive_HDCT_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}sale_active_hdct_danh_sach`;
    public static readonly CoreSaleActive_HDCT_UploadFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_upload_ho_so`;
    public static readonly CoreSaleActive_HDCT_UpdateFile: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_cap_nhat_ho_so`;
    public static readonly CoreSaleActive_HDCT_Sign: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_ky_dien_tu`;
    public static readonly CoreSaleActive_HDCT_Preview: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_xem_ho_so`;
    public static readonly CoreSaleActive_HDCT_Download: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_download_hop_dong`;
    public static readonly CoreSaleActive_HDCT_Download_Sign: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_active_hdct_download_hop_dong_sign`;
    
    // Menu sale App
    public static readonly CoreMenuSaleApp: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}sale_app`;
    public static readonly CoreSaleApp_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}sale_app_danh_sach`;
    public static readonly CoreSaleApp_DieuHuong: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}sale_app_dieu_huong`;
    
    // Mẫu Hợp đồng cộng tác = HDCT
    public static readonly CoreMenu_HDCT_Template: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}hdct_template`;
    public static readonly CoreHDCT_Template_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}hdct_template_danh_sach`;
    public static readonly CoreHDCT_Template_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hdct_template_them_moi`;
    public static readonly CoreHDCT_Template_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hdct_template_cap_nhat`;
    public static readonly CoreHDCT_Template_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hdct_template_xoa`;
    public static readonly CoreHDCT_Template_Preview: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hdct_template_preview`;
    public static readonly CoreHDCT_Template_Download: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hdct_template_download`;
    
    // Quản lý đối tác = qldt

    public static readonly CoreMenu_QLDoiTac: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}quan_ly_doi_tac`;

    public static readonly CoreMenu_DoiTac: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}doi_tac`;
    public static readonly CoreDoiTac_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}doi_tac_danh_sach`;
    public static readonly CoreDoiTac_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}doi_tac_them_moi`;
    public static readonly CoreDoiTac_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}doi_tac_xoa`;
        
    //
    public static readonly CoreDoiTac_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}doi_tac_thong_tin_chi_tiet`;
    public static readonly CoreDoiTac_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}doi_tac_thong_tin_chung`;
    public static readonly CoreDoiTac_XemChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}doi_tac_xem_chi_tiet`;
    public static readonly CoreDoiTac_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}doi_tac_cap_nhat`;
        
    //dai ly
    public static readonly CoreMenu_DaiLy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}doi_tac`;
    public static readonly CoreDaiLy_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}doi_tac_danh_sach`;
    public static readonly CoreDaiLy_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}doi_tac_them_moi`;
        
    //
    public static readonly CoreDaiLy_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}doi_tac_thong_tin_chi_tiet`;
    public static readonly CoreDaiLy_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}doi_tac_thong_tin_chung`;
    public static readonly CoreDaiLy_XemChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}doi_tac_xem_chi_tiet`;
    //  
    public static readonly CoreDoiTac_Account: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}doi_tac_account`;
    public static readonly CoreDoiTac_Account_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}doi_tac_account_danh_sach`;
    public static readonly CoreDoiTac_Account_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}doi_tac_account_them_moi`;
    
    // Truyền thông
    public static readonly CoreMenu_TruyenThong: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}truyen_thong`;

    // Truyền thông - Tin tức
    public static readonly CoreMenu_TinTuc: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}tin_tuc`;
    public static readonly CoreTinTuc_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}tin_tuc_danh_sach`;
    public static readonly CoreTinTuc_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tin_tuc_them_moi`;
    public static readonly CoreTinTuc_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tin_tuc_cap_nhat`;
    public static readonly CoreTinTuc_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tin_tuc_xoa`;
    public static readonly CoreTinTuc_PheDuyetDang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}tin_tuc_phe_duyet_dang`;
  
    // Truyền thông - hình ảnh
    public static readonly CoreMenu_HinhAnh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}hinh_anh`;
    public static readonly CoreHinhAnh_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}hinh_anh_danh_sach`;
    public static readonly CoreHinhAnh_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hinh_anh_them_moi`;
    public static readonly CoreHinhAnh_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hinh_anh_cap_nhat`;
    public static readonly CoreHinhAnh_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hinh_anh_xoa`;
    public static readonly CoreHinhAnh_PheDuyetDang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}hinh_anh_phe_duyet_dang`;

    // Truyền thông - Kiến thức đầu tư
    public static readonly CoreMenu_KienThucDauTu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}kien_thuc_dau_tu`;
    public static readonly CoreKienThucDauTu_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}kien_thuc_dau_tu_danh_sach`;
    public static readonly CoreKienThucDauTu_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}kien_thuc_dau_tu_them_moi`;
    public static readonly CoreKienThucDauTu_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}kien_thuc_dau_tu_cap_nhat`;
    public static readonly CoreKienThucDauTu_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}kien_thuc_dau_tu_xoa`;
    public static readonly CoreKienThucDauTu_PheDuyetDang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}kien_thuc_dau_tu_phe_duyet_dang`;
    
    // Truyền thông - Hòm thư góp ý 
    public static readonly CoreMenu_HomThuGopY: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}hom_thu_gop_y`;

    // Thông báo 
    public static readonly CoreMenu_ThongBao: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}thong_bao`;
    
    // Thông báo - Thông báo mặc định
    public static readonly CoreMenu_ThongBaoMacDinh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}thong_bao_mac_dinh`;
    public static readonly CoreThongBaoMacDinh_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}thong_bao_mac_dinh_cap_nhat`;
    
    // Thông báo - Cấu hình thông báo hệ thống
    public static readonly CoreMenu_CauHinhThongBaoHeThong: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}cau_hinh_thong_bao_he_thong`;
    public static readonly CoreCauHinhThongBaoHeThong_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}cau_hinh_thong_bao_he_thong_cap_nhat`;

    // Thông báo - Mẫu thông báo
    public static readonly CoreMenu_MauThongBao: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}mau_thong_bao`;
    public static readonly CoreMauThongBao_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}mau_thong_bao_danh_sach`;
    public static readonly CoreMauThongBao_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}mau_thong_bao_them_moi`;
    public static readonly CoreMauThongBao_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}mau_thong_bao_cap_nhat`;
    public static readonly CoreMauThongBao_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}mau_thong_bao_xoa`;
    public static readonly CoreMauThongBao_KichHoatOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}mau_thong_bao_kich_hoat_hoac_huy`;

    // Thông báo - Cấu hình nhà cung cấp
    public static readonly CoreMenu_CauHinhNCC: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}cau_hinh_ncc`;
    public static readonly CoreCauHinhNCC_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}cau_hinh_ncc_danh_sach`;
    public static readonly CoreCauHinhNCC_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}cau_hinh_ncc_them_moi`;
    public static readonly CoreCauHinhNCC_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}cau_hinh_ncc_cap_nhat`;
   
    // Thông báo - Cấu hình chữ ký số
    public static readonly CoreMenu_CauHinhCKS: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}cau_hinh_cks`;
    public static readonly CoreCauHinhCKS_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}cau_hinh_cks_danh_sach`;
    
    // public static readonly CoreCauHinhCKS_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}cau_hinh_cks_them_moi`;
    public static readonly CoreCauHinhCKS_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}cau_hinh_cks_cap_nhat`;
   
    // Thiết lập - Whitelist IP
    public static readonly CoreMenu_WhitelistIp: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}whitelist_ip`;
    public static readonly CoreWhitelistIp_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}whitelist_ip_danh_sach`;
    public static readonly CoreWhitelistIp_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}whitelist_ip_them_moi`;
    public static readonly CoreWhitelistIp_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}whitelist_ip_chi_tiet`;
    public static readonly CoreWhitelistIp_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}whitelist_ip_cap_nhat`;
    public static readonly CoreWhitelistIp_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}whitelist_ip_xoa`;

    // Thiết lập - Whitelist IP
    public static readonly CoreMenu_MsbPrefix: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}msb_prefix`;
    public static readonly CoreMsbPrefix_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}msb_prefix_danh_sach`;
    public static readonly CoreMsbPrefix_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}msb_prefix_them_moi`;
    public static readonly CoreMsbPrefix_ChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}msb_prefix_chi_tiet`;
    public static readonly CoreMsbPrefix_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}msb_prefix_cap_nhat`;
    public static readonly CoreMsbPrefix_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}msb_prefix_xoa`;

    // Thông báo - Quản lý thông báo = QLTB
    public static readonly CoreMenu_QLTB: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qltb`;
    public static readonly CoreQLTB_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qltb_danh_sach`;
    public static readonly CoreQLTB_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qltb_them_moi`;
    public static readonly CoreQLTB_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qltb_xoa`;
    public static readonly CoreQLTB_KichHoatOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qltb_kich_hoat_hoac_huy`;
    
    //
    public static readonly CoreQLTB_PageChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}qltb_page_chi_tiet`;
    
    //
    public static readonly CoreQLTB_ThongTinChung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}qltb_page_chi_tiet_thong_tin_chung`;
    public static readonly CoreQLTB_PageChiTiet_ThongTin: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}qltb_page_chi_tiet_thong_tin`;
    public static readonly CoreQLTB_PageChiTiet_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qltb_page_chi_tiet_cap_nhat`;
    
    //
    public static readonly CoreQLTB_GuiThongBao: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Tab}qltb_page_chi_tiet_gui_thong_bao`;
    public static readonly CoreQLTB_PageChiTiet_GuiThongBao_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Form}qltb_page_chi_tiet_gui_thong_bao_danh_sach`;
    public static readonly CoreQLTB_PageChiTiet_GuiThongBao_CaiDat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qltb_page_chi_tiet_gui_thong_bao_cai_dat`;
   
    // Quản lý phê duyệt = QLPD, Khách hàng cá nhân = KHCN, Khách hàng doanh nghiệp = KHDN, Nhà đầu tư chuyên nghiệp = NDTCN
    public static readonly CoreMenu_QLPD: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd`;
    
    // Phê duyệt khách hàng cá nhân
    public static readonly CoreQLPD_KHCN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_khcn`;
    public static readonly CoreQLPD_KHCN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_khcn_danh_sach`;
    public static readonly CoreQLPD_KHCN_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khcn_phe_duyet_or_huy`;
    public static readonly CoreQLPD_KHCN_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khcn_xem_lich_su`;
    public static readonly CoreQLPD_KHCN_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khcn_thong_tin_chi_tiet`;
    
    // Phê duyệt khách hàng doanh nghiệp
    public static readonly CoreQLPD_KHDN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_khdn`;
    public static readonly CoreQLPD_KHDN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_khdn_danh_sach`;
    public static readonly CoreQLPD_KHDN_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khdn_phe_duyet_or_huy`;
    public static readonly CoreQLPD_KHDN_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khdn_xem_lich_su`;
    public static readonly CoreQLPD_KHDN_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_khdn_thong_tin_chi_tiet`;
    
    // Phê duyệt nhà đầu tư chuyên nghiệp -----
    public static readonly CoreQLPD_NDTCN: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_ndtcn`;
    public static readonly CoreQLPD_NDTCN_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_ndtcn_danh_sach`;
    public static readonly CoreQLPD_NDTCN_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_ndtcn_phe_duyet_or_huy`;
    public static readonly CoreQLPD_NDTCN_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_ndtcn_xem_lich_su`;
    public static readonly CoreQLPD_NDTCN_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_ndtcn_thong_tin_chi_tiet`;
   
    // Phê duyệt email -----
    public static readonly CoreQLPD_Email: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_email`;
    public static readonly CoreQLPD_Email_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_email_danh_sach`;
    public static readonly CoreQLPD_Email_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_email_phe_duyet_or_huy`;
    public static readonly CoreQLPD_Email_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_email_xem_lich_su`;
    public static readonly CoreQLPD_Email_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_email_thong_tin_chi_tiet`;
    
    // Phê duyệt phone -----
    public static readonly CoreQLPD_Phone: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_phone`;
    public static readonly CoreQLPD_Phone_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_phone_danh_sach`;
    public static readonly CoreQLPD_Phone_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_phone_phe_duyet_or_huy`;
    public static readonly CoreQLPD_Phone_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_phone_xem_lich_su`;
    public static readonly CoreQLPD_Phone_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_phone_thong_tin_chi_tiet`;
    
    // Phê duyệt Sale ----
    public static readonly CoreQLPD_Sale: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}qlpd_sale`;
    public static readonly CoreQLPD_Sale_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}qlpd_sale_danh_sach`;
    public static readonly CoreQLPD_Sale_PheDuyetOrHuy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_sale_phe_duyet_or_huy`;
    public static readonly CoreQLPD_Sale_XemLichSu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_sale_xem_lich_su`;
    public static readonly CoreQLPD_Sale_ThongTinChiTiet: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}qlpd_sale_thong_tin_chi_tiet`;
    // Quản lý phòng ban
    public static readonly CoreMenu_PhongBan: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}phong_ban`;
    public static readonly CorePhongBan_DanhSach: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Table}phong_ban_danh_sach`;
    public static readonly CorePhongBan_ThemMoi: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}phong_ban_them_moi`;
    public static readonly CorePhongBan_ThemQuanLy: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}phong_ban_them_quan_ly`;
    public static readonly CorePhongBan_ThemQuanLyDoanhNghiep: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}phong_ban_them_quan_ly_doanh_nghiep`;
    public static readonly CorePhongBan_CapNhat: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}phong_ban_cap_nhat`;
    public static readonly CorePhongBan_Xoa: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}phong_ban_xoa`;

    // Báo cáo
    public static readonly Core_Menu_BaoCao: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Menu}bao_cao`;

    public static readonly Core_BaoCao_QuanTri: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}bao_cao_quan_tri`;
    public static readonly Core_BaoCao_QuanTri_DSSaler: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_ds_saler`;
    public static readonly Core_BaoCao_QuanTri_DSKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_ds_khach_hang`;
    public static readonly Core_BaoCao_QuanTri_DSKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_ds_khach_hang_root`;
    public static readonly Core_BaoCao_QuanTri_DSNguoiDung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_ds_nguoi_dung`;
    public static readonly Core_BaoCao_QuanTri_DSKhachHangHVF: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_ds_khach_hang_hvf`;
    // public static readonly Core_BaoCao_QuanTri_SKTKNhaDauTu: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_sktk_nha_dau_tu`;
    public static readonly Core_BaoCao_QuanTri_TDTTKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_thay_doi_tt_khach_hang`;
    public static readonly Core_BaoCao_QuanTri_TDTTKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_quan_tri_tdtt_khach_hang_root`;

    public static readonly Core_BaoCao_VanHanh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}bao_cao_van_hanh`;
    public static readonly Core_BaoCao_VanHanh_DSSaler: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_ds_saler`;
    public static readonly Core_BaoCao_VanHanh_DSKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_ds_khach_hang`;
    public static readonly Core_BaoCao_VanHanh_DSKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_ds_khach_hang_root`;
    public static readonly Core_BaoCao_VanHanh_DSNguoiDung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_ds_nguoi_dung`;
    public static readonly Core_BaoCao_VanHanh_TDTTKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_thay_doi_tt_khach_hang`;
    public static readonly Core_BaoCao_VanHanh_TDTTKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_van_hanh_tdtt_khach_hang_root`;

    public static readonly Core_BaoCao_KinhDoanh: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}bao_cao_kinh_doanh`;
    public static readonly Core_BaoCao_KinhDoanh_DSSaler: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_kinh_doanh_ds_saler`;
    public static readonly Core_BaoCao_KinhDoanh_DSKhachHang: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_kinh_doanh_ds_khach_hang`;
    public static readonly Core_BaoCao_KinhDoanh_DSKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_kinh_doanh_ds_khach_hang_root`;
    public static readonly Core_BaoCao_KinhDoanh_DSNguoiDung: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_kinh_doanh_ds_nguoi_dung`;


    public static readonly Core_BaoCao_HeThong: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.Page}bao_cao_he_thong`;
    public static readonly Core_BaoCao_HeThong_DSKhachHangRoot: string = `${PermissionCoreConst.CoreModule}${PermissionCoreConst.ButtonAction}bao_cao_he_thong_ds_khach_hang_root`;
}

export class AppPermissionNames {
    // user
    public readonly Pages_Users = "Pages.Users";
    public readonly Actions_Users_Create = "Actions.Users.Create";
    public readonly Actions_Users_Update = "Actions.Users.Update";
    public readonly Actions_Users_Delete = "Actions.Users.Delete";
    public readonly Actions_Users_Activation = "Actions.Users.Activation";

    // role
    public readonly Pages_Roles = "Pages.Roles";
    public readonly Actions_Roles_Create = "Actions.Roles.Create";
    public readonly Actions_Roles_Update = "Actions.Roles.Update";
    public readonly Actions_Roles_Delete = "Actions.Roles.Delete";
}

export class DataTableConst {
    public static message = {
        emptyMessage: 'Không có dữ liệu',
        totalMessage: 'bản ghi',
        selectedMessage: 'chọn'
    }
}

export class UserTypes {
    //
    public static list = [
        {
            name: 'Epic',
            code: 'E',
            severity: '',
        },
        {
            name: 'Đối tác root',
            code: 'RP',
            severity: '',
        },
        {
            name: 'Đối tác',
            code: 'P',
            severity: '',
        },
        {
            name: 'Đại lý Root',
            code: 'RT',
            severity: '',
        },
        {
            name: 'User',
            code: 'T',
            severity: '',
        },
    ];

    public static EPIC = 'E';
    public static PARTNER_ROOT = 'RP';
    public static PARTNER = 'P';
    public static TRADING_PROVIDER_ROOT = 'RT';
    public static TRADING_PROVIDER = 'T'; // User thuộc đại lý (Do đại lý tạo)
    // TYPE GROUP
    public static TYPE_PARTNERS = ['P', 'RP'];  // ĐỐI TÁC ROOT || ĐỐI TÁC THƯỜNG
    public static TYPE_ROOTS = ['RP', 'RT'];  // ĐỐI TÁC ROOT || ĐẠI LÝ ROOT
    public static TYPE_TRADING_PROVIDERS = ['T', 'RT']; // ĐẠI LÝ ROOT || ĐẠI LÝ THƯỜNG
    public static TYPE_EPIC = ['E','RE'];  
    
    

    public static getUserTypeInfo(code, property) {
        let type = this.list.find(t => t.code == code);
        if (type) return type[property];
        return '';
    }

}

export class ProductBondPrimaryConst {

    public static priceTypes = [
        {
            name: 'Nguyên giá',
            code: 1,
        },
        {
            name: 'Nguyên giá + lãi phát sinh',
            code: 2,
        },
    ];
    // public static statusConst = [
    //     {
    //         name: 'Khởi tạo',
    //         code: 'T'
    //     },
    //     {
    //         name: 'Trình duyệt',
    //         code: 'P'
    //     },
    //     {
    //         name: 'Duyệt',
    //         code: 'A'
    //     },
    //     {
    //         name: 'Hủy duyệt',
    //         code: 'C'
    //     }
    // ];
    public static statusList = [
        {
            name: 'Kích hoạt',
            code: 'A'
        },
        {
            name: 'Chưa kích hoạt',
            code: 'D'
        }
    ]

    // public static NHAP = 'T';
    // public static TRINH_DUYET = 'P';
    // public static DUYET = 'A';
    // public static DONG = 'C';


    public static getNamePriceType(code: number) {
        let priceType = this.priceTypes.find(priceType => priceType.code == code);
        if (priceType) return priceType.name;
        return '';
    }

    public static paymentTypes = [
        {
            name: 'Từ ngày phát hành',
            code: 1,
        }
    ];
    public static getNamePaymentTypes(code) {
        let paymentType = this.paymentTypes.find(paymentType => paymentType.code == code);
        if (paymentType) return paymentType.name;
        return '';
    }

    public static status = [
        {
            name: 'Khởi tạo',
            code: 'T',
            severity: 'help'

        },
        {
            name: 'Trình duyệt',
            code: 'P',
            severity: 'warning'
        },
        {
            name: 'Hoạt động',
            code: 'A',
            severity: 'success'
        },
        {
            name: 'Hủy duyệt',
            code: 'C',
            severity: 'secondary'
        }
    ];

    public static getNameStatus(code) {
        for (let item of this.status) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getSeverityStatus(code) {
        for (let item of this.status) {
            if (item.code == code) return item.severity;
        }
        return '';
    }

    public static KHOI_TAO = 'T';
    public static TRINH_DUYET = 'P';
    public static HOAT_DONG = 'A';
    public static HUY_DUYET = 'C';

}

export class DepositProviderConst {
    public static statusConst = [
        {
            name: 'Kích hoạt',
            code: 'A'
        },
        {
            name: 'Chưa kích hoạt',
            code: 'D'
        }
    ]
    public static types = [
        {
            name: 'Tổ chức',
            code: 'B',
        },
        {
            name: 'Cá nhân',
            code: 'I',
        },

    ];

    public static getNameType(code) {
        let type = this.types.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameStatus(code) {
        let type = this.statusConst.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }
}

export class ProductBondDetailConst {

    public static getUnitDates(code) {
        for (let item of this.unitDates) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getAllowOnlineTradings(code) {
        for (let item of this.allowOnlineTradings) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getMarkets(code) {
        for (let item of this.markets) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static markets = [
        {
            name: 'Phân phối',
            code: '1'
        },
        {
            name: 'Ghi sổ',
            code: '2'
        }
    ];

    public static unitDates = [
        {
            name: 'Năm',
            code: 'Y',
        },
        {
            name: 'Tháng',
            code: 'M'
        }

    ];

    public static allowOnlineTradings = [
        {
            name: 'Cho phép',
            code: 'Y'
        },
        {
            name: 'Không cho phép',
            code: 'N'
        }
    ]
}

export class UnitDateConst {
    public static list = {
        D: 'd',
        M: 'M',
        Y: 'y',
    }
}

export class StatusBondInfoFileConst {
    public static list = [
        {
            name: "Trình duyệt",
            code: 0,
        },
        {
            name: "Duyệt",
            code: 1,
        },
    ]

    public static RESPONSE_TRUE = 1;
    public static RESPONSE_FALSE = 0;

    public static getStatusName(code) {
        let list = this.list.find(list => list.code == code);
        if (list) return list.name;
        return '';
    }
}

export class StatusResponseConst {
    public static list = [
        {
            value: false,
            status: 0,
        },
        {
            value: true,
            status: 1,
        },
    ]

    public static RESPONSE_TRUE = 1;
    public static RESPONSE_FALSE = 0;

}

export class ContractTemplateConst {


    public static status = {
        ACTIVE: "A",
        DEACTIVE: "D"
    }

    public static classify = [
        { name: "PRO", code: 1 },
        { name: "PRO A", code: 2 },
        { name: "PNOTE", code: 3 }
    ]

    public static contractType = [
        { name: "Hợp đồng đầu tư trái phiếu", code: 1 },
        { name: "Biên nhận hồ sơ", code: 2 },
        { name: "Giấy xác nhận giao dịch trái phiếu", code: 3 },
        { name: "Phiếu đề nghị thực hiện giao dịch", code: 4 },
        { name: "Hợp đồng đặt mua trái phiếu", code: 5 },
        { name: "Hợp đồng đặt bán trái phiếu", code: 6 },
        { name: "Biên nhận hợp đồng", code: 7 },
        { name: "Giấy xác nhận số dư trái phiếu", code: 8 },
        { name: "Bảng minh họa thu nhập từ trái phiếu và kết quả đầu tư", code: 9 }
    ]

    public static statusName = {
        A: { name: "Kích hoạt", color: "success" },
        D: { name: "Khóa", color: "warning" }
    }
}

export class InvestorAccountConst {
    public static statusName = {
        A: { name: "Hoạt động", color: "success" },
        D: { name: "Đang khóa", color: "secondary" },
        T: { name: "Tạm", color: "help" },
        L: { name: "Xóa", color: "danger" }
    }
    public static status = [
        {
            name: 'Hoạt động',
            code: 'A'
        },
        {
            name: 'Đang khóa',
            code: 'D'
        },
        {
            name: 'Đã xóa',
            code: 'L'
        }
    ];

    public static fieldFilters = [
        {
            name: 'Số điện thoại',
            code: 3,
            field: 'phone',
            placeholder: 'Nhập số điện thoại...',
        },
        {
            name: 'Họ tên',
            code: 1,
            field: 'fullname',
            placeholder: 'Nhập họ tên...',
        },
        
        {
            name: 'Mã khách hàng',
            code: 4,
            field: 'cifCode',
            placeholder: 'Nhập mã khách hàng...',
        },
       
    ];
    
    public static getInfoFieldFilter(field, attribute: string) {
        const fieldFilter = this.fieldFilters.find(fieldFilter => fieldFilter.field == field);
        return fieldFilter ? fieldFilter[attribute] : null;
    }

}

export class ProductBondInfoConst {

    public static periodUnits = [
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Năm',
            code: 'Y'
        }
    ];

    public static KHOI_TAO = 1;
    public static CHO_DUYET = 2;
    public static HOAT_DONG = 3;
    public static HUY_DUYET = 4;
    public static DONG = 5;

    public static statusConst = [
        {
            name: 'Khởi tạo',
            code: this.KHOI_TAO,
            severity: 'help',
        },
        {
            name: 'Trình duyệt',
            code: this.CHO_DUYET,
            severity: 'warning',
        },
        {
            name: 'Hoạt động',
            code: this.HOAT_DONG,
            severity: 'success',
        },
        {
            name: 'Hủy duyệt',
            code: this.HUY_DUYET,
            severity: 'danger',
        },
        {
            name: 'Đóng',
            code: this.DONG,
            severity: 'secondary',
        }
    ]
    public static interestRateTypes = [
        {
            name: 'Định kỳ',
            code: 1,
        },
        {
            name: 'Cuối kỳ',
            code: 2,
        }
    ];

    public static countType = [
        {
            name: 'Tính từ ngày phát hành',
            code: 1,
        },
        {
            name: 'Tính từ ngày thanh toán',
            code: 2,
        }
    ];

    public static bondPeriodUnits = [
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Năm',
            code: 'Y'
        }
    ]
    public static booleans = [
        {
            name: 'Có',
            code: 'Y'
        },
        {
            name: 'Không',
            code: 'N'
        },
    ];
    public static unitDates = [
        {
            name: 'Năm',
            code: 'Y',
        },
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Ngày',
            code: 'D'
        }

    ];

    public static status = [
        {
            name: 'Khởi tạo',
            code: this.KHOI_TAO,
            severity: 'help',
        },
        {
            name: 'Trình duyệt',
            code: this.CHO_DUYET,
            severity: 'warning',
        },
        {
            name: 'Hoạt động',
            code: this.HOAT_DONG,
            severity: 'success',
        },
        {
            name: 'Hủy duyệt',
            code: this.HUY_DUYET,
            severity: 'danger',
        },
        {
            name: 'Đóng',
            code: this.DONG,
            severity: 'secondary',
        }
    ];

    // public static STATUS = {
    //     KHOI_TAO: 1,
    //     CHO_DUYET: 2,
    //     HOAT_DONG: 3,
    //     CLOSE: 4,
    // }



    public static STATUS_ACTIVE = 'A';
    public static STATUS_DISABLE = 'D';
    //
    public static QUESTION_YES = 'Y';
    public static QUESTION_NO = 'N';
    //
    public static INTEREST_RATE_TYPE_PERIODIC = 1;
    public static INTEREST_RATE_TYPE_PERIOD_END = 2;
    //
    public static UNIT_DATE_YEAR = 'Y';
    //

    public static getStatusName(code) {
        let status = this.status.find(status => status.code == code);
        if (status) return status.name;
        return '';
    }

    public static getStatusSeverity(code) {
        let status = this.status.find(status => status.code == code);
        if (status) return status.severity;
        return '';
    }

    public static getPeriodUnits(code) {
        for (let item of this.periodUnits) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getInterestRateTypes(code) {
        for (let item of this.interestRateTypes) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getBoolean(code) {
        for (let item of this.booleans) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getUnitDates(code) {
        for (let item of this.unitDates) {
            if (item.code == code) return item.name;
        }
        return '';
    }
    public static getNameStatus(code) {
        let type = this.status.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }
}


export class IssuerConst {
    //
    public static status = [
        {
            name: 'Kích hoạt',
            code: 1,
        },
        {
            name: 'Không kích hoạt',
            code: 2,
        },
        {
            name: 'Đóng',
            code: 3,
        },
    ];
    public static STATUS_ACTIVE = 1;
    public static STATUS_DISABLE = 2;
    public static STATUS_CLOSE = 3;

    public static getStatusName(code) {
        let status = this.status.find(status => status.code == code);
        if (status) return status.name;
        return '';
    }

    //
    public static types = [
        {
            name: 'Tổ chức',
            code: 'B',
        },
        {
            name: 'Cá nhân',
            code: 'I',
        },

    ];

    public static getNameType(code) {
        let type = this.types.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    //
}

export class ContractTypeConst {
    public static list = [
        {
            name: 'PNOTE',
            code: 1,
        },
        {
            name: 'PRO',
            code: 2,
        },
        {
            name: 'PROA',
            code: 3,
        }
    ];

    public static PNOTE = 1;
    public static PRO = 2;
    public static PROA = 3;

    public static getName(code: Number) {
        const rslt = this.list.find(e => e.code.toString() === code.toString());
        return rslt ? rslt.name : '-';
    }
}

export class OrderPaymentConst {
    public static transactionTypes = [
        {
            name: 'Thu',
            code: 1,
        },
        {
            name: 'Chi',
            code: 2,
        },
    ];

    public static getNameTransactionType(code: number) {
        const transactionType = this.transactionTypes.find(t => t.code == code);
        return transactionType ? transactionType.name : '-';
    }

    public static paymentTypes = [
        {
            name: 'Chuyển khoản',
            code: 1,
        },
        {
            name: 'Tiền mặt',
            code: 2,
        },
    ];

    public static PAYMENT_TYPE_CASH = 1;
    public static PAYMENT_TYPE_TRANSFER = 2;

    public static getNamePaymentType(code: number) {
        const paymentType = this.paymentTypes.find(p => p.code == code);
        return paymentType ? paymentType.name : '-';
    }

    public static paymentStatus = [
        {
            name: 'Trình duyệt',
            code: 1,
            severity: 'warning'
        },
        {
            name: 'Đã thanh toán',
            code: 2,
            severity: 'success'
        },
        {
            name: 'Hủy thanh toán',
            code: 3,
            severity: 'danger'
        },
    ];

    public static PAYMENT_TEMP = 1;
    public static PAYMENT_SUCCESS = 2;
    public static PAYMENT_CLOSE = 3;

    public static getNamePaymentStatus(code: number) {
        const status = this.paymentStatus.find(p => p.code == code);
        return status ? status.name : '-';
    }

    public static getSeverityPaymentStatus(code: number) {
        const status = this.paymentStatus.find(p => p.code == code);
        return status ? status.severity : '-';
    }

    public static fileStatus = [
        {
            name: 'Trình duyệt',
            code: 1,
            severity: 'warning'
        },
        {
            name: 'Đã duyệt',
            code: 2,
            severity: 'success'
        },
        // {
        //     name: 'Từ chối',
        //     code: 3,
        //     severity: 'danger'
        // },
    ];
}


export class DistributionContractConst {

    public static DAT_DAU_TU = 1;
    public static XY_LY_HOP_DONG = 2;
    public static DANG_DAU_TU = 3;

    public static status = [
        {
            name: 'Đặt đầu tư',
            code: 1,
            severity: 'help'
        },
        {
            name: 'Xử lý hợp đồng',
            code: 2,
            severity: 'warning'
        },
        {
            name: 'Đang đầu tư',
            code: 3,
            severity: 'success'
        }
    ];

    public static ORDER = 1;
    public static PENDING = 1;
    public static SUCCESS = 2;

    public static getNameStatus(code: number) {
        const status = this.status.find(s => s.code == code);
        return status ? status.name : '-';
    }

    public static getSeverityStatus(code: number) {
        const status = this.status.find(s => s.code == code);
        return status ? status.severity : '-';
    }

    public static transactionTypes = [
        {
            name: 'Thu',
            code: 1,
        },
        {
            name: 'Chi',
            code: 2,
        },
    ];

    public static getNameTransactionType(code: number) {
        const transactionType = this.transactionTypes.find(t => t.code == code);
        return transactionType ? transactionType.name : '-';
    }

    public static paymentTypes = [
        {
            name: 'Tiền mặt',
            code: 1,
        },
        {
            name: 'Chuyển khoản',
            code: 2,
        },
    ];

    public static PAYMENT_TYPE_CASH = 1;
    public static PAYMENT_TYPE_TRANSFER = 2;

    public static getNamePaymentType(code: number) {
        const paymentType = this.paymentTypes.find(p => p.code == code);
        return paymentType ? paymentType.name : '-';
    }

    public static paymentStatus = [
        {
            name: 'Trình duyệt',
            code: 1,
            severity: 'warning'
        },
        {
            name: 'Đã thanh toán',
            code: 2,
            severity: 'success'
        },
        {
            name: 'Hủy thanh toán',
            code: 3,
            severity: 'danger'
        },
    ];

    public static PAYMENT_TEMP = 1;
    public static PAYMENT_SUCCESS = 2;
    public static PAYMENT_CLOSE = 3;

    public static getNamePaymentStatus(code: number) {
        const status = this.paymentStatus.find(p => p.code == code);
        return status ? status.name : '-';
    }

    public static getSeverityPaymentStatus(code: number) {
        const status = this.paymentStatus.find(p => p.code == code);
        return status ? status.severity : '-';
    }

    public static fileStatus = [
        {
            name: 'Chờ duyệt',
            code: 1,
            severity: 'warning'
        },
        {
            name: 'Đã duyệt',
            code: 2,
            severity: 'success'
        },
        {
            name: 'Huỷ duyệt',
            code: 3,
            severity: 'danger'
        },
    ];

    public static FILE_PENDING = 1;
    public static FILE_APPROVE = 2;
    public static FILE_CANCEL = 3;


    public static getNameFileStatus(code: number) {
        const status = this.fileStatus.find(p => p.code == code);
        return status ? status.name : '-';
    }

    public static getSeverityFileStatus(code: number) {
        const status = this.fileStatus.find(p => p.code == code);
        return status ? status.severity : '-';
    }
}

export class BusinessTypeConst {
    public static list = [
        {
            name: 'B2B',
            code: 'B2B',
        },
        {
            name: 'B2C',
            code: 'B2C',
        }
    ];

    public static B2B = 'B2B';
    public static B2C = 'B2C';
}

export class YesNoConst {
    public static list = [
        {
            name: 'Có',
            code: 'Y',
        },
        {
            name: 'Không',
            code: 'N',
        },
    ]

    public static getName(code) {
        for (let item of this.list) {
            if (item.code == code) return item.name;
        }
        return '-';
    }

    public static YES = 'Y';
    public static NO = 'N';
}
export class StatusDeleteConst {
    public static list = [
        {
            name: 'Hoạt động',
            code: 'N',
            severity: 'success'
        },
        {
            name: 'Đã xóa',
            code: 'Y',
            severity: 'secondary'
        },
    ]

    public static getInfo(code, atribution = 'name') {
        let status = this.list.find(s => s.code == code);
        console.log('status', status, code);
        return status ? status[atribution] : null;
    }

    public static YES = 'Y';
    public static NO = 'N';
}

export class SearchConst {
    public static DEBOUNCE_TIME = 800;
}

export class ProductBondInterestConst {
    public static interestPeriodTypes = [
        {
            name: 'Năm',
            code: 'Y',
        },
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Tuần',
            code: 'W'
        },
        {
            name: 'Ngày',
            code: 'D'
        },
        {
            name: 'Quý',
            code: 'Q',
        }
    ];

    public static periodTypes = [
        {
            name: 'Ngày',
            code: 'D'
        },
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Năm',
            code: 'Y',
        }
    ];

    public static INTEREST_TYPES = {
        DINH_KY: 1,
        CUOI_KY: 2,
    };

    // KIỂU TRẢ LÃI
    public static interestTypes = [
        {
            name: 'Định kỳ',
            code: this.INTEREST_TYPES.DINH_KY,
        },
        {
            name: 'Cuối kỳ',
            code: this.INTEREST_TYPES.CUOI_KY,
        },
    ]

    public static isDinhKy(interest) {
        return interest == this.INTEREST_TYPES.DINH_KY;
    }

    public static getPeriodUnits(code) {
        for (let item of this.interestPeriodTypes) {
            if (item.code == code) return item.name;
        }
        return '';
    }
    /**
     * LẤY TÊN KIỂU TRẢ LÃI
     * @param code 
     * @returns TÊN KIỂU TRẢ LÃI
     */
    public static getInterestTypeName(code) {
        const found = this.interestTypes.find(o => o.code === code);
        return found ? found.name : '';
    }
}

export class ProductPolicyConst {

    public static investorTypes = [
        {
            name: 'Chuyên nghiệp',
            code: 'P',
        },
        {
            name: 'Tất cả',
            code: 'A'
        },
    ];

    public static listClassify = [
        {
            name: 'PRO',
            code: 1,
        },
        {
            name: 'PRO A',
            code: 2,
        },
        {
            name: 'PNOTE',
            code: 3,
        }
    ];

    public static getCustomerType(code) {
        for (let item of this.investorTypes) {
            if (item.code == code) return item.name;
        }
        return '-';
    }

    public static statusList = [
        {
            name: 'Kích hoạt',
            code: 'A',
        },
        {
            name: 'Khóa',
            code: 'D',
        }
    ];

    public static getStatusName(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    // KIỂU CHÍNH SÁCH
    public static types = [
        {
            name: 'Fix ngày bán cố định',
            code: 1
        },
        {
            name: 'Ngày bán thay đổi',
            code: 2
        },
    ]

    /**
     * LẤY TÊN KIỂU CHÍNH SÁCH
     * @param code 
     * @returns TÊN KIỂU CHÍNH SÁCH
     */
    public static getTypeName(code) {
        var result = this.types.find(o => o.code === code);
        return result ? result?.name : '';
    }

    public static unitDates = [
        {
            name: 'Ngày',
            code: 'D'
        },
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Tuần',
            code: 'W'
        },
        {
            name: 'Năm',
            code: 'Y',
        }
    ];

    public static getUnitName(code) {
        for (let item of this.unitDates) {
            if (item.code == code) return item.name;
        }
        return '';
    }
    public static ACTION_CREATE = 2;
    public static ACTION_UPDATE = 1;
}

export class ApproveConst {
    public static dataType = [
        {
            name: 'Người dùng',
            code: 1,
        },
        {
            name: 'Nhà đầu tư',
            code: 2,
        },
        {
            name: 'Khách hàng doanh nghiệp',
            code: 3,
        },
        {
            name: 'Lô trái phiếu',
            code: 4,
        },
        {
            name: 'Bán theo kỳ hạn',
            code: 5,
        },
        {
            name: 'Tệp tin hợp đồng',
            code: 6,
        },
        {
            name: 'Sale',
            code: 8,
        },
        {
            name: 'Nhà đầu tư chuyên nghiệp',
            code: 10,
        },
    ];
    public static STATUS_USER = 1;
    public static STATUS_INVESTOR = 2;
    public static STATUS_BUSINESS_CUSTOMER = 3;
    public static STATUS_PRO_BOND_INFO = 4;
    public static STATUS_PRO_BOND_SECONDARY = 5;
    public static STATUS_DISTRI_CONTRACT_FILE = 6;
    public static STATUS_SALE = 8;
    public static STATUS_INVESTOR_PRO = 10;
    public static STATUS_INVESTOR_PHONE = 12;
    public static STATUS_INVESTOR_EMAIL = 13;

    public static getDataTypesName(code) {
        let dataType = this.dataType.find(dataType => dataType.code == code);
        if (dataType) return dataType.name;
        return '';
    }

    public static status = [
        {
            name: 'Trình duyệt',
            code: 1,
            severity: 'warning',
        },
        {
            name: 'Đã duyệt',
            code: 2,
            severity: 'success',
        },
        {
            name: 'Hủy',
            code: 3,
            severity: 'danger',
        },
    ];

    public static statusConst = [
        {
            name: 'Trình duyệt',
            code: 1,
            severity: 'warning',
        },
        {
            name: 'Đã duyệt',
            code: 2,
            severity: 'success',
        },
        {
            name: 'Hủy',
            code: 3,
            severity: 'danger',
        },

    ];


    public static STATUS_ACTIVE = 1;
    public static STATUS_DISABLE = 2;
    public static STATUS_CLOSE = 3;

    public static getStatusSeverity(code) {
        let status = this.status.find(status => status.code == code);
        if (status) return status.severity;
        return '';
    }

    public static getStatusName(code) {
        let status = this.status.find(status => status.code == code);
        if (status) return status.name;
        return '';
    }

    public static actionType = [
        {
            name: 'Thêm',
            code: 1,
            severity: 'success',
        },
        {
            name: 'Sửa',
            code: 2,
            severity: 'warning',
        },
        {
            name: 'Xoá',
            code: 3,
            severity: 'danger',
        },
    ];
    public static actionTypeApprove = [
        {
            name: 'Thêm',
            code: 1,
            severity: 'success',
        },
        {
            name: 'Sửa',
            code: 2,
            severity: 'warning',
        }
    ];

    public static getActionTypeSeverity(code) {
        let actionType = this.actionType.find(actionType => actionType.code == code);
        if (actionType) return actionType.severity;
        return '';
    }
    public static ACTION_ADD = 1;
    public static ACTION_UPDATE = 2;
    public static ACTION_DELETE = 3;

    public static getActionTypeName(code) {
        let actionType = this.actionType.find(actionType => actionType.code == code);
        if (actionType) return actionType.name;
        return '';
    }

    //
    // public static types = [
    //     {
    //         name: 'Tổ chức',
    //         code: 'B',
    //     },
    //     {
    //         name: 'Cá nhân',
    //         code: 'I',
    //     },

    // ];

    // public static getNameType(code) {
    //     let type = this.types.find(type => type.code == code);
    //     if(type) return type.name;
    //     return '';
    // }
}

export class PartnerConst {
    public static status = [
        {
            name: 'Kích hoạt',
            code: 'A',
            severity: 'success',
        },
        {
            name: 'Không kích hoạt',
            code: 'D',
            severity: 'secondary',
        },
        {
            name: 'Đóng',
            code: 'C',
            severity: 'danger',
        },
    ];

    public static STATUS_ACTIVE = 'A';
    public static STATUS_DISABLE = 'D';
    public static STATUS_CLOSE = 'C';

    public static getStatusInfo(code, field) {
        let status = this.status.find(status => status.code == code);
        if (status) return status[field];
        return '';
    }
}

export class CollabContractConst {
    public static list = [
        {
            name: "Trình duyệt",
            code: 0,
        },
        {
            name: "Duyệt",
            code: 1,
        },
    ]

    public static type = [
        { name: "Cá nhân", code: "I" },
        { name: "Doanh nghiệp", code: "B" },
    ]

    public static getType(code) {
        for (let item of this.type) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static RESPONSE_TRUE = 'A';
    public static RESPONSE_FALSE = 'D';

    public static getStatusName(code) {
        let list = this.list.find(list => list.code == code);
        if (list) return list.name;
        return '';
    }
}

export class BusinessCustomerConst {
    public static status = {
        HOAT_DONG: 2,
        HUY_DUYET: 3,
    }

    public static isCheckConst = [
        {
            name: 'Đã kiểm tra',
            code: 'Y'

        },
        {
            name: "Chưa kiểm tra",
            code: 'N'
        }
    ]

    public static statusList = [

        {
            name: 'Hoạt động',
            code: this.status.HOAT_DONG,
            severity: 'success',
        },
        {
            name: 'Hủy duyệt',
            code: this.status.HUY_DUYET,
            severity: 'danger',
        },
    ];

    public static getStatusName(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getStatusSeverity(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.severity;
        }
        return '';
    }
}

export class BusinessCustomerApproveConst {
    public static PAGE_DETAIL_APPROVE = 'approve';
    
    public static status = {
        KHOI_TAO: 1,
        CHO_DUYET: 2,
        DA_DUYET: 3,
        HUY_DUYET: 4,
    }

    

    public static statusList = [
        {
            name: 'Khởi tạo',
            severity: 'help',
            code: this.status.KHOI_TAO,
        },
        {
            name: 'Trình duyệt',
            severity: 'warning',
            code: this.status.CHO_DUYET,
        },
        {
            name: 'Đã duyệt',
            code: this.status.DA_DUYET,
            severity: 'success',
        },
        {
            name: 'Huỷ duyệt',
            code: this.status.HUY_DUYET,
            severity: 'danger',
        }
    ];

    public static getStatusName(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getStatusSeverity(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.severity;
        }
        return '';
    }

    // Bộ lọc tìm kiếm nhập keyword theo loại 
    public static fieldFilters = [
        {
            name: 'Mã số thuế',
            code: 2,
            field: 'keyword',
            placeholder: 'Nhập mã số thuế...',
        },
        {
            name: 'Số điện thoại',
            code: 3,
            field: 'phone',
            placeholder: 'Nhập số điện thoại...',
        },
        {
            name: 'Email',
            code: 4,
            field: 'email',
            placeholder: 'Nhập email...',
        },
        {
            name: 'Tên doanh nghiệp',
            code: 1,
            field: 'name',
            placeholder: 'Nhập tên doanh nghiệp...',
        },
    ];
    
    public static getInfoFieldFilter(field, attribute: string) {
        const fieldFilter = this.fieldFilters.find(fieldFilter => fieldFilter.field == field);
        return fieldFilter ? fieldFilter[attribute] : null;
    }

}

export class ProductBondSecondaryConst {

    public static getAllowOnlineTradings(code) {
        for (let item of this.allowOnlineTradings) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static allowOnlineTradings = [
        {
            name: 'Cho phép',
            code: 'Y'
        },
        {
            name: 'Không cho phép',
            code: 'N'
        }
    ];

    public static STATUS = {
        NHAP: 1,
        TRINH_DUYET: 2,
        HOAT_DONG: 3,
        CLOSED: 4,
    }

    public static statusList = [
        {
            name: 'Khởi tạo',
            severity: 'help',
            code: this.STATUS.NHAP,
        },
        {
            name: 'Trình duyệt',
            code: this.STATUS.TRINH_DUYET,
            severity: 'warning',
        },
        {
            name: 'Hoạt động',
            code: this.STATUS.HOAT_DONG,
            severity: 'success',
        },
        {
            name: 'Đóng',
            code: this.STATUS.CLOSED,
            severity: 'secondary',
        }
    ];

    public static getStatusName(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getStatusSeverity(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.severity;
        }
        return '';
    }
}
export class ProductBondPolicyTemplateConst {
    public static type = [
        {
            name: 'Ngày bán cố định',
            code: 1,
        },
        {
            name: 'Ngày bán thay đổi',
            code: 2,
        }
    ];
    public static classify = [
        {
            name: 'PRO',
            code: 1,
        },
        {
            name: 'PRO A',
            code: 2,
        },
        {
            name: 'PNote',
            code: 3,
        },
    ];

    public static investorType = [
        {
            name: 'Chuyên nghiệp',
            code: 'P',
        },
        {
            name: 'Tất cả',
            code: 'A',
        }
    ];

    public static isTransfer = [
        {
            name: 'Có',
            code: 'Y',
        },
        {
            name: 'Không',
            code: 'N',
        }
    ];

    public static status = [
        {
            name: "Kích hoạt",
            code: "A",
            severity: 'success'
        },
        {
            name: "Không kích hoạt",
            code: "D",
            severity: 'warning'
        }
    ];
    public static KICH_HOAT = 'A';
    public static KHONG_KICH_HOAT = 'D';

    public static getSeverityStatus(code) {
        const status = this.status.find(p => p.code == code);
        return status ? status.severity : '-';
    }
    public static getNameStatus(code) {
        let type = this.status.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameType(code) {
        let type = this.type.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameClassify(code) {
        let type = this.classify.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameInvestorType(code) {
        let type = this.investorType.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }
    public static getNameIsTransfer(code) {
        let type = this.isTransfer.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }
}

export class ProductBondPolicyDetailTemplateConst {
    public static interestPeriodType = [
        {
            name: 'Ngày',
            code: 'D'
        },
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Năm',
            code: 'Y'
        }
    ];
    public static interestType = [
        {
            name: 'Định kỳ',
            code: 1,
        },
        {
            name: 'Cuối kỳ',
            code: 2,
        }
    ];

    public static INTEREST_RATE_TYPE_PERIODIC = 1;
    public static INTEREST_RATE_TYPE_PERIOD_END = 2;

    public static INTEREST_PERIOD_TYPE_MONTH = 'M';
    public static INTEREST_PERIOD_TYPE_YEAR = 'Y';

    public static status = [
        {
            name: "Kích hoạt",
            code: "A",
            severity: 'success'
        },
        {
            name: "Không kích hoạt",
            code: "D",
            severity: 'warning'
        }
    ];

    public static getSeverityStatus(code) {
        const status = this.status.find(p => p.code == code);
        return status ? status.severity : '-';
    }

    public static getNameStatus(code) {
        let type = this.status.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameInterestPeriodType(code) {
        let type = this.interestPeriodType.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getNameInterestType(code) {
        let type = this.interestType.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

}

export class OrderConst {

    public static interestTypes = [
        {
            name: 'Có',
            code: 'Y',
        },
        {
            name: 'Không',
            code: 'N',
        }
    ];

    public static INTEREST_TYPE_YES = 'Y';
    public static INTEREST_TYPE_NO = 'N';

    public static sources = [
        {
            name: 'Online',
            code: 1,
        },
        {
            name: 'Offline',
            code: 2,
        },
        {
            name: 'Sale đặt lệnh',
            code: 3,
        }
    ];

    public static SOURCE_ONLINE = 1;
    public static SOURCE_OFFLINE = 2;

    public static getNameSource(code) {
        let source = this.sources.find(type => type.code == code);
        return source ? source.name : '';
    }

    public static getNameInterestType(code) {
        let type = this.interestTypes.find(type => type.code == code);
        return type ? type.name : '';
    }

    public static KHOI_TAO = 1;
    public static CHO_THANH_TOAN = 2;
    public static CHO_KY_HOP_DONG = 3;
    public static CHO_DUYET_HOP_DONG = 4;
    public static DANG_DAU_TU = 5;
    public static PHONG_TOA = 6;
    public static GIAI_TOA = 7;

    public static status = [
        {
            name: "Khởi tạo",
            code: 1,
            severity: 'help',
            backLink: '/trading-contract/order',
        },
        {
            name: "Chờ thanh toán",
            code: 2,
            severity: 'warning',
            backLink: '/trading-contract/order',
        },
        {
            name: "Chờ ký hợp đồng",
            code: 3,
            severity: "help",
            backLink: '/trading-contract/order',
        },
        {
            name: "Chờ duyệt hợp đồng",
            code: 4,
            severity: 'danger',
            backLink: '/trading-contract/contract-processing',
        },
        {
            name: "Đang đầu tư",
            code: 5,
            severity: 'success',
            backLink: '/trading-contract/contract-active',
        },
        {
            name: "Phong toả",
            code: 6,
            severity: 'danger',
            backLink: '/trading-contract/contract-blockage',
        },
        {
            name: "Giải tỏa",
            code: 7,
            severity: 'success',
            backLink: '/trading-contract/contract-blockage',
        },
    ];

    public static getSeverityStatus(code) {
        const status = this.status.find(p => p.code == code);
        return status ? status.severity : '-';
    }

    public static getNameStatus(code) {
        let type = this.status.find(type => type.code == code);
        if (type) return type.name;
        return '';
    }

    public static getBackLink(code) {
        const status = this.status.find(type => type.code == code);
        return status ? status.backLink : '/';
    }

}


export class MediaNewsConst {

    public static positionList = [
        {
            name: "Banner popup",
            code: 'banner_popup'
        },
        {
            name: "Slide ảnh",
            code: 'slide_image'
        },
        {
            name: "Banner trên top",
            code: 'banner_top'
        },
        {
            name: "Hôm nay có gì hot",
            code: 'hot_today'
        },
        {
            name: "Dành cho bạn",
            code: 'just_for_you'
        },
        {
            name: "Vì sao sử dụng epic",
            code: 'vi_sao_su_dung_epic'

        },
        {
            name: "Video",
            code: 'videos'

        }
    ];

    public static getPositionName(code) {
        for (let item of this.positionList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static typeList = [
        {
            name: "Trang khám phá",
            code: 'kham_pha'
        },
        {
            name: "Trang đầu tư",
            code: 'dau_tu'
        },
        {
            name: "Trang tài sản",
            code: 'tai_san'
        },
        {
            name: "Sản phẩm",
            code: 'san_pham'
        },
        {
            name: "Sản phẩm đầu tư",
            code: 'san_pham_dau_tu'
        },
        {
            name: "Trang mua BĐS",
            code: 'mua_bds'
        },
        {
            name: "Trang thuê BĐS",
            code: 'thue_bds'
        }
    ];
    public static statusList = [
        {
            name: "Đã đăng",
            code: 'ACTIVE',
            severity: 'success'
        },
        {
            name: "Trình duyệt",
            code: 'PENDING',
            severity: 'warning'
        },
        {
            name: "Đã xóa",
            code: 'DELETED',
            severity: 'dark'
        },
        {
            name: "Bản nháp",
            code: 'DRAFT',
            severity: 'secondary'
        }
    ];
    public static categoryList = [
        {
            name: "Tài chính cá nhân",
            code: 'FINANCE'
        },
        {
            name: "Cẩm nang",
            code: 'CAM_NANG'
        },
        {
            name: "Xu hướng",
            code: 'TRENDING'
        },
        {
            name: "Đầu tư",
            code: 'INVESTMENT'
        },
        {
            name: "Bảo mật",
            code: 'BAO_MAT'
        },
        {
            name: "Quy trình xử lý",
            code: 'QUY_TRINH_XU_LY'
        }
    ];

}


export class NotificationTemplateConst{
    public static status = [
        {
            name: 'Kích hoạt',
            code: 'ACTIVE',
            severity: 'success'
        },
        {
            name: 'Huỷ kích hoạt',
            code: 'INACTIVE',
            severity: 'secondary'
        },
    ];

    public static HUY_KICH_HOAT = 'INACTIVE';
    public static KICH_HOAT = 'ACTIVE';
}



export class InvestorConst {

    public static FACE_IMAGE_SIMILARITY_LOW = 50;

    public static FACE_IMAGE_SIMILARITY_HIGH = 80;

    public static sources = [
        {
            name: 'Online',
            code: 1,
            severity: 'success'

        },
        {
            name: 'Offline',
            code: 2,
            severity: 'secondary'
        },
    ];

    public static getInfoSource(code, field) {
        const source = this.sources.find(type => type.code == code);
        return source ? source[field] : null;
    }

    public static sourcesCreate = [
        {
            name: 'Online',
            code: 1,
            severity: 'success'

        },
        {
            name: 'Offline',
            code: 2,
            severity: 'secondary'
        },
        {
            name: 'Sale',
            code: 3,
            severity: 'help'
        },
    ];
    public static getSourceCreate(code, field) {
        const source = this.sourcesCreate.find(type => type.code == code);
        return source ? source[field] : null;
    }

    public static SOURCE_ONL = 1;
    public static SOURCE_OFF = 2;

    public static listStock = [
        {
            name: 'Công ty cổ phần chứng khoán Tiên Phong - TPS',
            severity: 'help',
            code: 1,
        },
        // {
        //     name: 'Trình duyệt',
        //     code: this.STATUS.TRINH_DUYET,
        //     severity: 'warning',
        // },
        // {
        //     name: 'Hủy duyệt',
        //     code: this.STATUS.HUY,
        //     severity: 'danger',
        // },
    ];

    public static userType  = [
        {
            name: "Epic Center",
            code: 'I',
            severity: 'success'
        },
        {
            name: "Epic CMS",
            code: 'E',
            severity: 'help'
        },
        {
            name: "Epic CMS",
            code: 'P',
            severity: 'help'
        },
        {
            name: "Epic CMS",
            code: 'T',
            severity: 'help'
        },
        {
            name: "Epic CMS",
            code: 'RP',
            severity: 'help'
        },
        {
            name: "Epic CMS",
            code: 'RT',
            severity: 'help'
        },
        {
            name: "Sale",
            code: 'S',
            severity: 'help'
        }
    ];

    public static TEMP = {
        YES: 1,
        NO: 0
    };

    public static ID_TYPES = {
        PASSPORT: 'PASSPORT',
        CMND: 'CMND',
        CCCD: 'CCCD',
    }

    public static SEX = {
        MALE: 'M',
        FEMALE: 'F',
    }

    public static isCheckConst = [
        {
            name: 'Đã kiểm tra',
            code: 'Y'

        },
        {
            name: "Chưa kiểm tra",
            code: 'N'
        }
    ]

    public static isProConst = [
        {
            name: 'Chuyên nghiệp',
            code: 'Y'

        },
        {
            name: "Không chuyên",
            code: 'N'
        }
    ]

    public static SEX_NAME = {
        [this.SEX.MALE]: 'Nam',
        [this.SEX.FEMALE]: 'Nữ',
    }


    public static ListSex = [
        {
            name: this.SEX_NAME[this.SEX.MALE],
            code: this.SEX.MALE,
        },
        {
            name: this.SEX_NAME[this.SEX.FEMALE],
            code: this.SEX.FEMALE,
        },
    ]

    public static IdTypes = [
        {
            name: 'Căn cước công dân',
            code: this.ID_TYPES.CCCD
        },
        {
            name: 'Chứng minh nhân dân',
            code: this.ID_TYPES.CMND
        },
        {
            name: 'Hộ chiếu',
            code: this.ID_TYPES.PASSPORT
        }
    ]

    public static STATUS = {
        KHOI_TAO: '1',
        TRINH_DUYET: '2',
        DUYET: '3',
        HUY: '4',
        XAC_MINH: '5',
    }

    public static statusListApprove = [
        {
            name: 'Khởi tạo',
            severity: 'help',
            code: this.STATUS.KHOI_TAO,
        },
        {
            name: 'Trình duyệt',
            code: this.STATUS.TRINH_DUYET,
            severity: 'warning',
        },
        {
            name: 'Hủy duyệt',
            code: this.STATUS.HUY,
            severity: 'danger',
        },
        {
            name: 'Đã duyệt',
            code: this.STATUS.DUYET,
            severity: 'success',
        },
    ];

    public static statusList = [
        {
            name: 'Khởi tạo',
            severity: 'help',
            code: this.STATUS.KHOI_TAO,
        },
        {
            name: 'Trình duyệt',
            code: this.STATUS.TRINH_DUYET,
            severity: 'warning',
        },
        {
            name: 'Hoạt động',
            code: this.STATUS.DUYET,
            severity: 'success',
        },
        {
            name: 'Hủy duyệt',
            code: this.STATUS.HUY,
            severity: 'danger',
        },
        {
            name: 'Duyệt',
            code: this.STATUS.XAC_MINH,
            severity: 'success',
        },
    ];

    public static statusApproved = [
        {
            name: 'Hoạt động',
            severity: 'success',
            code: 'A',
        },
        {
            name: 'Sai thông tin',
            severity: 'secondary',
            code: 'D',
        },
    ];

    public static getInfoStatusApproved(code, property) {
        let status = this.statusApproved.find(s => s.code == code);
        return status ? status[property] : null;
    }

    public static getUserTypeName(code) {
        for (let item of this.userType) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getUserTypeSeverity(code) {
        for (let item of this.userType) {
            if (item.code == code) return item.severity;
        }
        return '';
    }

    /**
     * GET TEN TRANG THAI
     * @param code 
     * @returns 
     */
    public static getStatusName(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getStatusApproveName(code) {
        for (let item of this.statusListApprove) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getListStockName(code) {
        for (let item of this.listStock) {
            if (item.code == code) return item.name;
        }
        return '';
    }

    public static getSexName(code) {
        const found = this.ListSex.find(o => o.code === code);
        return found ? found.name : '';
    }

    /**
     * GET SEVERITY CUA TRANG THAI
     * @param code 
     * @returns 
     */
    public static getStatusSeverity(code) {
        for (let item of this.statusList) {
            if (item.code == code) return item.severity;
        }
        return '';
    }

    public static getStatusApproveSeverity(code) {
        for (let item of this.statusListApprove) {
            if (item.code == code) return item.severity;
        }
        return '';
    }

    /**
     * GET NAME LOAI GIAY TO THEO CODE
     * @param code 
     * @returns 
     */
    public static getIdTypeName(code: string) {
        const found = this.IdTypes.find(o => o.code === code);
        return found ? found.name : '';
    }

    //
    public static fieldFilters = [
        {
            name: 'Số điện thoại',
            code: 3,
            field: 'phone',
            placeholder: 'Nhập số điện thoại...',
        },
        
        {
            name: 'Mã khách hàng',
            code: 2,
            field: 'cifCode',
            placeholder: 'Nhập mã khách hàng...',
        },
        {
            name: 'Số CMND/CCCD',
            code: 4,
            field: 'idNo',
            placeholder: 'Nhập số cmnd/cccd...',
        },
        {
            name: 'Email',
            code: 5,
            field: 'email',
            placeholder: 'Nhập email...',
        },
        {
            name: 'Họ tên',
            code: 1,
            field: 'fullname',
            placeholder: 'Nhập họ tên...',
        },
    ];
    
    public static getInfoFieldFilter(field, attribute: string) {
        const fieldFilter = this.fieldFilters.find(fieldFilter => fieldFilter.field == field);
        return fieldFilter ? fieldFilter[attribute] : null;
    }
}

export class MediaConst {

    public static mediaStatus = {
        ACTIVE: 'Đã đăng',
        PENDING: 'Trình duyệt',
        DELETED: 'Đã xoá',
        DRAFT: 'Bản nháp'
    }
    public static statusSeverity = {
        ACTIVE: 'success',
        PENDING: 'warning',
        DELETED: 'danger',
        DRAFT: 'secondary'
    }

    public static newsTypes = {
        PURE_NEWS: 'Tin tức', //Tin tức thuần
        SHARING: 'Chia sẻ từ KOL', //Chia sẻ từ KOL
        PROMOTION: 'Ưu đãi' //Ưu đãi
    }
    //[ 'FINANCE', 'TRENDING', 'INVESTMENT' ]
    public static knowledgeCategories = {
        FINANCE: 'Tài chính cá nhân', //Tin tức thuần
        TRENDING: 'Xu hướng', //Chia sẻ từ KOL
        INVESTMENT: 'Đầu tư', //Ưu đãi,
        CAM_NANG: 'Cẩm nang',
        BAO_MAT: 'Bảo mật',
        QUY_TRINH_XU_LY: 'Quy trình xử lý'
    }

    public static getStatusNews(code) {
        return this.mediaStatus[code];
    }

    public static getStatusSeverity(code) {
        return this.statusSeverity[code]
    }

    public static getNewsType(code) {
        return this.newsTypes[code]

    }

    public static getKnowledgeBaseCategory(code) {
        return this.knowledgeCategories[code]
    }

    public static ACTIVE = 'ACTIVE';
    public static TRINH_DUYET = 'PENDING';
    public static NHAP = 'DRAFT';

}

export class DepartmentConst {
    public static positions = [
        {
            name: 'Nhân viên',
            code: 2,
        },
        {
            name: 'Quản lý',
            code: 1,
        },
    ]

    public static MANAGER_SALE_1 = 1;
    public static MANAGER_SALE_2 = 2;
}

export class SaleConst {

    public static types = [
        {
            name: 'Nhân viên',
            code: 2,
        },
        {
            name: 'Cộng tác viên',
            code: 3,
        },
        {
            name: 'Quản lý',
            code: 1,
        },
    ];

    public static getNameSaleType(code){
        const type = this.types.find(s => s.code == code);
        return type.name ?? '';
    }

    public static customerTypes = [
        {
            name: 'Cá nhân',
            code: 'Y',
        },
        {
            name: 'Doanh nghiệp',
            code: 'N',
        },
    ]

    public static isInvestors = [
        {
            name: 'Cá nhân',
            code: 1,
        },
        {
            name: 'Doanh nghiệp',
            code: 2,
        },
    ]

    public static TYPE_MANAGER = 1;
    public static TYPE_EMPLOYEE = 2;
    public static TYPE_COLLABORATOR = 3;


    public static getInfoType(code, field: string) {
        const type = this.types.find(type => type.code == code);
        return type ? type[field] : null;
    }

    public static statusTemp = [
        {
            name: 'Khởi tạo',
            code: 1,
            severity: 'help'

        },
        {
            name: 'Trình duyệt',
            code: 2,
            severity: 'warning'
        },
        {
            name: 'Đã duyệt',
            code: 3,
            severity: 'success'
        },
        {
            name: 'Hủy duyệt',
            code: 4,
            severity: 'danger'
        }
    ];

    public static STATUSTEMP_TEMP = 1;
    public static STATUSTEMP_REQUEST = 2;
    public static STATUSTEMP_ACTIVE = 3;
    public static STATUSTEMP_CANCEL = 4;

    public static getInfoStatusTemp(code, field) {
        const statusTemp = this.statusTemp.find(type => type.code == code);
        return statusTemp ? statusTemp[field] : null;
    }

    public static sources = [
        {
            name: 'Online',
            code: 1,
            severity: 'success'

        },
        {
            name: 'Offline',
            code: 2,
            severity: 'secondary'
        },
    ];

    public static SOURCE_ONL = 1;
    public static SOURCE_OFF = 2;

    public static getInfoSource(code, field) {
        const source = this.sources.find(type => type.code == code);
        return source ? source[field] : null;
    }

    public static historyField = [
        {
            code: 'EmployeeCode',
            name: 'Mã nhân viên'
        },
        {
            code: 'SaleType',
            name: 'Loại Sale'
        },
        {
            code: 'DepartmentId',
            name: 'Phòng ban'
        },
        {
            code: 'SaleParentId',
            name: 'Người quản lý'
        },
        {
            code: 'BusinessCustomerBankAccId',
            name: 'Tài khoản ngân hàng'
        },
    ];

    public static getNameHistoryField(code) {
        const field = this.historyField.find(field => field.code == code);
        return field.name ?? "";
    }

    public static status = [
        {
            name: 'Kích hoạt',
            code: 'A',
            severity: 'success'
        },
        {
            name: 'Khóa',
            code: 'D',
            severity: 'secondary'
        },
    ];

    public static STATUS_ACTIVE = 'A';
    public static STATUS_BLOCK = 'D';

    public static getInfoStatus(code, field: string) {
        const status = this.status.find(type => type.code == code);
        return status ? status[field] : null;
    }
    //
    public static fieldFilters = [
        {
            name: 'Mã tư vấn viên',
            code: 1,
            field: 'referralCode',
            placeholder: 'Nhập mã tư vấn viên...',
        },
        {
            name: 'Họ tên',
            code: 2,
            field: 'investorName',
            placeholder: 'Nhập họ tên...',
        },
        {
            name: 'Mã nhân viên',
            code: 3,
            field: 'employeeCode',
            placeholder: 'Nhập mã nhân viên...',
        },
        {
            name: 'Số điện thoại',
            code: 4,
            field: 'phone',
            placeholder: 'Nhập số điện thoại...',
        },
        {
            name: 'Số CMND/CCCD',
            code: 5,
            field: 'idNo',
            placeholder: 'Nhập số cmnd/cccd...',
        },
        {
            name: 'Mã số thuế',
            code: 6,
            field: 'taxCode',
            placeholder: 'Nhập mã số thuế ...',
        }
    ];
    
    public static getInfoFieldFilter(field, attribute: string) {
        const fieldFilter = this.fieldFilters.find(fieldFilter => fieldFilter.field == field);
        return fieldFilter ? fieldFilter[attribute] : null;
    }

    public static statusRegister = [
        {
            name: 'Đăng ký mới',
            code: 1,
            severity: 'help'

        },
        {
            name: 'Đã điều hướng',
            code: 2,
            severity: 'warning'
        },
        {
            name: 'Đã ký',
            code: 3,
            severity: 'success'
        },
        {
            name: 'Đã hủy',
            code: 4,
            severity: 'secondary'
        },
    ];

    public static getInfoStatusRegister(code, properties: string) {
        const status = this.statusRegister.find(status => status.code == code);
        return status ? status[properties] : null;
    }

}

export class StatusCoupon {
    public static list = [
        {
            name: 'Đến hạn',
            code: 1,
        },
        {
            name: 'Chưa đến hạn',
            code: 2,
        },
    ]

    public static getName(code) {
        const status = this.list.find(item => item.code == code);
        return status ? status.name : '';
    }
}

export const KeyFilter = {
    blockSpecial: new RegExp(/^[^~!@#$%^&*><:;+=_]+$/),
    numberOnlyBlockSpecial: new RegExp(/^[^\sA-Za-záàảãạâấầẩẫậăắằẳẵặóòỏõọôốồổỗộơớờởỡợéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÉÈẺẼẸÊẾỀỂỄỆÚÙỦŨỤƯỨỪỬỮỰÍÌỈĨỊÝỲỶỸỴĐ~!@#$%^&*><:;+=_,/-]+$/),
    stringOnlyBlockSpecial: new RegExp(/^[^0-9`~!@#$%^&*><:;+=_,/-]+$/),
    decisionNoBlockSpecial: new RegExp(/^[^\sáàảãạâấầẩẫậăắằẳẵặóòỏõọôốồổỗộơớờởỡợéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịýỳỷỹỵđÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÉÈẺẼẸÊẾỀỂỄỆÚÙỦŨỤƯỨỪỬỮỰÍÌỈĨỊÝỲỶỸỴĐ~!@#$%^&*><:;+=_,]+$/),
}

export class UserConst {

    public static STATUS = {
        DEACTIVE: 'D',
        ACTIVE: 'A',
        TEMPORARY: 'T',
        LOCK: 'L',
    }

    public static STATUS_NAME = {
        [this.STATUS.DEACTIVE]: 'Bị khoá',
        [this.STATUS.ACTIVE]: 'Hoạt động',
        [this.STATUS.TEMPORARY]: 'Tạm',
        [this.STATUS.LOCK]: 'Đã xóa',
    }

    public static STATUS_SEVERITY = {
        [this.STATUS.DEACTIVE]: 'cancel',
        [this.STATUS.ACTIVE]: 'success',
        [this.STATUS.TEMPORARY]: 'warning',
        [this.STATUS.LOCK]: 'warning',
    }

}

export class IsSignPdfConst{
    public static YES = 'Y';
    public static NO = 'N';
}

export class SaleStatusConst{
    public static TRUE = 1;
    public static FALSE = 2;
}

export class FormNotificationConst{
    public static IMAGE_APPROVE = "IMAGE_APPROVE";
    public static IMAGE_CLOSE = "IMAGE_CLOSE";
}

export class PathConst{
    public static AVATAR_GENNERAL_DEFAULT = "assets/layout/images/image-bg-default.png";
}


export class PaymentManagerConst {
    public static statusName = {
        1: { name: "Chưa xử lý", color: "warning" },
        2: { name: "Đã xử lý", color: "success" }
    }
    public static status = [
        {
            name: 'Đã xử lý',
            code: '2'
        },
        {
            name: 'Chưa xử lý',
            code: '1'
        }
    ];

    public static fieldFilters = [
        {
            name: 'Số điện thoại',
            code: 3,
            field: 'phone',
            placeholder: 'Nhập số điện thoại...',
        },
        {
            name: 'Họ tên',
            code: 1,
            field: 'fullname',
            placeholder: 'Nhập họ tên...',
        },
        
        {
            name: 'Mã khách hàng',
            code: 4,
            field: 'cifCode',
            placeholder: 'Nhập mã khách hàng...',
        },
       
    ];
    
    public static getInfoFieldFilter(field, attribute: string) {
        const fieldFilter = this.fieldFilters.find(fieldFilter => fieldFilter.field == field);
        return fieldFilter ? fieldFilter[attribute] : null;
    }

}

export class ExportReportConst {
    public static BC_DS_SALER = 1;
    public static BC_DS_KHACH_HANG = 2;
    public static BC_DS_KHACH_HANG_ROOT = 3;
    public static BC_DS_NGUOI_DUNG = 4;
    public static BC_DS_KHACH_HANG_HVF = 5;
    public static BC_DS_SKTK_NHA_DAU_TU = 6;
    public static BC_THAY_DOI_TT_KHACH_HANG = 7;
    public static BC_THAY_DOI_TT_KHACH_HANG_ROOT = 8;
}

export class WhitelistIpConst {

    public static type = [
        {
            name: 'Duyệt hợp đồng',
            code: 1,
            type: 'TRADING',
        },
        {
            name: 'Duyệt vào tiền',
            code: 2,
            type: 'TRADING',
        },
        {
            name: 'Duyệt chi tiền',
            code: 3,
            type: 'TRADING',
        },
        {
            name: 'Thông tin đầu tư khách TPS',
            code: 4,
            type: 'ROOT',
        },
        {
            name: 'Thông tin đầu tư khách Telesale',
            code: 5,
            type: 'ROOT',
        },
    ];

    public static getName(code) {
        const status = this.type.find(item => item.code == code);
        return status ? status.name : '';
    }
}

export class MSBPrefixAccountConst {

    public static ID_MSB_BANK = 26

    public static type = [
        {
            name: '1',
            code: 1,
        },
        {
            name: '2',
            code: 2
        },
        {
            name: '3',
            code: 3,
        },
    ];

    public static getName(code) {
        const status = this.type.find(item => item.code == code);
        return status ? status.name : '';
    }
}

export class NotVerifiedConst {
    public static status = [
        {
            name: 'Hoạt động',
            code: 'A',
            severity: 'success',
        },
        {
            name: 'Khởi tạo',
            code: 'T',
            severity: 'help',
        },
        {
            name: 'Đang khóa',
            code: 'D',
            severity: 'secondary',
        },
        {
            name: 'Đã xóa',
            code: 'L',
            severity: 'warning',
        },
    ];

    public static source = [
        {
            name: 'Epic Center',
            code: 1,
         
        },
        {
            name: 'ECore',
            code: 2,
            
        },
        {
            name: 'Sale',
            code: 3,
           
        },
       
    ];

    public static STATUS_ACTIVE = 'A';
    public static STATUS_LOCKED = 'D';

    public static STEP_BAT_DAU = 1;
    public static STEP_DA_DANG_KY = 2;
    public static STEP_DA_EKYC = 3;

    public static getStatusInfo(code, field) {
        let status = this.status.find(status => status.code == code);
        if (status) return status[field];
        return '';
    }

    public static getSourceInfo(code, field) {
        let source = this.source.find(source => source.code == code);
        if (source) return source[field];
        return '';
    }
}

export class ErrorBankConst { 

    public static LOI_KET_NOI_MSB = 1505;
    public static SO_TK_KHONG_TON_TAI = 2036;
}

export class SendNotifySizeConst { 

    public static list = [
        {
            code: 1,
            name: 'Từng trang',
        },
        {
            code: 2,
            name: 'Tất cả',
        },
    ]

    public static PAGE = 1;
    public static FULL = 2;
}

export const sloganWebConst = [
    // "Việc gì khó, đã có EMIR lo!",
    "Đừng bao giờ sợ thất bại. Bạn chỉ cần đúng có một lần trong đời thôi - CEO của Starbucks!",
    "Luôn bắt đầu với mong đợi những điều tốt đẹp sẽ xảy ra – Tom Hopkins!",
    "Nơi nào không có cạnh tranh, nơi đó không có thị trường!",
    "Kẻ chiến thắng không bao giờ bỏ cuộc; kẻ bỏ cuộc không bao giờ chiến thắng!",
    // "Nhất cận thị, nhì cận giang, muốn giàu sang thì…cận sếp!",
    "Công việc quan trọng nhất luôn ở phía trước, không bao giờ ở phía sau bạn!",
    "Chúng ta có thể gặp nhiều thất bại, nhưng chúng ta không được bị đánh bại!",
    "Điều duy nhất vượt qua được vận may là sự chăm chỉ. – Harry Golden!",
    "Muốn đi nhanh thì đi một mình. Muốn đi xa thì đi cùng nhau!",
    "Đôi lúc bạn đối mặt với khó khăn không phải vì bạn làm điều gì đó sai mà bởi vì bạn đang đi đúng hướng!",
    "Điều quan trọng không phải vị trí đứng mà hướng đi. Mỗi khi có ý định từ bỏ, hãy nghĩ đến lý do mà bạn bắt đầu!",
    "Cách tốt nhất để dự đoán tương lai là hãy tạo ra nó!",
    "Kỷ luật là cầu nối giữa mục tiêu và thành tựu!",
    "Di chuyển nhanh và phá vỡ các quy tắc. Nếu vẫn chưa phá vỡ cái gì, chứng tỏ bạn di chuyển chưa đủ nhanh!",
    "Đằng nào thì bạn cũng phải nghĩ, vì vậy sao không nghĩ lớn luôn? - Donald Trump!",
    "Những khách hàng không hài lòng sẽ là bài học tuyệt vời cho bạn - Bill Gates!",
    "Nếu mọi người thích bạn, họ sẽ lắng nghe bạn, nhưng nếu họ tin tưởng bạn, họ sẽ làm kinh doanh với bạn!",
    "Hoàn cảnh thuận lợi luôn chứa đựng những yếu tố nguy hiểm. Hoàn cảnh khó khăn luôn giúp ta vững vàng hơn!",
];

export class ReplaceIdentificationConst { 

    public static reason = [
        {
            code: 1,
            name: 'Giấy tờ bị mờ',
        },
        {
            code: 2,
            name: 'Giấy tờ bị rách',
        },
        {
            code: 3,
            name: 'Giấy tờ hết hạn',
        },
        {
            code: 4,
            name: 'Khác',
        },
    ];
    public static KHAC = 4;

}

export class ActiveDeactiveConst {

    public static ACTIVE = 'A';
    public static DEACTIVE = 'D';

    public static list = [
        {
            name: 'Kích hoạt',
            code: this.ACTIVE,
            severity: 'success',

        },
        {
            name: 'Khóa',
            code: this.DEACTIVE,
            severity: 'secondary',
                
        }
    ];

    public static getInfo(code, atribution = 'name') {
        let status = this.list.find(s => s.code == code);
        return status ? status[atribution] : null;
    }
}
