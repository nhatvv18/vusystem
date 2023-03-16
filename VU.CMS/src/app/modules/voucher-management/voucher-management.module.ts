import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { ApplyVoucherDialogComponent } from "./apply-voucher-dialog/apply-voucher-dialog.component";
import { CreateOrEditVoucherDialogComponent } from "./create-or-edit-voucher-dialog/create-or-edit-voucher-dialog.component";
import { VoucherManagementComponent } from "./voucher-management.component";

@NgModule({
  declarations: [
    VoucherManagementComponent,
    CreateOrEditVoucherDialogComponent,
    ApplyVoucherDialogComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [VoucherManagementComponent],
})
export class VoucherManagementModulet {}
