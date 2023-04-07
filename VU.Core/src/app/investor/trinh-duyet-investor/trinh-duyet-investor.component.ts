import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalDialogBase } from '@shared/app-modal-dialog-base';
import { InvestorServiceProxy } from '@shared/service-proxies/investor-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-trinh-duyet-investor',
	templateUrl: './trinh-duyet-investor.component.html',
	styleUrls: ['./trinh-duyet-investor.component.scss']
})
export class TrinhDuyetInvestorComponent extends ModalDialogBase {

	constructor(injector: Injector, messageService: MessageService,
		public ref: DynamicDialogRef, public config: DynamicDialogConfig,
		private _investorService: InvestorServiceProxy) {
		super(injector, messageService);
	}

	notice: string = '';
	investor: any = {};

	ngOnInit(): void {
		this.investor = this.config.data;
	}

	/**
	 * NHAP => TRINH DUYET
	 * @param data 
	 */
	nhapToTrinhDuyet() {
		const { investorId, investorGroupId } = this.investor;

		this._investorService.request({
			notice: this.notice,
		}).subscribe(res => {
			if (this.handleResponseInterceptor(res, 'Đã chuyển sang trạng thái trình duyệt')) {
				// this.setPage(this.page.pageNumber);
				this.ref.close();
			}
		}, () => {
			this.messageService.add({
				severity: 'error',
				summary: '',
				detail: 'Có sự cố xảy ra khi cập nhật trạng thái. Vui lòng thử lại sau.',
				life: 3000,
			});
		});
	}

}
