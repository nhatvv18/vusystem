import { Component, OnDestroy } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { sloganWebConst } from '@shared/AppConsts';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './app.breadcrumb.component.html',
    styleUrls: ['./app.breadcrumb.component.scss'],
})
export class AppBreadcrumbComponent implements OnDestroy {

    subscription: Subscription;

    items: MenuItem[];

    sloganWebConst = sloganWebConst;
    slogan: string;

    constructor(public breadcrumbService: BreadcrumbService) {
        this.slogan = this.sloganWebConst[Math.floor(Math.random() * this.sloganWebConst.length)];
        this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
            this.items = response;
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
