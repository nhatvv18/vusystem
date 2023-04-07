import { Injector, Pipe, PipeTransform } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MessageService } from 'primeng/api';

@Pipe({
    name: 'truncate'
})

export class TruncatePipe extends AppComponentBase implements PipeTransform {

    constructor(injector: Injector, messageService: MessageService) {
        super(injector, messageService);
    }

    transform(value: string, args: any[]): string {
        if (!value) {
            return null;
        }
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
