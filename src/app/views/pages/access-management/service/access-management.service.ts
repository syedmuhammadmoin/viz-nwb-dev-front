import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IRoleModel } from "../model/IRoleModel";
import { IUserModel } from "../model/IUserModel";
import { IResetPassword } from '../model/IResetPassword';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IOrganizationAccessLevel } from '../model/IOrganizationAccessLevel';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})
  
export class AccessManagementService {

    constructor( private httpClient: HttpClient) { }

    getClaims(): Observable<any> {
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'auth/claims');
    }

    getUsers(): Observable<any> {
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'auth/users');
    }

    getRoles(): Observable<any> {
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'auth/roles')
    }

    getRole(id: any): Observable<any> {
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'auth/roles/' + id)
    }

    getUser(id: any): Observable<any> {
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'auth/users/' + id)
    }

    createUser(body: IUserModel): Observable<any> {
        return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'auth/users', body);
    }

    createRole(body: IRoleModel): Observable<any> {
        return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'auth/roles', body)
    }

    updateUser(body: IUserModel): Observable<any> {
        return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'auth/users/' + body.userId, body);
    }

    updateRole(body: IRoleModel): Observable<any> {
        return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'auth/roles/' + body.id, body)
    }

    resetPassword(body: IResetPassword): Observable<any> {
        return this.httpClient.put(AppConst.remoteServiceBaseUrl + `auth/users/ResetPass/${body.userId}`, body)
    }
  
    changePassword(body: IResetPassword): Observable<any> {
        return this.httpClient.put(AppConst.remoteServiceBaseUrl + `auth/users/changePassword/${body.loginUserId}`, body)
    }

    getUserScope(): Observable<IApiResponse<IOrganizationAccessLevel[]>> {
        return this.httpClient.get<IApiResponse<IOrganizationAccessLevel[]>>(AppConst.remoteServiceBaseUrl + 'UserScope')
    } 

    getUserScopeById(): Observable<any> {
        return 
    }

    getRolesDropdown(): Observable<any> {
        return this.httpClient.get<IApiResponse<IOrganizationAccessLevel[]>>(AppConst.remoteServiceBaseUrl + 'auth/roles/dropdown')
    }
}

