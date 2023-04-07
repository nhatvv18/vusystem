import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';

// PrimeNG Components for demos
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import {MenuItem} from 'primeng/api';

// Application Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMainComponent } from './layout/main/app.main.component';
import { AppMenuComponent } from './layout/menu/app.menu.component';
import { AppMenuitemComponent } from './layout/menu/app.menuitem.component';
import { AppBreadcrumbComponent } from './layout/breadcrumb/app.breadcrumb.component';
import { AppConfigComponent } from './layout/config-setting/app.config.component';
import { AppRightPanelComponent } from './layout/right-panel/app.rightpanel.component';
import { AppTopBarComponent } from './layout/top-bar/app.topbar.component';
import { AppFooterComponent } from './layout/footer/app.footer.component';

// Demo pages
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { FormLayoutDemoComponent } from './demo/view/formlayoutdemo.component';
import { FloatLabelDemoComponent } from './demo/view/floatlabeldemo.component';
import { InvalidStateDemoComponent } from './demo/view/invalidstatedemo.component';
import { InputDemoComponent } from './demo/view/inputdemo.component';
import { ButtonDemoComponent } from './demo/view/buttondemo.component';
import { TableDemoComponent } from './demo/view/tabledemo.component';
import { ListDemoComponent } from './demo/view/listdemo.component';
import { TreeDemoComponent } from './demo/view/treedemo.component';
import { PanelsDemoComponent } from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent } from './demo/view/overlaysdemo.component';
import { MediaDemoComponent } from './demo/view/mediademo.component';
import { MenusComponent } from './demo/view/menus/menus.component';
import { MessagesDemoComponent } from './demo/view/messagesdemo.component';
import { MiscDemoComponent } from './demo/view/miscdemo.component';
import { EmptyDemoComponent } from './demo/view/emptydemo.component';
import { ChartsDemoComponent } from './demo/view/chartsdemo.component';
import { FileDemoComponent } from './demo/view/filedemo.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';

// Demo services
import { CountryService } from './demo/service/countryservice';
import { EventService } from './demo/service/eventservice';
import { NodeService } from './demo/service/nodeservice';
import { CustomerService } from './demo/service/customerservice';
import { PhotoService } from './demo/service/photoservice';
import { ProductService } from './demo/service/productservice';
import { IconService } from './demo/service/iconservice';
import { ConfigService } from './demo/service/app.config.service';

// Application services
import { BreadcrumbService } from './layout/breadcrumb/breadcrumb.service';
import { MenuService } from './layout/menu/app.menu.service';
import { AngularEditorModule } from '@kolkov/angular-editor';


import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';

import { SharedModule } from '@shared/shared.module';
import { BusinessCustomerApproveComponent } from './business-customer/business-customer-approve/business-customer-approve.component';
import { BusinessCustomerApproveDetailComponent } from './business-customer/business-customer-approve/business-customer-approve-detail/business-customer-approve-detail.component';
import { BusinessCustomerComponent } from './business-customer/business-customer/business-customer.component';
import { BusinessCustomerDetailComponent } from './business-customer/business-customer/business-customer-detail/business-customer-detail.component';
import { BusinessCustomerBankComponent } from './business-customer/business-customer/business-customer-bank/business-customer-bank.component';
import { OrderService } from '@shared/service-proxies/shared-data-service';

import { BroadcastNewsComponent } from './broadcast/news/broadcast-news.component';
import { MediaComponent } from './broadcast/media/media.component';
// import { SimpleModalModule } from 'ngx-simple-modal'; 
import { AddNewsComponent } from './broadcast/news/add-news/add-news.component';

import { PartnerComponent } from './partner-manager/partner/partner.component';
import { PartnerDetailComponent } from './partner-manager/partner/partner-detail/partner-detail.component';

import { InvestorComponent } from './investor/investor.component';
import { CreateInvestorEkycComponent } from './investor/create-investor-ekyc/create-investor-ekyc.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { AddMediaComponent } from './broadcast/add-media/add-media.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InvestorDetailComponent } from './investor/investor-detail/investor-detail.component';

import { InvesorViewImageComponent } from './investor/invesor-view-image/invesor-view-image.component';
import { TrinhDuyetInvestorComponent } from './investor/trinh-duyet-investor/trinh-duyet-investor.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ApproveSuperAdminComponent } from './investor/approve-super-admin/approve-super-admin.component';
import { ApproveTradingProviderComponent } from './investor/approve-trading-provider/approve-trading-provider.component';
import { InvestorImageComponent } from './investor/investor-image/investor-image.component';
import { ApproveComponent } from './approve-manager/approve/approve.component';
import { FormRequestComponent } from './form-request-approve-cancel/form-request/form-request.component';
import { FormApproveComponent } from './form-request-approve-cancel/form-approve/form-approve.component';
import { FormCancelComponent } from './form-request-approve-cancel/form-cancel/form-cancel.component';
import { InvestorApproveComponent } from './investor-approve/investor-approve.component';
import { InvestorBankComponent } from './investor/investor-bank/investor-bank.component';
import { InvestorAccountComponent } from './investor/investor-account/investor-account.component';
import { NotificationTemplateComponent } from './notification/notification-template/notification-template.component';
import { NotificationManagerComponent } from './notification/notification-manager/notification-manager.component';
import { AddNotificationTemplateComponent } from './notification/add-notification-template/add-notification-template.component';
import { InvestorListAccountComponent } from './investor-list-account/investor-list-account.component';
import { CreateUserComponent } from './investor/create-user/create-user.component';
import { MarkdownModule } from 'ngx-markdown';
import { NotificationDetailComponent } from './notification/notification-detail/notification-detail.component';
import { AddNotificationComponent } from './notification/add-notification/add-notification.component';
import { AddPersonListComponent } from './notification/add-person-list/add-person-list.component';
import { KnowledgeBaseComponent } from './broadcast/knowledge-base/knowledge-base.component';
import { CreateUpdateComponent } from './broadcast/knowledge-base/create-update/create-update.component';
import { UserResetPasswordComponent } from './investor/user-reset-password/user-reset-password.component';
import { FormCloseComponent } from './form-request-approve-cancel/form-close/form-close.component';
import { LoginUrlComponent } from './login-url/login-url.component';
import { SystemTemplateComponent } from './notification/system-template/system-template.component';
import { PartnerAccountsComponent } from './partner-manager/partner/partner-accounts/partner-accounts.component';
import { CreatePartnerAccountComponent } from './partner-manager/partner/partner-accounts/create-partner-account/create-partner-account.component';
import { InvestorContactAddressComponent } from './investor/investor-contact-address/investor-contact-address.component';
import { BusinessCustomerBankApproveComponent } from './business-customer/business-customer-approve/business-customer-approve-detail/business-customer-bank-approve/business-customer-bank-approve.component';
import { ChatComponent } from './support/chat/chat.component';
import { RocketChatPageComponent } from './rocket-chat/rocket-chat-page/rocket-chat-page.component';
import { InvestorFileComponent } from './investor/investor-file/investor-file.component';
import { FormSetDisplayColumnComponent } from './form-set-display-column/form-set-display-column.component';
import { DepartmentComponent } from './department/department.component';
import { CreateDepartmentComponent } from './department/create-department/create-department.component';
import { AddSalseDepartmentComponent } from './department/add-salse-department/add-salse-department.component';
import { AddSalseManagerDepartmentComponent } from './department/add-salse-manager-department/add-salse-manager-department.component';
import { FormShowChangeComponent } from './business-customer/business-customer-approve/business-customer-approve-detail/form-show-change/form-show-change.component';
import { FormApproveBusinessComponent } from './business-customer/business-customer-approve/business-customer-approve-detail/form-approve-business/form-approve-business.component';
import { InvestorDiffComponent } from './investor/investor-diff/investor-diff.component';
import { SaleTemporaryComponent } from './sale/sale-temporary/sale-temporary.component';
import { SaleActiveComponent } from './sale/sale-active/sale-active.component';
import { FormApproveInvestorComponent } from './investor/form-approve-investor/form-approve-investor.component';
import { CreateSaleComponent } from './sale/sale-temporary/create-sale/create-sale.component';
import { SaleActiveDetailComponent } from './sale/sale-active/sale-active-detail/sale-active-detail.component';
import { InvestorFilterComponent } from './sale/sale-temporary/create-sale/investor-filter/investor-filter.component';
import { SaleTemporaryDetailComponent } from './sale/sale-temporary/sale-temporary-detail/sale-temporary-detail.component';
import { FormApproveSaleComponent } from './sale/sale-temporary/sale-temporary-detail/form-approve-sale/form-approve-sale.component';
import { InvestorProfessionalComponent } from './investor/investor-professional/investor-professional.component';
import { SaleRegisterComponent } from './sale/sale-register/sale-register.component';
import { CollabContractTemplateComponent } from './sale/collab-contract-template/collab-contract-template.component';
import { CollabContractComponent } from './sale/sale-active/sale-active-detail/collab-contract/collab-contract.component';
import { CreatePartnerComponent } from './partner-manager/partner/create-partner/create-partner.component';
import { BusinessLicenseFileComponent } from './business-customer/business-customer/business-customer-detail/business-license-file/business-license-file.component';
import { InvestorSaleComponent } from './investor/investor-detail/investor-sale/investor-sale.component';

import { DefaultSystemTemplateComponent } from './notification/default-system-template/system-template.component';

import { FormViewPdfFileComponent } from './form-view-pdf-file/form-view-pdf-file.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InvestorReferralComponent } from './investor/investor-detail/investor-referral/investor-referral.component';
import { FormNotificationComponent } from './form-notification/form-notification.component';
import { AddInvestorSaleComponent } from './investor/investor-detail/investor-sale/add-investor-sale/add-investor-sale.component';
import { InvestorSaleFilerComponent } from './investor/investor-detail/investor-sale/add-investor-sale/investor-sale-filer/investor-sale-filer.component';
import { SaleDirectionalComponent } from './sale/sale-register/sale-directional/sale-directional.component';
import { FormDigitalSignComponent } from './business-customer/business-customer-approve/business-customer-approve-detail/form-digital-sign/form-digital-sign.component';
import { BusinessCustomerDigitalSignComponent } from './business-customer/business-customer/business-customer-detail/business-customer-digital-sign/business-customer-digital-sign.component';
import { ProviderConfigurationComponent } from './notification/provider-configuration/provider-configuration.component';
import { PaymentManagerComponent } from './payment-manager/payment-manager.component';
import { DigitalSignComponent } from './notification/digital-sign/digital-sign.component';
import { OperationalReportComponent } from './export-report/operational-report/operational-report.component';
import { ManagementReportComponent } from './export-report/management-report/management-report.component';
import { BusinessReportComponent } from './export-report/business-report/business-report.component';
import { BusiCusApproveLicenseFileComponent } from './business-customer/business-customer-approve/busi-cus-approve-license-file/busi-cus-approve-license-file.component';
import { InvestorRequestPhoneComponent } from './investor/investor-detail/investor-request-phone/investor-request-phone.component';
import { ApproveEmailPhoneComponent } from './approve-manager/approve-email-phone/approve-email-phone.component';
import { AddSaleDirectionalComponent } from './department/add-sale-directional/add-sale-directional.component';
import { InvestorCancelHistoryComponent } from './investor/investor-cancel-history/investor-cancel-history.component';
import { InvestorStockComponent } from './investor/investor-detail/investor-stock/investor-stock.component';
import { DateMaskDirective } from './date-mask.directive';
import { WhileListIpComponent } from './notification/while-list-ip/while-list-ip.component';
import { CreateWhileListComponent } from './notification/while-list-ip/create-while-list/create-while-list.component';
import { CreateWhileListDetailComponent } from './notification/while-list-ip/create-while-list/create-while-list-detail/create-while-list-detail.component';
import { MsbPrefixAccountComponent } from './notification/msb-prefix-account/msb-prefix-account.component';
import { CreateMsbPrefixAccountComponent } from './notification/msb-prefix-account/create-msb-prefix-account/create-msb-prefix-account.component';
import { UserAccountComponent } from './app-account/user-account/user-account.component';
import { NotVerifiedComponent } from './app-account/not-verified/not-verified.component';
import { SystemReportComponent } from './export-report/system-report/system-report.component';
import { TradingProviderComponent } from './partner-manager/trading-provider/trading-provider.component';
import { FilterBusinessCustomerComponent } from './components/filter-business-customer/filter-business-customer.component';
import { TradingProviderDetailComponent } from './partner-manager/trading-provider/trading-provider-detail/trading-provider-detail.component';
import { SaleHistoryUpdateComponent } from './sale/sale-active/sale-active-detail/sale-history-update/sale-history-update.component';
import { ReplaceIdentificationComponent } from './investor/investor-file/replace-identification/replace-identification.component';


FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
]);

@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TimelineModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        ProgressSpinnerModule,
        AngularEditorModule,
        DynamicDialogModule,
        KeyFilterModule,
        PdfViewerModule,
        MarkdownModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppRightPanelComponent,
        AppConfigComponent,
        AppBreadcrumbComponent,
        DashboardDemoComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        HomeComponent,
        UserComponent,
        BusinessCustomerComponent,
        BusinessCustomerDetailComponent,
        BusinessCustomerApproveComponent,
        BusinessCustomerApproveDetailComponent,
        BusinessCustomerBankComponent,
        InvestorComponent,
        CreateInvestorEkycComponent,
        BroadcastNewsComponent,
        AddNewsComponent,
        MediaComponent,
        UploadImageComponent,
        AddMediaComponent,
        InvestorDetailComponent,
        InvesorViewImageComponent,
        TrinhDuyetInvestorComponent,
        ApproveSuperAdminComponent,
        ApproveTradingProviderComponent,
        InvestorImageComponent,
        ApproveComponent,
        FormRequestComponent,
        FormApproveComponent,
        FormCancelComponent,
        InvestorApproveComponent,
        InvestorBankComponent,
        InvestorAccountComponent,
        NotificationTemplateComponent,
        NotificationManagerComponent,
        AddNotificationTemplateComponent,
        InvestorListAccountComponent,
        CreateUserComponent,
        NotificationDetailComponent,
        AddNotificationComponent,
        AddPersonListComponent,
        KnowledgeBaseComponent,
        CreateUpdateComponent,
        UserResetPasswordComponent,
        FormCloseComponent,
        LoginUrlComponent,
        SystemTemplateComponent,
        DefaultSystemTemplateComponent,
        InvestorContactAddressComponent,
        BusinessCustomerBankApproveComponent,
        ChatComponent,
        RocketChatPageComponent,
        InvestorFileComponent,
        FormSetDisplayColumnComponent,
        DepartmentComponent,
        CreateDepartmentComponent,
        AddSalseDepartmentComponent,
        AddSalseManagerDepartmentComponent,
        FormShowChangeComponent,
        FormApproveBusinessComponent,
        InvestorDiffComponent,
        SaleTemporaryComponent,
        SaleActiveComponent,
        FormApproveInvestorComponent,
        CreateSaleComponent,
        SaleTemporaryDetailComponent,
        SaleActiveDetailComponent,
        InvestorFilterComponent,
        FormApproveSaleComponent,
        CollabContractTemplateComponent,
        CollabContractComponent,
        InvestorProfessionalComponent,
        SaleRegisterComponent,
        PartnerComponent,
        CreatePartnerComponent,
        PartnerDetailComponent,
        PartnerAccountsComponent,
        CreatePartnerAccountComponent,
        BusinessLicenseFileComponent,
        InvestorSaleComponent,
        FormViewPdfFileComponent,
        InvestorReferralComponent,
        FormNotificationComponent,
        AddInvestorSaleComponent,
        InvestorSaleFilerComponent,
        SaleDirectionalComponent,
        FormDigitalSignComponent,
        BusinessCustomerDigitalSignComponent,
        ProviderConfigurationComponent,
        PaymentManagerComponent,
        DigitalSignComponent,
        OperationalReportComponent,
        ManagementReportComponent,
        BusinessReportComponent,
        SystemReportComponent,
        BusiCusApproveLicenseFileComponent,
        InvestorRequestPhoneComponent,
        ApproveEmailPhoneComponent,
        AddSaleDirectionalComponent,
        InvestorCancelHistoryComponent,
        InvestorStockComponent,
        DateMaskDirective,
        WhileListIpComponent,
        CreateWhileListComponent,
        CreateWhileListDetailComponent,
        MsbPrefixAccountComponent,
        CreateMsbPrefixAccountComponent,
        UserAccountComponent,
        NotVerifiedComponent,
        TradingProviderComponent,
        FilterBusinessCustomerComponent,
        TradingProviderDetailComponent,
        SaleHistoryUpdateComponent,
        ReplaceIdentificationComponent,
    ],
    entryComponents: [
        AddNewsComponent,
        UploadImageComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MenuService,
        BreadcrumbService,
        ConfigService,
        OrderService,
        DialogService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
