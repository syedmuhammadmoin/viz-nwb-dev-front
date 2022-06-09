import { IProduct } from '../model/IProduct';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
    providedIn: 'root',
})

export class ProductService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'Product';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getProducts(params: any): Observable<IPaginationResponse<IProduct[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
        
        return this.httpClient.get<IPaginationResponse<IProduct[]>>(this.baseUrl,{ params: httpParams})
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
