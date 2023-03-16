export class VoucherManagementModel {
  public voucherId: number;
  public voucherInvestorId: number;
  public name: string;
  public type: string;
  public value: string;
  public customer: string;
  public applyDate: string;
  public expireDate: string;
  public createDate: string;
  public deliveryDate: string;
  public status: number;
}

export class CreateOrEditVoucher {
  public voucherId?: number = undefined;
  public voucherInvestorId?: number = undefined;
  public avatar: string | undefined = undefined;
  public type: string | undefined = undefined;
  public name: string = "";
  public link: string = "";
  public point?: number = undefined;
  public value?: number = undefined;
  public applyDate?: any = "";
  public expireDate?: any = "";
  public contentType?: string = "";
  public content?: string = "";
  public createDate: any = "";
  public createUser: string = "";
  public individualId?: number = undefined;
  public businessId?: number = undefined;
  private _dataValidator: any[] = [];

  public get dataValidator() {
    return this._dataValidator;
  }

  public isValidName() {
    this._dataValidator = this._dataValidator.filter(
      (e: any) => e.name !== "name"
    );
    if (this.name && this.name.length) {
      return true;
    }
    this._dataValidator.push({
      name: "name",
      message: "Vui lòng nhập thông tin Tên voucher",
    });
    return false;
  }

  public isValidApplyDate() {
    this._dataValidator = this._dataValidator.filter(
      (e: any) => e.name !== "applyDate"
    );
    if (this.applyDate) {
      return true;
    }
    this._dataValidator.push({
      name: "applyDate",
      message: "Vui lòng chọn thông tin Ngày áp dụng",
    });
    return false;
  }

  public isValidLink() {
    this._dataValidator = this._dataValidator.filter(
      (e: any) => e.name !== "link"
    );
    if (
      (this.link && this.link.length && this.type === "DT") ||
      this.type === "C"
    ) {
      return true;
    }
    this._dataValidator.push({
      name: "link",
      message: "Vui lòng nhập thông tin Link voucher",
    });
    return false;
  }

  public isValidCustomer(isHasVoucherInvestor: boolean) {
    // khách hàng cá nhân
    this._dataValidator = this._dataValidator.filter(
      (e: any) => e.name !== "individualId"
    );
    if (!isHasVoucherInvestor || (isHasVoucherInvestor && this.individualId)) {
      return true;
    }
    this._dataValidator.push({
      name: "individualId",
      message: "Vui lòng chọn thông tin Khách hàng",
    });
    return false;
  }

  public isValidData(isHasVoucherInvestor: boolean) {
    return (
      this.isValidName() &&
      this.isValidApplyDate() &&
      this.isValidLink() &&
      this.isValidCustomer(isHasVoucherInvestor)
    );
  }

  public toObjectSendToAPI(isEdit: boolean) {
    let result: any = {
      voucherId: this.voucherId,
      avatar: this.avatar,
      name: this.name,
      voucherType: this.type,
      value: this.value,
      point: this.point,
      linkVoucher: this.type === "DT" ? this.link : "",
      descriptionContentType: this.type === "C" ? this.contentType : "",
      descriptionContent: this.type === "C" ? this.content : "",
      startDate: this.applyDate,
      endDate: this.expireDate,
    };
    if (!isEdit) {
      // CREATE
      result.listInvestorId = this.individualId
        ? [this.individualId]
        : undefined;
      result.listBussinessCustomerId = this.businessId
        ? [this.businessId]
        : undefined;
    } else {
      // EDIT
      result.listInvestor = this.individualId
        ? [{ investorId: this.individualId, voucherInvestorId: 0 }]
        : undefined;
      result.listBussinessCustomer = this.businessId
        ? [{ businessCustomerId: this.businessId, voucherInvestorId: 0 }]
        : undefined;
    }
    return result;
  }

  public mapData(dto: any) {
    if (dto) {
      this.voucherId = dto.voucherId;
      this.voucherInvestorId =
        dto.listInvestor && dto.listInvestor.length
          ? dto.listInvestor[0].voucherInvestorId
          : undefined;
      this.avatar = dto.avatar;
      this.type = dto.voucherType;
      this.name = dto.name;
      this.link = dto.linkVoucher;
      this.point = dto.point;
      this.value = dto.value;
      this.applyDate = dto.startDate ? new Date(dto.startDate) : "";
      this.expireDate = dto.endDate ? new Date(dto.endDate) : "";
      this.contentType = dto.descriptionContentType;
      this.content = dto.descriptionContent;
      this.createDate = dto.createdDate;
      this.createUser = dto.createdBy;
      this.individualId =
        dto.listInvestor && dto.listInvestor.length
          ? dto.listInvestor[0].investorId
          : undefined;
    }
  }
}

export class CustomerSearchModel {
  public id: number | undefined = undefined;
  public name: string = "";
  public numberPhone: string = "";
  public idNo?: string = "";
  public email: string = "";
  public abbreviation?: string = "";
  public taxCode?: string = "";
  public isSelected: boolean = false;
}

export class ApplyVoucher {
  public createDate: string = "";
  public createUser: string = "";
  public voucherId: number | undefined = undefined;
  public individualId: number | undefined = undefined;
  private _dataValidator: any[] = [];

  public get dataValidator() {
    return this._dataValidator;
  }

  public isValidCustomer() {
    this._dataValidator = this._dataValidator.filter(
      (e: any) => e.name !== "individualId"
    );
    if (!!this.individualId) {
      return true;
    }
    this._dataValidator.push({
      name: "individualId",
      message: "Vui lòng chọn Khách hàng",
    });
    return false;
  }

  public isValidData() {
    return this.isValidCustomer();
  }

  public toObjectSendToAPI() {
    return {
      id: this.voucherId,
      listInvestorId: [this.individualId],
    };
  }
}
