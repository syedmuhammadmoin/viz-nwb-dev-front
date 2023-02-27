import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../../../../shared/AppConst';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IWorkflow} from '../../../purchase/vendorBill/model/IWorkflow';
import {IDepreciationAdjustment} from '../model/IDepreciationAdjustment';

@Injectable({
  providedIn: 'root'
})
export class DepreciationAdjustmentService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'DepreciaitonAdjustment';

  constructor(private httpClient: HttpClient, injector: Injector) {
    super(injector)
  }

  get(): Observable<IPaginationResponse<IDepreciationAdjustment[]>> {
    return this.httpClient.get<IPaginationResponse<IDepreciationAdjustment[]>>(this.baseUrl)
  }

  getById(id: number): Observable<IApiResponse<IDepreciationAdjustment>> {
    return this.httpClient.get<IApiResponse<IDepreciationAdjustment>>(this.baseUrl + '/' + id)
  }

  add(model: IDepreciationAdjustment): Observable<IApiResponse<IDepreciationAdjustment>> {
    return this.httpClient.post<IApiResponse<IDepreciationAdjustment>>(this.baseUrl, model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  update(model: IDepreciationAdjustment): Observable<IApiResponse<IDepreciationAdjustment>> {
    return this.httpClient.put<IApiResponse<IDepreciationAdjustment>>(this.baseUrl + `/${model.id}`, model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  uploadFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/workflow', workflow);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.date?.dateFrom, 'MM/d/y'))})
  }
}
