import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Injectable({
  providedIn: 'root'
})

export class PayrollReportsService {

  constructor(private httpClient: HttpClient) { }

  //for Payroll transaction report
  getPayrollsReport(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<IPaginationResponse<any>>(AppConst.remoteServiceBaseUrl + 'payrollTransaction/Report', {params: data});
  }
}
