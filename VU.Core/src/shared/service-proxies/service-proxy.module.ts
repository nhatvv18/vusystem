import { SaleService } from './sale-service';
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
//import { AbpHttpInterceptor } from "abp-ng2-module";

import * as ApiServiceProxies from "./service-proxies";
import * as InvestorServiceProxies from "./investor-service";
import * as SettingServiceProxies from "./setting-service";
import * as BondManagerServiceproxies from "./bond-manager-service";
import * as BusinessCustomerServiceProxies from "./business-customer-service"
import * as TradingContractServiceProxy from "./trading-contract-service";
import * as PartnerServiceProxies from "./partner-service";
import * as ApproveServiceProxies from "./approve-service";
import * as BankServiceProxies from "./bank-service";
import * as ProvinceServiceProxies from "./province-service";
import * as FileServiceProxies from "./file-service";
import { BroadcastService } from "./broadcast-service";
import { NotificationService } from "./notification-service";
import { PartnerAccountService } from "./partner-account-service";
import { ProvinceServiceProxy } from "./province-service";
import { DepartmentService } from "./department-service";
import { CollabContractService } from "./collab-contract-service";
import { DigitalSignServiceProxy } from './digital-sign-service';
import { PaymentManagerServiceProxy } from './payment-manager-service';
import { MSBPrefixAccountServiceProxy, WhitelistIpServiceProxy } from './whitelist-ip-service';
import { NotVerifiedServiceProxy } from './not-verified-service';

@NgModule({
    providers: [
        //core
        ApiServiceProxies.RoleServiceProxy,
        ApiServiceProxies.SessionServiceProxy,
        ApiServiceProxies.UserServiceProxy,
        ApiServiceProxies.TokenAuthServiceProxy,
        ApiServiceProxies.AccountServiceProxy,
        ApiServiceProxies.ConfigurationServiceProxy,
        //File
        FileServiceProxies.FileServiceProxy,
        //InvestorService
        InvestorServiceProxies.InvestorServiceProxy,
        //SettingService
        SettingServiceProxies.IssuerServiceProxy,
        SettingServiceProxies.DepositProviderServiceProxy,
        SettingServiceProxies.TradingProviderServiceProxy,
        SettingServiceProxies.DepositProviderServiceProxy,
        SettingServiceProxies.CalendarServiceProxy,
        SettingServiceProxies.TradingProviderServiceProxy,
        SettingServiceProxies.ProductCategoryServiceProxy,
        SettingServiceProxies.ProductBondTypeServiceProxy,
        SettingServiceProxies.ProductBondInterestServiceProxy,
        SettingServiceProxies.ProductPolicyServiceProxy,
        SettingServiceProxies.BusinessCustomerServiceProxy,
        //BondManagerService
        BondManagerServiceproxies.ProductBondSecondaryServiceProxy,
        BondManagerServiceproxies.ProductBondDetailServiceProxy,
        BondManagerServiceproxies.ProductBondInfoServiceProxy,
        BondManagerServiceproxies.ContractTemplateServiceProxy,
        BondManagerServiceproxies.ContractTypeServiceProxy,
        BondManagerServiceproxies.ProductBondPrimaryServiceProxy,
        BondManagerServiceproxies.ProductBondPolicyTemplateServiceProxy,
        BondManagerServiceproxies.DistributionContractServiceProxy,
        BondManagerServiceproxies.DistributionContractPaymentServiceProxy,
        BondManagerServiceproxies.DistributionContractFileServiceProxy,
        BondManagerServiceproxies.ProductBondSecondaryServiceProxy,
        BondManagerServiceproxies.ProductBondPolicyServiceProxy,
        BondManagerServiceproxies.GuaranteeAssetServiceProxy,
        BondManagerServiceproxies.ProductBondInfoFileServiceProxy,
        BondManagerServiceproxies.ProductBondSecondaryFileServiceProxy,
        //{ provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
        PartnerServiceProxies.PartnerServiceProxy,
        ApproveServiceProxies.ApproveServiceProxy,
        BankServiceProxies.BankServiceProxy,
        ProvinceServiceProxy,
        PaymentManagerServiceProxy,

        TradingContractServiceProxy.OrderServiceProxy,
        TradingContractServiceProxy.OrderPaymentServiceProxy,

        // BusinessCustomerService
        BusinessCustomerServiceProxies.BusinessCustomerApproveServiceProxy,
        BusinessCustomerServiceProxies.BusinessCustomerServiceProxy,
        BusinessCustomerServiceProxies.BusinessCustomerBankServiceProxy,
        BroadcastService,
        NotificationService,
        PartnerAccountService,
        DepartmentService,
        SaleService,
        CollabContractService,
        DigitalSignServiceProxy,
        WhitelistIpServiceProxy,
        MSBPrefixAccountServiceProxy,
        NotVerifiedServiceProxy,
    ]
})
export class ServiceProxyModule { }
