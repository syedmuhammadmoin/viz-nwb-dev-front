import { Injectable } from '@angular/core';
import { IVendorBill } from '../model/IVendorBill';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../model/IWorkflow';
import { ITransactionRecon } from '../model/ITransactionRecon';


@Injectable({
  providedIn: 'root'
})

export class VendorBillService {

    baseUrl = environment.baseUrl + 'bill';
    constructor(private httpClient: HttpClient) {
    }
    createVendorBill(ivendorBill: IVendorBill): Observable<any> {
        return this.httpClient.post<IVendorBill>(this.baseUrl, ivendorBill, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    getVendorBills(): Observable<any> {
        return this.httpClient.get<IVendorBill[]>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getVendorBillMaster(id: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    getVendorBillDetail(id: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/` + 'details/' + `${id}`)
            .pipe(catchError(this.handleError));
    }

    updateVendorBill(billModel: IVendorBill): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${billModel.id}`, billModel)
      }

    // getAccounts(): Observable<IAccount[]> {
    //     return this.httpClient.get<IAccount[]>(environment.baseUrl + 'Level4Account')
    //         .pipe(catchError(this.handleError));
    // }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }
    
    createTransitionReconcile(transactionRecon: ITransactionRecon): Observable<any> {
        return this.httpClient.post<any>(environment.baseUrl + 'TransactionRecon', transactionRecon, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }

}

