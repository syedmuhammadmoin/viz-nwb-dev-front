import { HttpClient } from '@angular/common/http';
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

  setLedgerDataForPrintComponent(data: any[]) {
    this.payrollExecutivePrintdata.next(data);
  }

  //for Payroll transaction report
  getPayrollsReport(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<IPaginationResponse<any>>(AppConst.remoteServiceBaseUrl + 'PayrollTransaction/PayrollExecutiveReport', {params: data});
  }

  getExecutiveSummary(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<IPaginationResponse<any>>(AppConst.remoteServiceBaseUrl + 'payrollTransaction/executive/Report', {params: data});
  }
}
