import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { environment } from 'src/environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPayrollTransaction } from '../model/IPayrollTransaction';

@Injectable({
  providedIn: 'root'
})

export class PayrollTransactionService {

  baseUrl = environment.baseUrl + 'payrollTransaction';

    constructor(private httpClient: HttpClient) { }

    getPayrollTransactions(params): Observable<IPaginationResponse<IPayrollTransaction[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
   
        return this.httpClient.get<IPaginationResponse<IPayrollTransaction[]>>(this.baseUrl , {params: httpParams})
    }

    getPayrollTransactionById(id: number): Observable<IApiResponse<IPayrollTransaction>> {
        return this.httpClient.get<IApiResponse<IPayrollTransaction>>(this.baseUrl + "/" + id)      
    }

    createPayrollTransaction(payrollTransaction: IPayrollTransaction): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, payrollTransaction, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updatePayrollTransaction(payrollTransactionModel: IPayrollTransaction): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${payrollTransactionModel.id}`, payrollTransactionModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }
}
