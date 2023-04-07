import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { CrudComponentBase } from '@shared/crud-component-base';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-form-view-pdf-file',
    templateUrl: './form-view-pdf-file.component.html',
    styleUrls: ['./form-view-pdf-file.component.scss'],
    providers: [MessageService]
})
export class FormViewPdfFileComponent extends CrudComponentBase {

    constructor(
        injector: Injector,
        messageService: MessageService,
    ) {
        super(injector, messageService);
    }

    @Input() modalDialogPDF: boolean;
    @Input() urlfilePDF: string;
    @Output() onClose = new EventEmitter<any>();

    title: string;
    rows: any[] = [];

    ngOnInit(): void {
        console.log('link file dialog', this.urlfilePDF);
        console.log('modal', this.modalDialogPDF);
    }

    hideDialog() {
        this.onClose.emit();
        this.modalDialogPDF = false;
    }

    downloadFileScanUrl() {
        window.open(this.urlfilePDF, "_blank");
    }
}
