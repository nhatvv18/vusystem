import { IConstant, IDropdown } from "./interface/InterfaceConst.interface";

export class AppConsts {
    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static redicrectHrefOpenDocs = "https://docs.google.com/viewerng/viewer?url=";
    static baseUrlHome: string;

    static readonly grantType = {
        password: 'password',
        refreshToken: 'refresh_token',
    };

    static readonly messageError = "Có lỗi xảy ra. Vui lòng thử lại sau ít phút!";

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
    static ApproveConst: any;
}


export class PermissionLoyaltyConst {

    private static readonly Web: string = "web_";
    private static readonly Menu: string = "menu_";
    private static readonly Tab: string = "tab_";
    private static readonly Page: string = "page_";
    private static readonly Table: string = "table_";
    private static readonly Form: string = "form_";
    private static readonly ButtonTable: string = "btn_table_";
    private static readonly ButtonForm: string = "btn_form_";
    private static readonly ButtonAction: string = "btn_action_";

    public static readonly GarnerModule: string = "eloyalty.";
    //
    public static readonly GarnerPageDashboard: string = `${PermissionLoyaltyConst.GarnerModule}${PermissionLoyaltyConst.Page}dashboard`;
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
    public static TYPE_PARTNERS = ['P', 'RP'];  // PARTNERROOT HOẶC PARTNER
    public static TYPE_ROOTS = ['RP', 'RT'];  // PARTNERROOT HOẶC TRADINGROOT
    public static TYPE_TRADING = ['T', 'RT'];  // PARTNERROOT HOẶC TRADINGROOT

    public static getUserTypeInfo(code, property) {
        let type = this.list.find(t => t.code == code);
        if (type) return type[property];
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

export class StatusDeleteConst {
    public static list = [
        {
            name: 'Đã xóa',
            code: 'Y',
        },
        {
            name: 'Chưa xóa',
            code: 'N',
        },
    ]

    public static DELETE_TRUE = 'Y';
    public static DELETE_FALSE = 'N';
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

export class UnitDateConst {
    public static list = [
        {
            name: 'Tháng',
            code: 'M'
        },
        {
            name: 'Ngày',
            code: 'D',
        },
        {
            name: 'Năm',
            code: 'Y',
        },
        
    ];

    public static getNameUnitDate(code, atribution ='name') {
        let unit = this.list.find(item => item.code == code);
        return unit ? unit[atribution] : null;
    }
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

export class SearchConst {
    public static DEBOUNCE_TIME = 1200;
}

export class FormNotificationConst {
    public static IMAGE_APPROVE = "IMAGE_APPROVE";
    public static IMAGE_CLOSE = "IMAGE_CLOSE";
}

export const OBJECT_CONFIRMATION_DIALOG = {
	DEFAULT_IMAGE: {
		IMAGE_APPROVE: 'assets/layout/images/icon-dialog/icon-approve-modalDialog.svg',
		IMAGE_CLOSE: 'assets/layout/images/icon-dialog/icon-close-modalDialog.svg',
	},
};

export class IndividualCustomer {
    public static keyStorage = 'individualCustomer';
    public static keyStorageDetailOffer = 'individualCustomerDetailOffer';
    public static listGender: IDropdown[] = [
        {
            value: 'M',
            label: 'Nam'
        },
        {
            value: 'F',
            label: 'Nữ'
        },
    ];
    public static listVoucherLevel: IDropdown[] = [
        {
            value: 1,
            label: 'Chưa cấp'
        },
        {
            value: 2,
            label: 'Đã cấp'
        },
    ];
    public static listAccountType: IDropdown[] = [
        {
            value: 1,
            label: 'Đã xác thực'
        },
        {
            value: 2,
            label: 'Chưa xác thực'
        },
    ];
    public static listClass: IDropdown[] = [
        {
            value: 1,
            label: 'Vàng'
        },
        {
            value: 2,
            label: 'Bạc'
        },
        {
            value: 3,
            label: 'Đồng'
        },
        {
            value: 4,
            label: 'Chưa xếp hạng'
        },
    ];
    public static listCardType: IDropdown[] = [];
    public static listMembershipClass: IDropdown[] = [];
    public static listVoucherType: IDropdown[] = [
        {
            value: 'C',
            label: 'Thẻ cứng'
        },
        {
            value: 'DT',
            label: 'Thẻ điện tử'
        },
    ];
    public static listStatus: IDropdown[] = [
        {
            value: 1,
            label: 'Kích hoạt'
        },
        {
            value: 2,
            label: 'Hủy kích hoạt'
        },
        {
            value: 3,
            label: 'Hết hạn'
        },
        {
            value: 4,
            label: 'Đã xóa'
        },
    ];
    public static listSex: IConstant[] = [
        {
            id: 'M',
            value: 'Nam'
        }, 
        {
            id: 'F',
            value: 'Nữ'
        },
    ];
    public static getStatus(code: string, atribution = 'label') {
        if (atribution === 'label') return !!code ? "Đã xác thực" : "Chưa xác thực";
        if (atribution === 'severity') return !!code ? "success" : "danger";
        return '';
    };
}

export class VoucherManagement {
    public static keyStorage = 'voucherManagement';
    public static KHOI_TAO = 0;
    public static KICH_HOAT = 1;
    public static HUY_KICH_HOAT = 2;
    public static DA_XOA = 3;
    public static HET_HAN = 4;

    public static listStatus: IDropdown[] = [
        {
            value: 0,
            label: 'Khởi tạo',
            severity: 'warning'
        },
        {
            value: 1,
            label: 'Kích hoạt',
            severity: 'success'
        },
        {
            value: 2,
            label: 'Hủy kích hoạt',
            severity: 'secondary'
        },
        {
            value: 3,
            label: 'Đã xóa',
            severity: 'danger'
        },
        {
            value: 4,
            label: 'Hết hạn',
            severity: 'info'
        },
    ];

    public static getStatus(code: string, atribution = 'label') {
        let status = this.listStatus.find(status => status.value === code);
        return status ? status[atribution] : '';
    };

    public static listVoucherType: IConstant[] = [
        {
            id: 'C',
            value: 'Cứng',
        },
        {
            id: 'DT',
            value: 'Điện tử',
        },
    ];

    public static listVoucherTypeDropdown: IDropdown[] = [
        {
            value: 'C',
            label: 'Thẻ cứng',
        },
        {
            value: 'DT',
            label: 'Thẻ điện tử',
        },
    ];

    public static CUSTOMER = {
        INDIVIDUAL: 0, // cá nhân
        BUSINESS: 1, // doanh nghiệp
    };
}

export const DEFAULT_MEDIA_RST = {
	DEFAULT_IMAGE: {
		IMAGE_ADD: 'assets/layout/images/add-image-bg.png'
	}
}

export const VIEW = "view";
export const CREATE = "create";
export const EDIT = "edit";