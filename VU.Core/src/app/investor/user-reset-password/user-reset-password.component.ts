import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
	selector: "app-user-reset-password",
	templateUrl: "./user-reset-password.component.html",
	styleUrls: ["./user-reset-password.component.scss"],
})
export class UserResetPasswordComponent implements OnInit {
	constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig) {}

	user: any = {
		confirmPassword: "",
	};

	ngOnInit(): void {
		this.user = { ...this.config.data?.user, confirmPassword: "" };
	}

	validatePassword(): boolean {
		return this.user?.password?.trim() && this.user?.confirmPassword?.trim() && this.user?.confirmPassword?.trim() === this.user?.password?.trim();
	}

	cancel() {}

	save() {
		this.ref.close({ user: this.user });
	}
}
