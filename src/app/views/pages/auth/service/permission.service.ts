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
        const permissions = this.singletonService.getCurrentUserPermission();
        let isGranted = false;
        if (permissions) {
            isGranted = permissions.some(x => x === permissionName)
        }
        return isGranted
     }
}