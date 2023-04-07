import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AccountComponent } from "./account.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { OtpCodeComponent } from "./otp-code/otp-code.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AccountComponent,
        children: [
          { path: "login", component: LoginComponent },
          // { path: "forgot-password", component: ForgotPasswordComponent },
          { path: "change-password", component: ChangePasswordComponent },
          { path: "otp-code", component: OtpCodeComponent },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
