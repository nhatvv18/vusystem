import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Pipe({
    name: 'datetimeview'
})
export class DateTimeViewPipe extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector, messageService: MessageService) {
        super(injector, messageService);
    }

    transform(value: string, ...args: any[]): string {
        return moment(value).isValid() ? moment(value).format('DD/MM/YYYY HH:mm') : '';
    }
}
