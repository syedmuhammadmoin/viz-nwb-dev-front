import { IBankAccount } from '../model/IBankAccount';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root',
})

export class BankAccountService extends AppServiceBase {

    baseUrl = environment.baseUrl+'bankaccount';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getBankAccounts(): Observable<IPaginationResponse<IBankAccount[]>> {
        return this.httpClient.get<IPaginationResponse<IBankAccount[]>>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getBankAccountsDropdown(): Observable<IApiResponse<IBankAccount[]>> {
        return this.httpClient.get<IApiResponse<IBankAccount[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getBankAccount(id: number): Observable<IApiResponse<IBankAccount>> {
        return this.httpClient.get<IApiResponse<IBankAccount>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addBankAccount(bankAccount : IBankAccount): Observable<IBankAccount>{
        return this.httpClient.post<IBankAccount>(`${this.baseUrl}`, bankAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateBankAccount(bankAccount: IBankAccount): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${bankAccount.id}`, bankAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankName?.filter)});
    }

    // for error handling.....
    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}
