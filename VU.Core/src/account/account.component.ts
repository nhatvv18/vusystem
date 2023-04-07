import {
    Component,
    OnInit,
    ViewEncapsulation,
    Injector,
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AccountComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector, 
        messageService: MessageService,
        ) {
        super(injector, messageService);
    }
    ngOnInit(): void {
    }
}
