import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJournal } from '../model/IJournal';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class JournalService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'journal';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getJournalEntries(): Observable<IPaginationResponse<IJournal[]>> {
    return this.httpClient.get<IPaginationResponse<IJournal[]>>(this.baseUrl)
  }

  getJournalById(id: number): Observable<IApiResponse<IJournal>> {
    return this.httpClient.get<IApiResponse<IJournal>>(this.baseUrl + '/' + id)
  }

  addJournal(Journal: IJournal): Observable<IApiResponse<IJournal>> {
    return this.httpClient.post<IApiResponse<IJournal>>(this.baseUrl, Journal, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateJournal(JVModel: IJournal): Observable<IApiResponse<IJournal>> {
    return this.httpClient.put<IApiResponse<IJournal>>(this.baseUrl + `/${JVModel.id}`, JVModel, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    })
  }

  uploadFile(id: number , file: File ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/workflow', workflow);
  }

  getRecords(params?: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.date?.dateFrom, 'MM/d/y'))})
  }

  getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + "Journal?startDate=" + startDate + '&endDate=' + endDate);
  }
  deleteJournals(id : string[]):Observable<any>{
    return this.httpClient.delete(`${AppConst.remoteServiceBaseUrl + "journal"}`,{
      body : id
    })
  }
}
