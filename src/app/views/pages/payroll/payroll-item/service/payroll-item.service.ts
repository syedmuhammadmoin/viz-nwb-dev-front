import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPayrollItem } from '../model/IPayrollItem';


@Injectable({
  providedIn: 'root'
})

export class PayrollItemService {

  baseUrl = environment.baseUrl + 'payrollItem';

    constructor(private httpClient: HttpClient) { }

    getPayrollItems(): Observable<IPaginationResponse<IPayrollItem[]>> {
        return this.httpClient.get<IPaginationResponse<IPayrollItem[]>>(this.baseUrl)
    }

    getEmployees(): Observable<IPaginationResponse<any[]>> {
        return this.httpClient.get<IPaginationResponse<any[]>>(environment.baseUrl + 'employee', { headers: new HttpHeaders().set("key", "b4!V47w^e3QhItW_XY:jHgWQp%$&93nMS|h)Bj~R0&Q#J1m%lI^;b4C,&]Gf2(H_fu]5&X@1Oy~")})
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

    updatePayrollItem(payrollItemModel: IPayrollItem): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${payrollItemModel.id}`, payrollItemModel)
    }

    // workflow(workflow: IWorkflow): Observable<any> {
    //     return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    // }
}





