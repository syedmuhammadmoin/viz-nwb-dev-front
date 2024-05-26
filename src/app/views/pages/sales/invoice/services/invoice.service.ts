import { Injectable, Injector } from '@angular/core';
import { IInvoice } from '../model/IInvoice';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
    providedIn: 'root'
})

export class InvoiceService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Invoice';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getInvoices(): Observable<IPaginationResponse<IInvoice[]>> {
        return this.httpClient.get<IPaginationResponse<IInvoice[]>>(this.baseUrl)
    }

    getInvoiceById(id: number): Observable<IApiResponse<IInvoice>> {
        return this.httpClient.get<IApiResponse<IInvoice>>(`${this.baseUrl}/${id}`)
    }

    createInvoice(Invoice: IInvoice): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, Invoice, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateInvoice(invoiceModel: IInvoice): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${invoiceModel.id}`, invoiceModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    reconcilePayment(transactionRecon: ITransactionRecon): Observable<any> {
        return this.httpClient.post<ITransactionRecon>((AppConst.remoteServiceBaseUrl + 'TransactionRecon'), transactionRecon, {
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
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.invoiceDate?.dateFrom, 'MM/d/y'))});
    }

    getAgingReport(): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/getAgingReport`);
    } 

    getRecordByYearMonth(startDate: any, endDate: any,businessPartnerName:any): Observable<any> {        
        return this.httpClient.get(AppConst.remoteServiceBaseUrl + "Invoice?startDate=" + startDate + '&endDate=' + endDate + "&businessPartner=" + businessPartnerName);
      }
}



