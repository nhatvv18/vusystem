import { Injectable } from "@angular/core";
import { UserServiceProxy } from "@shared/service-proxies/service-proxies";

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    private permissions: any[] = [];

    constructor(private _userService: UserServiceProxy) {
    }
 
    getAllPermission() {
        this._userService.getAllPermission().subscribe(res => {
            //console.log({ permissionsOnChange: res });
            this.permissions = res.data;
        }, () => {
            console.error('Không lấy được permission trong project');
            this.permissions = [];
        });
    }

    /**
     * Kiểm tra có permission không
     * @param permissionName
     * @returns
     */
    isGrantedRoot(permissionNames = []): boolean {
        for(let permission of permissionNames) {
            if(this.permissions.includes(permission)) {
                return true;
            }
        }
        return false;
    }
}
