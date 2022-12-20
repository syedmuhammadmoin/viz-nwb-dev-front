import { Injectable, Injector } from '@angular/core';
import { IQuotation } from '../model/IQuotation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
    providedIn: 'root'
})

export class QuotationService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Quotation';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getQuotations(): Observable<IPaginationResponse<IQuotation[]>> {
        return this.httpClient.get<IPaginationResponse<IQuotation[]>>(this.baseUrl)
    }

    getQuotationById(id: number): Observable<IApiResponse<IQuotation>> {
        return this.httpClient.get<IApiResponse<IQuotation>>(`${this.baseUrl}/${id}`)
    }

    createQuotation(Invoice: IQuotation): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, Invoice, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateQuotation(invoiceModel: IQuotation): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${invoiceModel.id}`, invoiceModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    uploadFile(id: number , file: File ): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.invoiceDate?.dateFrom, 'MM/d/y'))});
    }
}



