import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { MessageService } from 'primeng/api';

@Pipe({
    name: 'baseapiurl'
})
export class BaseApiUrlPipe extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector, messageService: MessageService, private _service: TokenAuthServiceProxy) {
        super(injector, messageService);
    }

    transform(value: string, ...args: any[]): string {
		return `${this._service.getBaseApiUrl()}/${value}`;
    }
}
