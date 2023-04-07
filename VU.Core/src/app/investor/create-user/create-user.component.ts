import { Component, OnInit } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
	selector: "app-create-user",
	templateUrl: "./create-user.component.html",
	styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
	constructor(private ref: DynamicDialogRef) {}

	user = {
		userName: '',
		password: '',
		confirmPassword: '',
	};

	ngOnInit(): void {}

	validPassword(): boolean {
		return this.user.password?.trim() && this.user.confirmPassword?.trim() && this.user.confirmPassword?.trim() === this.user.password?.trim();
	}

	validForm(): boolean {
		return this.validPassword() && !!this.user.userName.trim();
	}

	cancel() {
		
	}

	save() {
		this.ref.close({ user: this.user });
	}
}
