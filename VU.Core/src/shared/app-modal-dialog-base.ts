import { AppComponentBase } from "@shared/app-component-base";
import { Component, EventEmitter, Injector, Input, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { CrudComponentBase } from "./crud-component-base";

/**
 * Component base cho MODAL DIALOG 
 * VIET THEO KIEU CA COMPONENT LA <p-dialog>
 */
@Component({
	template: "",
})

export abstract class ModalDialogBase extends CrudComponentBase {
	/* PROPS */
	@Input() visible: boolean = false; // 2 WAYS BINDING
	@Input() imageUrl: string = "";

	/* EVENT */
	@Output() visibleChange = new EventEmitter<boolean>();

	constructor(injector: Injector, messageService: MessageService) {
		super(injector, messageService);
	}

	/**
	 * TỰ ĐÓNG CHÍNH MÌNH
	 */
	 selfClose() {
		this.visible = false;
		this.visibleChange.emit(this.visible);
	}
}
