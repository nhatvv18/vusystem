import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  constructor() {}

  checkPass: boolean = true;

  ngOnInit(): void {}

  getValue(event) {
    const inputValue = event.target.value;
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    this.checkPass = regex.test(inputValue);
  }
  checkButton() {
    const newPass = document.getElementById("newPass") as HTMLInputElement;
    const rePass = document.getElementById("rePass") as HTMLInputElement;
    if (newPass.value != rePass.value) {
      alert("Mật khẩu nhập lại không trùng khớp, hãy nhập lại");
      rePass.focus();
    }
  }
}
