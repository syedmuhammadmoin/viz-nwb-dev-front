import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IRequestRequisition } from '../model/IRequestRequisition';

@Injectable({
  providedIn: 'root'
})

export class RequestRequisitionService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'requisition';

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getRequestRequisitions(): Observable<IPaginationResponse<IRequestRequisition[]>> {
    return this.httpClient.get<IPaginationResponse<IRequestRequisition[]>>(this.baseUrl);
  }

  getRequestRequisitionById(id: number): Observable<IApiResponse<IRequestRequisition>> {
    return this.httpClient.get<IApiResponse<IRequestRequisition>>(this.baseUrl + '/' + id);
  }

  createRequestRequisition(requestRequisitionModel: IRequestRequisition): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, requestRequisitionModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateRequestRequisition(requestRequisitionModel: IRequestRequisition): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + '/' + requestRequisitionModel.id ,  requestRequisitionModel)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl + '/workflow', workflow);
  }

  uploadFile(id: number , file: File ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.requestRequisitionDate?.dateFrom, 'MM/d/y'))});
  }
}



