import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { CreateOrEditVoucherCustomerComponent } from "./individual-customer-detail/individual-customer-detail-offer/create-or-edit-voucher-customer/create-or-edit-voucher-customer.component";
import { IndividualCustomerDetailOfferComponent } from "./individual-customer-detail/individual-customer-detail-offer/individual-customer-detail-offer.component";
import { IndividualCustomerDetailOverviewComponent } from "./individual-customer-detail/individual-customer-detail-overview/individual-customer-detail-overview.component";
import { IndividualCustomerDetailComponent } from "./individual-customer-detail/individual-customer-detail.component";
import { IndividualCustomerComponent } from "./individual-customer.component";

@NgModule({
  declarations: [
    IndividualCustomerComponent,
    IndividualCustomerDetailComponent,
    IndividualCustomerDetailOverviewComponent,
    IndividualCustomerDetailOfferComponent,
    CreateOrEditVoucherCustomerComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [IndividualCustomerComponent],
})
export class IndividualCustomerModule {}
