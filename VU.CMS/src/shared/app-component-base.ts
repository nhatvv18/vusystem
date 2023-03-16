import { Injector, ElementRef } from "@angular/core";
import {
    DataTableConst,
    StatusResponseConst,
} from "@shared/AppConsts";
import jwt_decode from "jwt-decode";
import { AppSessionService } from '@shared/session/app-session.service';
import { MessageService } from 'primeng/api';
import { AppLocalStorageService } from "./services/storage.service";
import { TokenService } from "./services/token.service";
import { AppUtilsService } from './services/utils.service';

/**
 * Component base cho tất cả app
 */
export abstract class AppComponentBase {
    appSession: AppSessionService;
    elementRef: ElementRef;
    utils: AppUtilsService;
	_storageService: AppLocalStorageService;
    datatableMessage = DataTableConst.message;
    screenHeight: number = window.innerHeight;
    screenWidth: number = window.innerWidth;
    numberEncode: number = 5;
    _tokenService: TokenService;

    refreshPToast: boolean = true;
    keyToast: string = null;

    constructor(
        injector: Injector, 
        protected messageService: MessageService,
        ) {
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
        this.utils = injector.get(AppUtilsService);
		this._storageService = injector.get(AppLocalStorageService);
        this._tokenService = injector.get(TokenService);
    }

    getBaseUrl() {
        return document.getElementsByTagName("base")[0].href;
    }

    callBackData(response): boolean {
        if(!response?.data && response.code == 202 && response.status == StatusResponseConst.RESPONSE_FALSE) {
            return true;
        }
        return false;
    }

    randomCharacters() {
        const data = ['a','B','c','K','G','t','q','n','m','s','O','p','D','e','E'];
        let randomCharacters: string = '';
        for(let i = 1; i <= this.numberEncode; i++) {
            randomCharacters = randomCharacters + data[Math.floor(Math.random()*data.length)];
        }
        return randomCharacters;
    }

    encodeId(id) {
        return this.randomCharacters() + btoa(id) ;
    }

    decodeId(code: string) {
        return atob(code.slice(this.numberEncode + 1))
    }

    handleResponseInterceptor(response, message?: string): boolean {
        if(response) {
            if (response?.status == StatusResponseConst.RESPONSE_TRUE) {
                if (message) this.messageSuccess(message);
                return true;
            } else {
                let dataMessage = response?.data;
                if (dataMessage) {
                    this.messageError(dataMessage[Object.keys(dataMessage)[0]])
                } else {
                    let message = response?.message;
                    if(response?.code > 1 && response?.code < 1000) {
                        message = "Có lỗi xảy ra vui lòng thử lại sau!";
                    } 
                    this.messageError(response?.message)
                    console.log('error-------:', response);
                }
                return false;
            }
        }
        //
        return false;
    }
    
	messageError(msg = '', life = 3000) {
		if(this.keyToast) this.messageService.add({ key: this.keyToast, severity: 'error', summary: '', detail: msg, life: life });
		if(!this.keyToast) this.messageService.add({ severity: 'error', summary: '', detail: msg, life: life });
	}
    //
	messageSuccess(msg = '', life = 3000) {
		if(this.keyToast) this.messageService.add({ key: this.keyToast, severity: 'success', summary: '', detail: msg, life: life });
		if(!this.keyToast) this.messageService.add({ severity: 'success', summary: '', detail: msg, life: life });
	}
    //
	messageWarn(msg = '', life = 3000) {
		if(this.keyToast) this.messageService.add({ key: this.keyToast, severity: 'warn', summary: '', detail: msg, life: life, icon:'pi-bell' });
		if(!this.keyToast) this.messageService.add({ severity: 'warn', summary: '', detail: msg, life: life, icon: 'pi-bell' });
	}
    
    protected getElementByXpath(path): any {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    getUser() {
        const token = this._tokenService.getToken();
        if(token) {
            const userInfo = jwt_decode(token);
            return userInfo;
        }
        return {};
    }

    formatCurrency(value) {
        if(value) {
            return this.utils.transformMoney(value);
        }
        return 0;
    }

}
