import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPaymentProcess } from '../model/IPaymentProcess';
import { IPayrollProcess } from '../model/IPayrollProcess';

@Injectable({
  providedIn: 'root'
})

export class PayrollProcessService {

  private payrollBaseUrl = AppConst.remoteServiceBaseUrl + 'payrollTransaction';
  private paymentBaseUrl = AppConst.remoteServiceBaseUrl + 'payment';

  constructor(private httpClient: HttpClient) { }


  //Payroll Process
  createPayrollProcess(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(this.payrollBaseUrl + '/getForSubmit', body)
  }

  submitPayrollProcess(body: []): Observable<any> {
    return this.httpClient.post(this.payrollBaseUrl + '/submitProcess', body)
  }

  GetApprovePayrollProcess(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(this.payrollBaseUrl + '/getForApproval', body);
  }

  submitApprovalPayrollProcess(body: {docId: [], action: number}): Observable<any> {
    return this.httpClient.post(this.payrollBaseUrl + '/approvalProcess', body);
  }


  //Payment Process
  getPayrollTransactions(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/GetPayrollTrans', body)
  }

  createPaymentProcess(body: IPaymentProcess): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/createProcess', body)
  }

  getPayrollPayment(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/GetPayrollPayment', body)
  }

  submitPaymentProcess(body: []): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/submitProcess', body)
  }

  getPayrollPaymentForApproval(body: IPayrollProcess): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/GetforPayrollPaymentApproval', body)
  }

  approvePayrollPaymentProcess(body: {docId: [], action: number}): Observable<any> {
    return this.httpClient.post(this.paymentBaseUrl + '/approvalProcess', body)
  }
}
