import { LoginUrlComponent } from "./login-url/login-url.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppMainComponent } from "./layout/main/app.main.component";
import { HomeComponent } from "./home/home.component";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { PermissionLoyaltyConst } from "@shared/AppConsts";
import { routes } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AppMainComponent,
        children: [
          {
            path: "login/url/:accessToken/:refreshToken",
            component: LoginUrlComponent,
          },
          { path: "home", component: HomeComponent },
					...routes
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
