import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPayment } from '../model/IPayment';

@Injectable({
    providedIn: 'root',
  })
export class PaymentService {

    baseUrl = environment.baseUrl + 'payment';

    constructor(private httpClient: HttpClient) { }

    getPayments(): Observable<IPaginationResponse<IPayment[]>> {
        return this.httpClient.get<IPaginationResponse<IPayment[]>>(this.baseUrl)
            .pipe(catchError(this.handleError))
    }

    getPaymentById(id : number): Observable<IApiResponse<IPayment>> {
        return this.httpClient.get<IApiResponse<IPayment>>(this.baseUrl +'/'+id)
            .pipe(catchError(this.handleError))
    }

    addPayment(payment: IPayment): Observable<IApiResponse<IPayment>> {
        return this.httpClient.post<IApiResponse<IPayment>>(`${this.baseUrl}`, payment, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updatePayment(payment: IPayment): Observable<void> {
        return this.httpClient.put<void>(this.baseUrl + `/${payment.id}`, payment, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        });
      }

      paymentWorkflow(body: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', body)
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
