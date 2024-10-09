import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICurrency } from '../model/ICurrency';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class CurrencyService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'currency';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCurrencyes(): Observable<IPaginationResponse<ICurrency[]>> {
        return this.httpClient.get<IPaginationResponse<ICurrency[]>>(this.baseUrl)
    }

    getCurrency(id: number): Observable<IApiResponse<ICurrency>> {
        return this.httpClient.get<IApiResponse<ICurrency>>(`${this.baseUrl}/${id}`)
    }
    add(Currency: ICurrency): Observable<ICurrency> {
        return this.httpClient.post<ICurrency>(this.baseUrl , Currency, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
    updateCurrency(Currency: ICurrency): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${Currency.id}`, Currency, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
     }

     deleteCurrencyes(id : string[]):Observable<any>{
        return this.httpClient.delete(`${AppConst.remoteServiceBaseUrl + "Currency"}`,{
          body : id
        })
      }
}




