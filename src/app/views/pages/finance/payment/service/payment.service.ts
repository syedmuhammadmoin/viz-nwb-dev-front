import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPayment } from '../model/IPayment';

@Injectable({
    providedIn: 'root',
  })

export class PaymentService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'payment';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector)}

  getPayments(paymentType: string): Observable<IPaginationResponse<IPayment[]>> {
    const url = AppConst.remoteServiceBaseUrl + paymentType.replace(/ /g, '');
    return this.httpClient.get<IPaginationResponse<IPayment[]>>(url)
  }

  getPaymentById(id : number, docType: string): Observable<IApiResponse<IPayment>> {
    const url = AppConst.remoteServiceBaseUrl + docType.replace(/ /g, '')
    return this.httpClient.get<IApiResponse<IPayment>>(url +'/'+id)
  }

  addPayment(payment: IPayment, docType: string): Observable<IApiResponse<IPayment>> {
    const url = AppConst.remoteServiceBaseUrl + docType.replace(/ /g, '')
    return this.httpClient.post<IApiResponse<IPayment>>(`${url}`, payment, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    })
  }

  updatePayment(payment: IPayment, docType: string): Observable<void> {
    const url = AppConst.remoteServiceBaseUrl + docType.replace(/ /g, '')
    return this.httpClient.put<void>(url + `/${payment.id}`, payment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  paymentWorkflow(body: IWorkflow, docType: string): Observable<any> {
    const url = AppConst.remoteServiceBaseUrl + docType.replace(/ /g, '')
    return this.httpClient.post(url + '/workflow', body)
  }

  uploadFile(id: number , file: File, docType: string): Observable<any> {
    const formData = new FormData(); 
    const url = AppConst.remoteServiceBaseUrl + docType.replace(/ /g, '')
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${url}/DocUpload/${id}`, formData)
  }

  getRecords(params: any, paymentType: string): Observable<any> {
    const url = AppConst.remoteServiceBaseUrl + paymentType.replace(/ /g, '');
    return this.httpClient.get(url, {params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.budgetReappropriationDate?.dateFrom, 'MM/d/y'))})
  }
}
