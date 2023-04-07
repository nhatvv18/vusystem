import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from "@angular/core";
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { Page } from './model/page';
import { AppConsts} from './AppConsts';
import { PermissionsService } from './services/permissions.service';
import {SimpleCrypt} from "ngx-simple-crypt";

/**
 * Component base cho tất cả app
 */
export abstract class CrudComponentBase extends AppComponentBase{

    private permissions: PermissionsService;

    constructor(
        injector: Injector,
        messageService: MessageService,
		
        ) {
        super(injector, messageService);

        this.permissions = injector.get(PermissionsService);

        //Khởi tạo danh sách quyền
        // this.permissions.getAllPermission();
    } 

    localBaseUrl = AppConsts.appBaseUrl;

    AppConsts = AppConsts;
    simpleCrypt = new SimpleCrypt();
    
	subject = {
		keyword: new Subject(),
	};


	keyword = '';
    status = null;

	page = new Page();
	offset = 0;

    isLoading = false;
    isLoadingPage = false;
    isRefresh = false;

    submitted = false;

    activeIndex = 0;

    blockText: RegExp = /[0-9,.]/;

    /**
     * Check permission theo permission name
     * @param permissionName
     * @returns
     */
    isGranted(permissionNames = []): boolean {
        return true;        
        return this.permissions.isGrantedRoot(permissionNames);
    }

	changeKeyword() {
		this.subject.keyword.next();
	}

    phoneNumber(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        const charCodeException = [43, 40, 41];
        if (!charCodeException.includes(charCode) && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    formatDate(value) {
        return (moment(value).isValid() && value) ? moment(value).format('DD/MM/YYYY') : '';
    }

    formatDateTime(value) {
        return (moment(value).isValid() && value) ? moment(value).format('DD/MM/YYYY HH:mm') : '';
    }

    formatDateTimeSecond(value) {
        return (moment(value).isValid() && value) ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '';
    }
    
    formatDateYMD(value) {
        return (moment(value).isValid() && value) ? moment(value).format('YYYY/MM/DD') : '';
    }

    formatDateTimeView(value) {
        return (moment(value).isValid() && value) ? moment(value).format('YYYY-MM-DDTHH:mm') : '';
    }

    formatDateTimeTickTack(value) {
        return (moment(value).isValid() && value) ? moment(value).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : '';
    }
   
    // === CHUYỂN ĐỔI DỮ LIỆU TỪ CALENDAR ĐỂ LƯU VÀ DATABASE KO BỊ SAI TIMEZONE

    protected formatCalendar(fields, model) {
        for(let field of fields) {
            if(model[field]) model[field] = this.formatCalendarItem(model[field]);
        }
        return model;
    }

    protected formatCalendarItem(datetime: string) {
        return moment(new Date(datetime)).format("YYYY-MM-DDTHH:mm:ss");
    }
    // =====

    // === CHUYỂN ĐỔI DỮ LIỆU ĐỂ HIỂN THỊ ĐƯỢC TRONG CALENDAR
    protected formatCalendarDisplay(fields, model) {
        for(let field of fields) {
            if(model[field]) model[field] = this.formatCalendarDisplayItem(model[field]);
        }
        return model;
    }

    protected formatCalendarDisplayItem(datetime: string) {
        return new Date(datetime);
    }

    //===

    protected setDataSendApi(model, modelInterface) {
        for (const [key, value] of Object.entries(modelInterface)) {
            modelInterface[key] = model[key];
        }
        return modelInterface;
    }

    cryptEncode(id): string {
        return this.simpleCrypt.encode(AppConsts.keyCrypt,'' + id);
    }

    cryptDecode(codeId) {
        return this.simpleCrypt.decode(AppConsts.keyCrypt, codeId);
    }

    getTableHeight(percent = 65) {
        return (this.screenHeight*(percent/100) + 'px');     
    }

    public getLocalStorage(key: string) {
		return JSON.parse(localStorage.getItem(key))
	}

    public setLocalStorage(data: any[], key: string) {
		return localStorage.setItem(key, JSON.stringify(data));
	}

    public getConfigDialogServiceDisplayTableColumn(cols:any[], comlumnSelected:any[]){
        return {    
            header: "Sửa cột hiển thị",
            width: '300px',
            contentStyle: { "max-height": "600px", "overflow": "auto", "margin-bottom": "60px" },
            style: {"overflow": "hidden"},
            styleClass:'dialog-setcolumn',
            baseZIndex: 10000,
            data: {
                cols: cols,
                comlumnSelected: comlumnSelected,
            },
        };        
    }

    public formatCurrency(value: any): string | 0 {
        return new Intl.NumberFormat("en-DE").format(value);
    }
}
