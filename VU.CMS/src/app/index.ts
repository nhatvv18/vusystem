import { Route } from "@angular/router";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { IndividualCustomerDetailComponent } from "./modules/individual-customer/individual-customer-detail/individual-customer-detail.component";
import { IndividualCustomerComponent } from "./modules/individual-customer/individual-customer.component";
import { IndividualCustomerModule } from "./modules/individual-customer/individual-customer.module";
import { VoucherManagementComponent } from "./modules/voucher-management/voucher-management.component";
import { VoucherManagementModulet } from "./modules/voucher-management/voucher-management.module";

export const modules: any[] = [
  IndividualCustomerModule,
  VoucherManagementModulet,
];

export const menus: any[] = [
  {
    label: "Khách hàng cá nhân",
    routerLink: ["/individual-customer"],
    isShow: true,
    icon: "pi pi-users",
  },
  {
    label: "Quản lý ưu đãi",
    routerLink: ["/voucher-management"],
    isShow: true,
    icon: "pi pi-ticket",
  },
];

export const routes: Route[] = [
  {
    path: "individual-customer",
    children: [
      {
        path: "",
        component: IndividualCustomerComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "detail/:id",
        component: IndividualCustomerDetailComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "edit/:id",
        component: IndividualCustomerDetailComponent,
        canActivate: [AppRouteGuard],
      },
    ],
  },
  {
    path: "voucher-management",
    children: [
      {
        path: "",
        component: VoucherManagementComponent,
        canActivate: [AppRouteGuard],
      },
    ],
  },
];
