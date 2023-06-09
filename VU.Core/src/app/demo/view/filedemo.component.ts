import {Component} from '@angular/core';
import {MessageService} from 'primeng/api';
import { BreadcrumbService } from 'src/app/layout/breadcrumb/breadcrumb.service';

@Component({
    templateUrl: './filedemo.component.html',
    providers: [MessageService]
})
export class FileDemoComponent {

    uploadedFiles: any[] = [];

    constructor(private breadcrumbService: BreadcrumbService, private messageService: MessageService) {
        this.breadcrumbService.setItems([
            { label: 'UI Kit' },
            { label: 'File', routerLink: ['/uikit/file'] }
        ]);
    }

    onUpload(event) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    onBasicUpload(event) {
        this.messageService.add({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
    }
}
