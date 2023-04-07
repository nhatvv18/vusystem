import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
	selector: "app-investor-image",
	templateUrl: "./investor-image.component.html",
	styleUrls: ["./investor-image.component.scss"],
})
export class InvestorImageComponent implements OnInit {

	@Input() image: string = "";
	@Input() imageClass: string = "";
	@Input() idInput: string = "";
	@Input() idImage: string = "";
	@Input() readOnly: boolean = false;
	@Input() imageWidth: string = "350rem";
	@Input() imageHeight: string = "200rem";
	@Input() imageStyle: any = {objectFit: 'cover'};
	@Input() isDisable: boolean;

	/* EVENT */
	@Output() imageChange = new EventEmitter<any>();
	@Output() onChangeImage = new EventEmitter<any>();

	constructor() {}

	ngOnInit(): void {
		console.log()
	}

	changeImage($event) {
		if (this.readOnly) {
			return;
		}

		this.processPreviewImage($event, this.idImage, (file) => {
			this.imageChange.emit(file);
			this.onChangeImage.emit();
		});
		
	}

	/**
	 * DISPLAY IMAGE
	 * @param $event
	 * @param id
	 * @param callback
	 */
	processPreviewImage($event, id, callback) {
		var reader = new FileReader();

		const self = this;
		reader.onload = function (e) {
			self.setImgSrc(id, e.target.result);
		};

		reader.readAsDataURL($event.target.files[0]);
		callback && callback($event.target.files[0]);
	}

	setImgSrc(elementId, value) {
		const imgContainer = document.getElementById(elementId);
		if (imgContainer != null) {
			const img: any = imgContainer.querySelector("img");
			img.setAttribute("src", value);
		}
	}
}
