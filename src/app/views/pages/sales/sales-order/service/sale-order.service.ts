import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../../environments/environment";
import { ISalesOrder } from "../model/ISalesOrder";
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';



@Injectable({
  providedIn: 'root',
})
export class SaleOrderService {

  constructor( private httpClient: HttpClient ) { }

  getSalesOrders(): Observable<IPaginationResponse<ISalesOrder[]>> {
    return this.httpClient.get<IPaginationResponse<ISalesOrder[]>>(environment.baseUrl + 'salesOrder');
  }

  getSalesOrderById(id: number): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.get<IApiResponse<ISalesOrder>>(environment.baseUrl + 'salesOrder/' + id);
  }

  createSalesOrder(saleOrderModel: ISalesOrder): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.post<IApiResponse<ISalesOrder>>(environment.baseUrl + 'salesOrder', saleOrderModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateSalesOrder(soModel: ISalesOrder): Observable<IApiResponse<ISalesOrder>> {
    return this.httpClient.put<IApiResponse<ISalesOrder>>(environment.baseUrl + `salesOrder/${soModel.id}`, soModel , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'salesOrder' + '/workflow', workflow);
  }
}
