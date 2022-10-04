import { IProduct } from '../model/IProduct';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
    providedIn: 'root',
})

export class ProductService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Product';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getProducts(): Observable<IPaginationResponse<IProduct[]>> {
        return this.httpClient.get<IPaginationResponse<IProduct[]>>(this.baseUrl)
    }

    getProductsDropdown(): Observable<IApiResponse<IProduct[]>> {
        return this.httpClient.get<IApiResponse<IProduct[]>>(this.baseUrl + '/dropdown')
    }

    getProduct(id: number): Observable<IApiResponse<IProduct>> {
        return this.httpClient.get<IApiResponse<IProduct>>(`${this.baseUrl}/${id}`)
    }

    addProduct(product: IProduct): Observable<IProduct>{
        return this.httpClient.post<IProduct>(`${this.baseUrl}`, product, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
    
    updateProduct(product: IProduct): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${product.id}`, product, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.productName?.filter)});
     }
}
