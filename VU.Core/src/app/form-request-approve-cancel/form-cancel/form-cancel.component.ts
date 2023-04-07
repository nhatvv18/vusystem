import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
	selector: 'app-form-cancel',
	templateUrl: './form-cancel.component.html',
	styleUrls: ['./form-cancel.component.scss']
})
export class FormCancelComponent implements OnInit {

	constructor(
		public ref: DynamicDialogRef,
		public configDialog: DynamicDialogConfig
	) {

	}

	fieldErrors = {};

	title: string;
	submitted = false;

	acceptStatus: boolean = true;

	dataCancel = {
		id: 0,
		userCancel: 1,
		cancelNote: null,
	}



	ngOnInit(): void {
		this.dataCancel.id = this.configDialog.data.id;
	}

	hideDialog() {
	}

	accept() {
		this.acceptStatus = true;
		this.onAccept();
	}

	setFieldError() {
		for (const [key, value] of Object.entries(this.dataCancel)) {
			this.fieldErrors[key] = false;
		}
		console.log({ filedError: this.fieldErrors });
	}

	resetValid(field) {
		this.fieldErrors[field] = false;
	}


	cancel() {
		this.acceptStatus = false;
		this.onAccept();
	}

	onAccept() {
		this.ref.close({ data: this.dataCancel, accept: this.acceptStatus });
	}

	validForm(): boolean {
		const validRequired = this.dataCancel?.cancelNote?.trim();
		return validRequired;
	}

}
