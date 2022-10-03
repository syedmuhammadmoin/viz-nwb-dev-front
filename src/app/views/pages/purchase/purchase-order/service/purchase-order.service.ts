import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { IPurchaseOrder } from "../model/IPurchaseOrder";
import { IWorkflow } from '../../vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class PurchaseOrderService extends AppServiceBase {

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getPurchaseOrders(): Observable<IPaginationResponse<IPurchaseOrder[]>> {
    return this.httpClient.get<IPaginationResponse<IPurchaseOrder[]>>(AppConst.remoteServiceBaseUrl + 'purchaseOrder');
  }

  getPurchaseOrderById(id: number): Observable<IApiResponse<IPurchaseOrder>> {
    return this.httpClient.get<IApiResponse<IPurchaseOrder>>(AppConst.remoteServiceBaseUrl + 'purchaseOrder/' + id);
  }

  createPurchaseOrder(purchaseOrderModel: IPurchaseOrder): Observable<any> {
    return this.httpClient.post<IPurchaseOrder>(AppConst.remoteServiceBaseUrl + 'purchaseOrder', purchaseOrderModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })}
    );
  }

  updatePurchaseOrder(poModel: IPurchaseOrder): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + `purchaseOrder/${poModel.id}`, poModel)
  }

  uploadFile(id: number , file: File ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<any>(`${AppConst.remoteServiceBaseUrl}purchaseOrder/DocUpload/${id}`, formData)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'purchaseOrder/workflow', workflow);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + "purchaseOrder/", { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.poDate?.dateFrom, 'MM/d/y'))});
  }
}

