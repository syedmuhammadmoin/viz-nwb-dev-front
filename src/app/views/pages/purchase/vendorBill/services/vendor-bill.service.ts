import { Injectable, Injector } from '@angular/core';
import { IVendorBill } from '../model/IVendorBill';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkflow } from '../model/IWorkflow';
import { ITransactionRecon } from '../model/ITransactionRecon';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class VendorBillService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'bill';
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getVendorBills(): Observable<IPaginationResponse<IVendorBill[]>> {
        return this.httpClient.get<IPaginationResponse<IVendorBill[]>>(this.baseUrl)
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
        return this.httpClient.post<any>(AppConst.remoteServiceBaseUrl + 'TransactionRecon', transactionRecon, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
    }

    uploadFile(id: number , file: File ): Observable<any> {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  }

    getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.billDate?.dateFrom, 'MM/d/y'))});
    }

    getAgingReport(): Observable<any> {
      return this.httpClient.get(`${this.baseUrl}/getAgingReport`);
    }

    getRecordByYearMonth(startDate: any, endDate: any,businessPartnerName:string): Observable<any> {        
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + "bill?startDate=" + startDate + '&endDate=' + endDate + "&businessPartner=" + businessPartnerName);
    }
}

