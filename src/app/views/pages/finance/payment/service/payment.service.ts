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

  // baseUrl = environment.baseUrl + 'payment';

  // constructor(private httpClient: HttpClient) {}

  // getPayments(paymentType: string): Observable<IPaginationResponse<IPayment[]>> {
  //   const url = environment.baseUrl + paymentType.replace(/ /g, '');
  //   return this.httpClient.get<IPaginationResponse<IPayment[]>>(url)
  //     .pipe(catchError(this.handleError))
  // }

  // addPayment(payment: IPayment, docType: string): Observable<IApiResponse<IPayment>> {
  //   const url = environment.baseUrl + docType.replace(/ /g, '')
  //   return this.httpClient.post<IApiResponse<IPayment>>(`${url}`, payment, {
  //       headers: new HttpHeaders({
  //           'Content-Type': 'application/json'
  //       })
  //   }).pipe(catchError(this.handleError));
  // }

  // getPaymentById(id : number, docType: string): Observable<IApiResponse<IPayment>> {
  //   const url = environment.baseUrl + docType.replace(/ /g, '')
  //   return this.httpClient.get<IApiResponse<IPayment>>(url +'/'+id)
  //     .pipe(catchError(this.handleError)) 
  // }


  // getPaymentDetail(id: number): Observable<any> {
  //   return this.httpClient.get(`${this.baseUrl}/` + 'details/' + `${id}`)
  //     .pipe(catchError(this.handleError));
  // }

  // updatePayment(payment: IPayment, docType: string): Observable<void> {
  //   const url = environment.baseUrl + docType.replace(/ /g, '')
  //   return this.httpClient.put<void>(url + `/${payment.id}`, payment, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   });
  // }

  // // uploadFile(id: number, file: File): Observable<any> {

  // //   const formData = new FormData();
  // //   formData.append('file', file, file.name);

  // //   return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  // //     .pipe(catchError(this.handleError))
  // // }

  // paymentWorkflow(body: IWorkflow, docType: string): Observable<any> {
  //   const url = environment.baseUrl + docType.replace(/ /g, '');
  //   return this.httpClient.post(url + '/workflow', body)
  // }

  //   // for error handling.....
  //   private handleError(errorResponse: HttpErrorResponse) {
  //       if (errorResponse.error instanceof ErrorEvent) {
  //           console.error('Client Side Error :', errorResponse.error.message);
  //       } else {
  //           console.error('Server Side Error :', errorResponse);
  //       }
  //       return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  //   }


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
