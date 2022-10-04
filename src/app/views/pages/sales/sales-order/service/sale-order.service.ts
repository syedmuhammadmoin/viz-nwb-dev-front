import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ISalesOrder } from "../model/ISalesOrder";
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';



@Injectable({
  providedIn: 'root',
})
export class SaleOrderService {

  constructor( private httpClient: HttpClient ) { }

  getSalesOrders(): Observable<IPaginationResponse<ISalesOrder[]>> {
    return this.httpClient.get<IPaginationResponse<ISalesOrder[]>>(AppConst.remoteServiceBaseUrl + 'salesOrder');
  }

  getSalesOrderById(id: number): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.get<IApiResponse<ISalesOrder>>(AppConst.remoteServiceBaseUrl + 'salesOrder/' + id);
  }

  createSalesOrder(saleOrderModel: ISalesOrder): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.post<IApiResponse<ISalesOrder>>(AppConst.remoteServiceBaseUrl + 'salesOrder', saleOrderModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateSalesOrder(soModel: ISalesOrder): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.put<IApiResponse<ISalesOrder>>(AppConst.remoteServiceBaseUrl + `salesOrder/${soModel.id}`, soModel , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'salesOrder' + '/workflow', workflow);
  }
}
