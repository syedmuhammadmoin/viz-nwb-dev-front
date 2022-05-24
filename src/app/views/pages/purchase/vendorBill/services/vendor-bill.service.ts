import { Injectable } from '@angular/core';
import { IVendorBill } from '../model/IVendorBill';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../model/IWorkflow';
import { ITransactionRecon } from '../model/ITransactionRecon';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Injectable({
  providedIn: 'root'
})

export class VendorBillService {

    baseUrl = environment.baseUrl + 'bill';
    constructor(private httpClient: HttpClient) {
    }

    getVendorBills(params: any): Observable<IPaginationResponse<IVendorBill[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
        return this.httpClient.get<IPaginationResponse<IVendorBill[]>>(this.baseUrl,{ params: httpParams})
    }

    getVendorBillById(id: number): Observable<IApiResponse<IVendorBill>> {
        return this.httpClient.get<IApiResponse<IVendorBill>>(`${this.baseUrl}/${id}`)
    }

    createVendorBill(ivendorBill: IVendorBill): Observable<IApiResponse<IVendorBill>> {
        return this.httpClient.post<IApiResponse<IVendorBill>>(this.baseUrl, ivendorBill, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateVendorBill(billModel: IVendorBill): Observable<IApiResponse<IVendorBill>> {
        return this.httpClient.put<IApiResponse<IVendorBill>>(this.baseUrl + `/${billModel.id}`, billModel)
      }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }
    
    createTransitionReconcile(transactionRecon: ITransactionRecon): Observable<any> {
        return this.httpClient.post<any>(environment.baseUrl + 'TransactionRecon', transactionRecon, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
    }
}

