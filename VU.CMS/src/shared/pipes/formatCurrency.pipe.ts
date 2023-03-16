import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';

@Pipe({
    name: 'formatCurrency'
})
export class FormatCurrencyPipe extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector, messageService: MessageService,) {
        super(injector, messageService);
    }

    transform(value: string, ...args: any[]): string {

		if (value === '' || value === null || typeof value === 'undefined') {
			return '';
		}

		let locales = 'vi-VN';
		const cur = Number(value);

		if (args.length > 0) {
			locales = args[0];	
		}
        const result = new Intl.NumberFormat(locales).format(cur);

		return result === 'NaN' ? '' : result;
    }
}
