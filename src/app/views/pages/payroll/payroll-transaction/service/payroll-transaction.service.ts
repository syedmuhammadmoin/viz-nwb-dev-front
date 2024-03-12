import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPayrollTransaction } from '../model/IPayrollTransaction';

@Injectable({
    providedIn: 'root'
})

export class PayrollTransactionService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'payrollTransaction';
    //   private header = new HttpHeaders().set("key", AppConst.apiKey)

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getPayrollTransactions(): Observable<IPaginationResponse<IPayrollTransaction[]>> {
        return this.httpClient.get<IPaginationResponse<IPayrollTransaction[]>>(this.baseUrl)
    }

    getPayrollTransactionById(id: number): Observable<IApiResponse<IPayrollTransaction>> {
        return this.httpClient.get<IApiResponse<IPayrollTransaction>>(this.baseUrl + "/" + id)
    }

    createPayrollTransaction(payrollTransaction: IPayrollTransaction[]): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, payrollTransaction, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'key': AppConst.apiKey,
            })
        });
    }
    UpdateTransaction(payrollTransaction: IPayrollTransaction): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl + '/updateTransaction', payrollTransaction, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'key': AppConst.apiKey,
            })
        });
    }

    updatePayrollTransaction(payrollTransactionModel: IPayrollTransaction): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${payrollTransactionModel.id}`, payrollTransactionModel)
    }

    uploadFile(id: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null) });
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }
}
