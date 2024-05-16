import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICwip } from '../model/ICwip';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
export class CwipService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'CWIP';
    
  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getCwip(): Observable<IPaginationResponse<ICwip[]>> {
      return this.httpClient.get<IPaginationResponse<ICwip[]>>(this.baseUrl)
  }

  getCwipById(id: number): Observable<IApiResponse<ICwip>> {
      return this.httpClient.get<IApiResponse<ICwip>>(`${this.baseUrl}/${id}`)
  }

  createCwip(Cwip : ICwip): Observable<any>{
      return this.httpClient.post<any>(`${this.baseUrl}`, Cwip, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
  }

  updateCwip(Cwip: ICwip): Observable<any> {
      return this.httpClient.put<any>(`${this.baseUrl}/${Cwip.id}`, Cwip, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl + '/workflow', workflow);
  }

  getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankName?.filter)});
  }

  getRecordByYearMonth(month: any, year: any): Observable<any> {        
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + "CWIP?month=" + month + '&year=' + year);
  }
}

