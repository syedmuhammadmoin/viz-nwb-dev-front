import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable} from "rxjs";
import { environment} from "../../../../../../environments/environment";
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IRequisition } from '../model/IRequisition';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})

export class RequisitionService {

  baseUrl = environment.baseUrl + 'requisition';

  constructor( private httpClient: HttpClient) { }

  getRequisitions(): Observable<IPaginationResponse<IRequisition[]>> {
    return this.httpClient.get<IPaginationResponse<IRequisition[]>>(this.baseUrl);
  }

  getRequisitionById(id: number): Observable<IApiResponse<IRequisition>> {
    return this.httpClient.get<IApiResponse<IRequisition>>(this.baseUrl + '/' + id);
  }

  createRequisition(requisitionModel: IRequisition): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, requisitionModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateRequisition(requisitionModel: IRequisition): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + '/' + requisitionModel.id ,  requisitionModel)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl + '/workflow', workflow);
  }
}



