import { IProduct } from '../model/IProduct';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
    providedIn: 'root',
})

export class ProductService {

    baseUrl = environment.baseUrl + 'Product';
    
    constructor(private httpClient: HttpClient) { }

    getProducts(params: any): Observable<IPaginationResponse<IProduct[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
        
        return this.httpClient.get<IPaginationResponse<IProduct[]>>(this.baseUrl,{ params: httpParams})
            .pipe(catchError(this.handleError));
    }

    getProductsDropdown(): Observable<IApiResponse<IProduct[]>> {
        return this.httpClient.get<IApiResponse<IProduct[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getProduct(id: number): Observable<IApiResponse<IProduct>> {
        return this.httpClient.get<IApiResponse<IProduct>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addProduct(product: IProduct): Observable<IProduct>{
        return this.httpClient.post<IProduct>(`${this.baseUrl}`, product, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }
    
    updateProduct(product: IProduct): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${product.id}`, product, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    // for error handling.....
    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}
