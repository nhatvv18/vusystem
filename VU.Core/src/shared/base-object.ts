export const OJBECT_SECONDARY_CONST = {
	POLICY: "policy",
	POLICY_DETAIL: "policyDetail",
	BASE: {
		SECODARY: {
			bondSecondaryId: 0,
			bondPrimaryId: 0,
			quantity: null,
			isClose: "N",
			openCellDate: null,
			closeCellDate: null,
			businessCustomerBankAccId: 0,
			status: "N",
			policies: [],
		},
		POLICY: {
			id: 0,
			fakeId: 0,
			tradingProviderId: 0,
			bondPrimaryId: 0,
			bondSecondaryId: 0,
			code: null, // Mã chính sách
			name: null, // Tên chính sách
			type: null, // Kiểu chính sách
			investorType: null, // Loại nhà đầu tư
			minMoney: null, // Số tiền đầu tư tối thổi
			incomeTax: null, // Thuế lợi nhuận
			transferTax: null, // Thuế chuyển nhượng
			isTransfer: "N", // Có cho phép chuyển nhượng không
			classify: 1, // Phân loại
			status: null, // Trạng thái
			details: [], // Chi tiết chính sách
		},
		POLICY_DETAIL: {
			id: 0,
			fakeId: 0,
			tradingProviderId: 0,
			bondSecondaryId: 0,
			policyId: 0,
			policyIndex: 0,
			stt: null, // Số thứ tự
			code: null, // Mã chính sách
			shortName: "", // Tên tắt
			interestType: 1, // Kiểu trả lãi
			interestPeriodQuantity: null, // Số kỳ trả
			interestPeriodType: null, // Kiểu kỳ trả lãi
			profit: null, // Lợi nhuận
			interestDays: null, // Số ngày
			isShowApp: "Y", //
			name: null, // Tên kỳ hạn
			status: null, // Trạng thái
		},
	}
};

export const OBJECT_INVESTOR_EKYC = {
	DEFAULT_IMAGE: {
		IMAGE_FRONT: 'assets/layout/images/front-image.png',
		IMAGE_BACK: 'assets/layout/images/back-image.png',
		IMAGE_PASSPORT: 'assets/layout/images/front-image.png',
		IMAGE_AVATAR: 'assets/layout/images/avatar.png',
	},
	MODAL_EKYC_TYPE: {
		ADD_IDENTIFICATION: 'ADD_IDENTIFICATION',
		CREATE_INVESTOR: 'CREATE_INVESTOR',
	}
};

export const OBJECT_CONFIRMATION_DIALOG = {
	DEFAULT_IMAGE: {
		IMAGE_APPROVE: 'assets/layout/images/icon-dialog/icon-approve-modalDialog.svg',
		IMAGE_CLOSE: 'assets/layout/images/icon-dialog/icon-close-modalDialog.svg',
	},
};