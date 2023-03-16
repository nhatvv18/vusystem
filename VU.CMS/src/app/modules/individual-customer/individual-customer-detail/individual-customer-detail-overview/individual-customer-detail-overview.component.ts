import { Component, Injector, Input, OnInit } from "@angular/core";
import { IndividualCustomer } from "@shared/AppConsts";
import { CrudComponentBase } from "@shared/crud-component-base";
import {
  IndividualCustomerDetailAccumulateModel,
  IndividualCustomerDetailOverviewModel,
} from "@shared/interface/individual-customer/IndividualCustomer.model";
import { IndividualCustomerService } from "@shared/services/individual-customer-service";
import { MessageService } from "primeng/api";

@Component({
  selector: "individual-customer-detail-overview",
  templateUrl: "./individual-customer-detail-overview.component.html",
  styleUrls: ["./individual-customer-detail-overview.component.scss"],
})
export class IndividualCustomerDetailOverviewComponent extends CrudComponentBase {
  public faceImage = "assets/layout/images/avatar.png";

  public overview: IndividualCustomerDetailOverviewModel =
    new IndividualCustomerDetailOverviewModel();
  public accumulate: IndividualCustomerDetailAccumulateModel =
    new IndividualCustomerDetailAccumulateModel();

  constructor(
    injector: Injector,
    messageService: MessageService,
    private individualCustomerService: IndividualCustomerService
  ) {
    super(injector, messageService);
  }

  public get listGender() {
    return IndividualCustomer.listGender;
  }

  public get listMembershipClass() {
    return IndividualCustomer.listMembershipClass;
  }

  public get listCardType() {
    return IndividualCustomer.listCardType;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.individualCustomerService.getCustomerDetail().subscribe((res: any) => {
      if (res.data) {
        this.overview.mapDTO(res.data);
      }
    });
  }
}
