import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PayrollReportsService {

  constructor(private httpClient: HttpClient) { }

  //for Payroll transaction report
  getPayrollsReport(data: any): Observable<IPaginationResponse<any>> {
    return this.httpClient.get<IPaginationResponse<any>>(environment.baseUrl + 'payrollTransaction/Report', {params: data});
  }
}
