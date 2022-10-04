import { ICashAccount }                               from '../model/ICashAccount';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable }                     from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
    providedIn: 'root',
})

export class CashAccountService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl +'CashAccount';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCashAccounts(): Observable<IPaginationResponse<ICashAccount[]>> {
        return this.httpClient.get<IPaginationResponse<ICashAccount[]>>(this.baseUrl)
    }

    getCashAccountsDropdown(): Observable<IApiResponse<ICashAccount[]>> {
        return this.httpClient.get<IApiResponse<ICashAccount[]>>(this.baseUrl + '/dropdown')
    }

    getCashAccount(id: number): Observable<IApiResponse<ICashAccount>> {
        return this.httpClient.get<IApiResponse<ICashAccount>>(`${this.baseUrl}/${id}`)
    }

    addCashAccount(cashAccount : ICashAccount): Observable<ICashAccount>{
        return this.httpClient.post<ICashAccount>(`${this.baseUrl}`, cashAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateCashAccount(cashAccount: ICashAccount): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${cashAccount.id}`, cashAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
       return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.cashAccountName?.filter)});
    }
}
