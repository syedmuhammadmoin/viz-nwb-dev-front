import { Injectable } from "@angular/core";
import { AuthSingletonService } from "./auth-singleton.service";

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    constructor(
        private singletonService: AuthSingletonService
    ) { }
    
    isGranted(permissionName: string): boolean {
        //console.log('check permission', permissionName);
        const permissions = this.singletonService.getCurrentUserPermission();
        //console.log('from', permissions);
        let isGranted = false;
        if (permissions) {
            isGranted = permissions.some(x => x === permissionName)
        }
        return isGranted
     }
}