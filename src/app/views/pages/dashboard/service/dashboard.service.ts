import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class DashboardService extends AppServiceBase {

  private baseUrl = AppConst.remoteServiceBaseUrl + 'PNL';
  private baseUrlBallanceSsheet = AppConst.remoteServiceBaseUrl + 'BalanceSheet';
 
  private header = new HttpHeaders().set("key", AppConst.apiKey) 

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

//   getDesignations(): Observable<IPaginationResponse<[]>> {
//     return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl , {headers: this.header})
//   }

  getSummaryforLast12Month(): Observable<IApiResponse<[]>> {
    return this.httpClient.post<IApiResponse<[]>>(this.baseUrl + '/SummaryforLast12Month',{})
  }  

  
  getSummary(): Observable<IApiResponse<[]>> {
    return this.httpClient.get<IApiResponse<[]>>(this.baseUrlBallanceSsheet +'/Summary',{})
  }  

//   getRecords(params: any): Observable<any> {
//     return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null) , headers: this.header});  
//   }
}


