import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPaymentProcess } from '../model/IPaymentProcess';
import { IPayrollProcess } from '../model/IPayrollProcess';

@Injectable({
  providedIn: 'root'
})

export class PayrollProcessService {

  constructor(private httpClient: HttpClient) { }


  //Payroll Process
  createPayrollProcess(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'PayrollTransaction/getForSubmit', body)
  }

  submitPayrollProcess(body: []): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'PayrollTransaction/submitProcess', body)
  }

  GetApprovePayrollProcess(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'PayrollTransaction/getForApproval', body);
  }

  submitApprovalPayrollProcess(body: {docId: [], action: number}): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'PayrollTransaction/approvalProcess', body);
  }




  //Payment Process
  getPayrollTransactions(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/GetPayrollTrans', body)
  }

  createPaymentProcess(body: IPaymentProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/createProcess', body)
  }

  getPayrollPayment(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/GetPayrollPayment', body)
  }

  submitPaymentProcess(body: []): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/submitProcess', body)
  }

  getPayrollPaymentForApproval(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/GetforPayrollPaymentApproval', body)
  }

  approvePayrollPaymentProcess(body: {docId: [], action: number}): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'Payment/approvalProcess', body)
  }
}
