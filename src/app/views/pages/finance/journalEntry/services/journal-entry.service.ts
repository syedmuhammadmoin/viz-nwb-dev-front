import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IJournalEntry } from '../model/IJournalEntry';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class JournalEntryService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'journalEntry';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getJournalEntries(): Observable<IPaginationResponse<IJournalEntry[]>> {
    return this.httpClient.get<IPaginationResponse<IJournalEntry[]>>(this.baseUrl)
  }

  getJournalEntryById(id: number): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.get<IApiResponse<IJournalEntry>>(this.baseUrl + '/' + id)
  }

  addJournalEntry(journalEntry: IJournalEntry): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.post<IApiResponse<IJournalEntry>>(this.baseUrl, journalEntry, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateJournalEntry(JVModel: IJournalEntry): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.put<IApiResponse<IJournalEntry>>(this.baseUrl + `/${JVModel.id}`, JVModel, {
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

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.date?.dateFrom, 'MM/d/y'))})
  }

  getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + "journalEntry?startDate=" + startDate + '&endDate=' + endDate);
  }
}
