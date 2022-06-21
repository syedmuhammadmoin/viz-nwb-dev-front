import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ITax } from '../model/ITax';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class TaxService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'tax';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getTaxes(params: any): Observable<IPaginationResponse<ITax[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
        
        return this.httpClient.get<IPaginationResponse<ITax[]>>(this.baseUrl,{ params: httpParams})
    }

    // getProductsDropdown(): Observable<IApiResponse<ITax[]>> {
    //     return this.httpClient.get<IApiResponse<ITax[]>>(this.baseUrl + '/dropdown')
    // }

    getTax(id: number): Observable<IApiResponse<ITax>> {
        return this.httpClient.get<IApiResponse<ITax>>(`${this.baseUrl}/${id}`)
    }

    // addProduct(product: ITax): Observable<ITax>{
    //     return this.httpClient.post<ITax>(`${this.baseUrl}`, product, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    // }
    
    updateTax(tax: ITax): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${tax.id}`, tax, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
     }
}




