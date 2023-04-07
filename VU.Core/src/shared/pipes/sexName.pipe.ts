import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { InvestorConst } from '@shared/AppConsts';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Pipe({
    name: 'sexname'
})
export class SexNamPipe extends AppComponentBase implements PipeTransform {

    InvestorConst = InvestorConst;

    constructor(injector: Injector, messageService: MessageService,) {
        super(injector, messageService);
    }

    transform(value: string, ...args: any[]): string {
        return InvestorConst.SEX_NAME[value] || '';
    }
}
