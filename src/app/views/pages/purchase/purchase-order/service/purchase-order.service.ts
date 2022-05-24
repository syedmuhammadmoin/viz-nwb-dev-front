import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {IPurchaseOrder} from "../model/IPurchaseOrder";
import { IWorkflow } from '../../vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService {

  constructor( private httpClient: HttpClient) { }

  getPurchaseOrders(params: any): Observable<IPaginationResponse<IPurchaseOrder[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
    return this.httpClient.get<IPaginationResponse<IPurchaseOrder[]>>(environment.baseUrl + 'purchaseOrder' , { params: httpParams});
  }

  getPurchaseOrderById(id: number): Observable<IApiResponse<IPurchaseOrder>> {
    return this.httpClient.get<IApiResponse<IPurchaseOrder>>(environment.baseUrl + 'purchaseOrder/' + id);
  }

  createPurchaseOrder(purchaseOrderModel: IPurchaseOrder): Observable<any> {
    return this.httpClient.post<IPurchaseOrder>(environment.baseUrl + 'purchaseOrder', purchaseOrderModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })}
    );
  }

  updatePurchaseOrder(poModel: IPurchaseOrder): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `purchaseOrder/${poModel.id}`, poModel)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'purchaseOrder/workflow', workflow);
  }
}

