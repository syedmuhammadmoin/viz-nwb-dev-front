import { ICashAccount }                               from '../model/ICashAccount';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError }                     from 'rxjs';
import { catchError }                                 from 'rxjs/operators';
import { environment }                                from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
    providedIn: 'root',
})

export class CashAccountService extends AppServiceBase {

    baseUrl = environment.baseUrl+'CashAccount';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCashAccounts(params: any): Observable<IPaginationResponse<ICashAccount[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);

        return this.httpClient.get<IPaginationResponse<ICashAccount[]>>(this.baseUrl, { params: httpParams})
            .pipe(catchError(this.handleError));
    }

    getCashAccountsDropdown(): Observable<IApiResponse<ICashAccount[]>> {
        return this.httpClient.get<IApiResponse<ICashAccount[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getCashAccount(id: number): Observable<IApiResponse<ICashAccount>> {
        return this.httpClient.get<IApiResponse<ICashAccount>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addCashAccount(cashAccount : ICashAccount): Observable<ICashAccount>{
        return this.httpClient.post<ICashAccount>(`${this.baseUrl}`, cashAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateCashAccount(cashAccount: ICashAccount): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${cashAccount.id}`, cashAccount, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    getRecords(params: any): Observable<any> {
       return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.cashAccountName?.filter)});
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
