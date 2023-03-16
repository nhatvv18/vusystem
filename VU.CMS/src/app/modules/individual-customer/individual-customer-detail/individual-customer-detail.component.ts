import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CrudComponentBase } from "@shared/crud-component-base";
import { IndividualCustomerService } from "@shared/services/individual-customer-service";
import { MessageService } from "primeng/api";
import { TabView } from "primeng/tabview";
import { BreadcrumbService } from "src/app/layout/breadcrumb/breadcrumb.service";

@Component({
  selector: "individual-customer-detail",
  templateUrl: "./individual-customer-detail.component.html",
  styleUrls: ["./individual-customer-detail.component.scss"],
})
export class IndividualCustomerDetailComponent extends CrudComponentBase {
  @ViewChild(TabView)
  public tabView: TabView;

  public tabViewActive = {
    overview: true,
    offer: false,
    contractForm: false,
  };
  public isEdit: boolean = false; // => view

  constructor(
    injector: Injector,
    messageService: MessageService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private routeActive: ActivatedRoute,
    private individualCustomerService: IndividualCustomerService
  ) {
    super(injector, messageService);
    this.breadcrumbService.setItems([
      { label: "Trang chủ", routerLink: ["/home"] },
      { label: "Khách hàng cá nhân", routerLink: ["/individual-customer"] },
      { label: "Chi tiết khách hàng" },
    ]);
    this.isEdit = !!this.router.url.includes("edit");
    this.individualCustomerService.individualCustomerId = +this.cryptDecode(
      this.routeActive.snapshot.paramMap.get("id")
    );
  }

  ngOnInit() {}

  public changeTab(event: any) {
    Object.keys(this.tabViewActive).forEach(
      (key: string) => (this.tabViewActive[key] = false)
    );
    let tabHeader = this.tabView.tabs[event.index].header;
    this.tabViewActive[tabHeader] = true;
  }
}
