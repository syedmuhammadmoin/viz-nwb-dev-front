import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Injectable({
  providedIn: 'root'
})

export class PayrollReportsService {

  constructor(private httpClient: HttpClient) { }

  payrollExecutivePrintdata = new BehaviorSubject<any>([]);
  currentPayrollExecutivePrintData = this.payrollExecutivePrintdata.asObservable();

  bankAdvicePrintdata = new BehaviorSubject<any>([]);
  currentBankAdvicePrintData = this.bankAdvicePrintdata.asObservable();

  setExecutiveDataForPrintComponent(data: any[]) {
    this.payrollExecutivePrintdata.next(data);
  }

  setBankAdviceDataForPrintComponent(data: any[]) {
    this.bankAdvicePrintdata.next(data);
  }

  //for Payroll transaction report
  getPayrollsReport(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<IPaginationResponse<any>>(AppConst.remoteServiceBaseUrl + 'payrollTransaction/Report', {params: data});
  }

  getExecutiveSummary(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.post<any>(AppConst.remoteServiceBaseUrl + 'PayrollTransaction/PayrollExecutiveReport', data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getBankAdviceReport(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'PayrollTransaction/BankAdviceReport', {params: data});
  }
}
