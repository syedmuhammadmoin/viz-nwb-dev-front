import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPayment } from '../model/IPayment';

@Injectable({
    providedIn: 'root',
  })

export class PaymentService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'payment';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector)}

  getPayments(paymentType: string, params: any): Observable<IPaginationResponse<IPayment[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
  
    const url = environment.baseUrl + paymentType.replace(/ /g, '');
    return this.httpClient.get<IPaginationResponse<IPayment[]>>(url, { params: httpParams})
      .pipe(catchError(this.handleError))
  }

  getPaymentById(id : number, docType: string): Observable<IApiResponse<IPayment>> {
    const url = environment.baseUrl + docType.replace(/ /g, '')
    return this.httpClient.get<IApiResponse<IPayment>>(url +'/'+id)
      .pipe(catchError(this.handleError)) 
  }

  addPayment(payment: IPayment, docType: string): Observable<IApiResponse<IPayment>> {
    const url = environment.baseUrl + docType.replace(/ /g, '')
    return this.httpClient.post<IApiResponse<IPayment>>(`${url}`, payment, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }).pipe(catchError(this.handleError));
  }

  updatePayment(payment: IPayment, docType: string): Observable<void> {
    const url = environment.baseUrl + docType.replace(/ /g, '')
    return this.httpClient.put<void>(url + `/${payment.id}`, payment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  paymentWorkflow(body: IWorkflow, docType: string): Observable<any> {
    const url = environment.baseUrl + docType.replace(/ /g, '')
    return this.httpClient.post(url + '/workflow', body)
  }

  // uploadFile(id: number, file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  //     .pipe(catchError(this.handleError))
  // }

  getRecords(params: any, paymentType: string): Observable<any> {
    const url = environment.baseUrl + paymentType.replace(/ /g, '');
    return this.httpClient.get(url, {params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.paymentDate?.dateFrom, 'MM/d/y'))})
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
