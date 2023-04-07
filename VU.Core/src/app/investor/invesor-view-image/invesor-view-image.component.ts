import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { ModalDialogBase } from "@shared/app-modal-dialog-base";
import { MessageService } from "primeng/api";

@Component({
	selector: "app-invesor-view-image",
	templateUrl: "./invesor-view-image.component.html",
	styleUrls: ["./invesor-view-image.component.scss"],
})
export class InvesorViewImageComponent extends ModalDialogBase {

	/* PROP */
	@Input() imageUrl: string = "";

	constructor(injector: Injector, messageService: MessageService) {
		super(injector, messageService);
	}

	ngOnInit(): void {}

}
