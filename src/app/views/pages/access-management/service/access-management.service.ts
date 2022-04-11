import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IRoleModel } from "../model/IRoleModel";
import { IUserModel } from "../model/IUserModel";
import { IResetPassword } from '../model/IResetPassword';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IOrganizationAccessLevel } from '../model/IOrganizationAccessLevel';

@Injectable({
  providedIn: 'root'
})
  
export class AccessManagementService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getClaims(): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'auth/claims');
    }

    getUsers(): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'auth/users');
    }

    getRoles(): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'auth/roles')
    }

    getRole(id: any): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'auth/roles/' + id)
    }

    getUser(id: any): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'auth/users/' + id)
    }

    createUser(body: IUserModel): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/users', body);
    }

    createRole(body: IRoleModel): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/roles', body)
    }

    updateUser(body: IUserModel): Observable<any> {
        return this.httpClient.put(environment.baseUrl + 'auth/users/' + body.id, body);
    }

    updateRole(body: IRoleModel): Observable<any> {
        return this.httpClient.put(environment.baseUrl + 'auth/roles/' + body.id, body)
    }

    resetPassword(body: IResetPassword): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `auth/users/ResetPass/${body.userId}`, body)
    }
  
    changePassword(body: IResetPassword): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `auth/users/changePassword/${body.loginUserId}`, body)
    }

    getUserScope(): Observable<IApiResponse<IOrganizationAccessLevel[]>> {
        return this.httpClient.get<IApiResponse<IOrganizationAccessLevel[]>>(environment.baseUrl + 'UserScope')
    } 

    getUserScopeById(): Observable<any> {
        return 
    }
}

