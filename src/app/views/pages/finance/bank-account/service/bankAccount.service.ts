import { IBankAccount } from '../model/IBankAccount';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root',
})

export class BankAccountService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl +'bankaccount';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getBankAccounts(): Observable<IPaginationResponse<IBankAccount[]>> {
        return this.httpClient.get<IPaginationResponse<IBankAccount[]>>(this.baseUrl)
    }

    getBankAccountsDropdown(): Observable<IApiResponse<IBankAccount[]>> {
        return this.httpClient.get<IApiResponse<IBankAccount[]>>(this.baseUrl + '/dropdown')
    }

    getBankAccount(id: number): Observable<IApiResponse<IBankAccount>> {
        return this.httpClient.get<IApiResponse<IBankAccount>>(`${this.baseUrl}/${id}`)
    }

    addBankAccount(bankAccount : IBankAccount): Observable<IBankAccount>{
        return this.httpClient.post<IBankAccount>(`${this.baseUrl}`, bankAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateBankAccount(bankAccount: IBankAccount): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${bankAccount.id}`, bankAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankName?.filter)});
    }
}
