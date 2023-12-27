import { Injectable, Injector } from '@angular/core';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPettyCashEntry } from '../model/IPettyCashEntry';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
export class PettyCashService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'PettyCash';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getPettyCashEntries(): Observable<IPaginationResponse<IPettyCashEntry[]>> {
    return this.httpClient.get<IPaginationResponse<IPettyCashEntry[]>>(this.baseUrl)
  }

  getPettyCashEntryById(id: number): Observable<IApiResponse<IPettyCashEntry>> {
    return this.httpClient.get<IApiResponse<IPettyCashEntry>>(this.baseUrl + '/' + id)
  }
  
  getOpeningBalance(id: number): Observable<IApiResponse<[]>> {
    return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + "/" + id)
  }

  addPettyCashEntry(pettycashEntry: IPettyCashEntry): Observable<IApiResponse<IPettyCashEntry>> {
    return this.httpClient.post<IApiResponse<IPettyCashEntry>>(this.baseUrl, pettycashEntry, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updatePettyCashEntry(JVModel: IPettyCashEntry): Observable<IApiResponse<IPettyCashEntry>> {
    return this.httpClient.put<IApiResponse<IPettyCashEntry>>(this.baseUrl + `/${JVModel.id}`, JVModel, {
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
}
