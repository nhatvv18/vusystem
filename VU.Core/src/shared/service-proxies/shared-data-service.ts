import { OrderConst } from './../AppConsts';
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from "rxjs/operators";
import { Observable, throwError as _observableThrow, of as _observableOf } from "rxjs";
import { Injectable } from "@angular/core";


import { Subject } from 'rxjs';

@Injectable()
export class OrderService {
    orderInformation = {
        customerInformation: {
            activeIndex: 0,
            customerInfo: {
                cifCode: null,
                taxCode: null,
                name: null,
                phone: null,
                email: null,
                adress: null,
            },
            presenterInfo: {
                referalCode: null,
            },
            aboutCode: null,
            presenterName: null,
            presenterPhone: null,
            presenterEmail: null,
        },
        bondSecondaryInformation: {
            bondSecondaryId: null,
            productBondInfo: {
                bondCode: null,
                bondName: null,
                issueDate: null,
            },
            openCellDate: null,
            quantity: null,
            soLuongConLai: null,
            tongGiaTri: null,
            bondPolicyId: 0,
            policyInfo: {
                code: null,
                name: null,
                type: null,
                soNgayDuocBanLai: null,
                kyHan: null,
            },
            bondPolicyDetailId: 0,
            totalValue: null,
            buyDate: new Date(),
            investDate: new Date(),
            signContractDate: null,
            priceDate: 0,
            orderQuantity: null,
            orderPrice: null,
            dueDate: null,
            isInterest: OrderConst.INTEREST_TYPE_YES,
        },
    };

    private orderComplete = new Subject<any>();
    
    orderComplete$ = this.orderComplete.asObservable();

    getOrderInformation() {
        return this.orderInformation;
    }

    setOrderInformation(orderInformation) {
        this.orderInformation = orderInformation;
    }

    complete() {
        this.orderComplete.next(this.orderInformation.customerInformation);
    }
}

