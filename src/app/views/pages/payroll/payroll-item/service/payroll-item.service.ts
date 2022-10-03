import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPayrollItem } from '../model/IPayrollItem';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class PayrollItemService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'payrollItem';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getPayrollItems(): Observable<IPaginationResponse<IPayrollItem[]>> {
        return this.httpClient.get<IPaginationResponse<IPayrollItem[]>>(this.baseUrl)
    }

    getPayrollItemById(id: number): Observable<IApiResponse<IPayrollItem>> {
        return this.httpClient.get<IApiResponse<IPayrollItem>>(`${this.baseUrl}/${id}`)
    }

    createPayrollItem(payrollItem: IPayrollItem): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, payrollItem, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    getRecords(params: any): Observable<any> {
       return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
    }

    updatePayrollItem(payrollItemModel: IPayrollItem): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${payrollItemModel.id}`, payrollItemModel)
    }

    getBasicPay(): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + '/basicpays')
    }
    
    getIncrements(): Observable<any> {
        return this.httpClient.get<any>(this.baseUrl + '/increments')
    }
    
    getDeductions(): Observable<any> {
        return this.httpClient.get(this.baseUrl + '/others')
    }
}





