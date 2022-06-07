import { Injectable, Injector } from '@angular/core';
import { IInvoice } from '../model/IInvoice';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { ITransactionRecon } from '../../../purchase/vendorBill/model/ITransactionRecon';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';


@Injectable({
    providedIn: 'root'
})

export class InvoiceService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'Invoice';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getInvoices(params: any): Observable<IPaginationResponse<IInvoice[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);

        return this.httpClient.get<IPaginationResponse<IInvoice[]>>(this.baseUrl ,{ params: httpParams})
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
        return this.httpClient.post<ITransactionRecon>((environment.baseUrl + 'TransactionRecon'), transactionRecon, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.invoiceDate?.dateFrom, 'MM/d/y'))});
    }
}



