import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IDisposal } from '../model/IDisposal';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
export class DisposalService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'Disposal';
    
  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getDisposal(): Observable<IPaginationResponse<IDisposal[]>> {
      return this.httpClient.get<IPaginationResponse<IDisposal[]>>(this.baseUrl)
  }

  getDisposalById(id: number): Observable<IApiResponse<IDisposal>> {
      return this.httpClient.get<IApiResponse<IDisposal>>(`${this.baseUrl}/${id}`)
  }

  createDisposal(Disposal : IDisposal): Observable<any>{
      return this.httpClient.post<any>(`${this.baseUrl}`, Disposal, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
  }

  updateDisposal(Disposal: IDisposal): Observable<any> {
      return this.httpClient.put<any>(`${this.baseUrl}/${Disposal.id}`, Disposal, {
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

  getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + "Disposal?startDate=" + startDate + '&endDate=' + endDate);
  }
}

