import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {IPurchaseOrder} from "../model/IPurchaseOrder";
import { IWorkflow } from '../../vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService {

  constructor( private httpClient: HttpClient) { }

  getAllPurchaseOrders(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'purchaseOrder');
  }

  getPurchaseMasterById(id: number): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'purchaseOrder/' + id);
  }

  // getPurchaseDetailById(id: number): Observable<any> {
  //   return this.httpClient.get(environment.baseUrl + 'purchaseOrder/d/' + id);
  // }

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

  // workflow(workflow: IWorkflow): Observable<any> {
  //   return this.httpClient.post(environment.baseUrl + '/workflow', workflow);
  // }
}

