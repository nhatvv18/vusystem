export class IndividualCustomerModel {
  public id: number;
  public code: string;
  public name: string;
  public phoneNumber: string;
  public email: string;
  public gender: string;
  public class: string;
  public voucherNumber: number;
  public point: string;
  public event: string;
  public status: boolean;
}

export class IndividualCustomerDetailOverviewModel {
  public id: number | undefined = undefined;
  public code?: string = "";
  public name: string = "";
  public birthday: any = "";
  public gender: number | undefined = undefined;
  public referralCode: string = "";
  public numberPhone?: string = "";
  public email?: string = "";
  public cardType?: string = "";
  public cardNumber?: string = "";
  public address?: string = "";
  public joinDate?: any = "";

  public mapDTO(dto: any) {
    this.code = dto.cifCode;
    this.name = dto.defaultIdentification.fullname;
    this.birthday = dto.defaultIdentification.dateOfBirth
      ? new Date(dto.defaultIdentification.dateOfBirth)
      : "";
    this.gender = dto.defaultIdentification.sex;
    this.referralCode = dto.referralCodeSelf;
    this.numberPhone = dto.phone;
    this.email = dto.email;
    this.cardType = dto.defaultIdentification.idType;
    this.cardNumber = dto.defaultIdentification.idNo;
    this.address = dto.defaultContactAddress.contactAddress;
    this.joinDate = dto.createdDate ? new Date(dto.createdDate) : "";
  }
}

export class IndividualCustomerDetailAccumulateModel {
  public totalPoint?: string = "";
  public usePoint?: string = "";
  public remainPoint?: string = "";
  public membershipClass?: number = undefined;
}

export class IndividualCustomerDetailOfferModel {
  public voucherId: number;
  public voucherInvestorId: number;
  public name: string;
  public type: string;
  public value: string;
  public applyDate: string;
  public expireDate: string;
  public createDate: string;
  public createUser: number;
  public status: number;
}
