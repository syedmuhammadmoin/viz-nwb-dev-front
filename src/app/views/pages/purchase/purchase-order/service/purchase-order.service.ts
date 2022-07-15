import { Injectable, Injector } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {IPurchaseOrder} from "../model/IPurchaseOrder";
import { IWorkflow } from '../../vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService extends AppServiceBase {

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getPurchaseOrders(): Observable<IPaginationResponse<IPurchaseOrder[]>> {
    return this.httpClient.get<IPaginationResponse<IPurchaseOrder[]>>(environment.baseUrl + 'purchaseOrder');
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

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + "purchaseOrder/", { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.poDate?.dateFrom, 'MM/d/y'))});
  }
}

