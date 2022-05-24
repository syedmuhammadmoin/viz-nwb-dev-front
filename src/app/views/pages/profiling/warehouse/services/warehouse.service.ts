import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IWarehouse } from '../model/IWarehouse'
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class WarehouseService {

    baseUrl = environment.baseUrl + 'Warehouse';
    
    constructor(private httpClient: HttpClient) { }

    getWarehouses(params: any): Observable<IPaginationResponse<IWarehouse[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
           
        return this.httpClient.get<IPaginationResponse<IWarehouse[]>>(this.baseUrl,{ params: httpParams})
            .pipe(catchError(this.handleError));
    }

    getWarehousesDropdown(): Observable<IApiResponse<IWarehouse[]>> {
        return this.httpClient.get<IApiResponse<IWarehouse[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getWarehouse(id: number): Observable<IApiResponse<IWarehouse>> {
        return this.httpClient.get<IApiResponse<IWarehouse>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addWarehouse(warehouse: IWarehouse): Observable<IWarehouse>{
        return this.httpClient.post<IWarehouse>(`${this.baseUrl}`, warehouse, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateWarehouse(warehouse: IWarehouse): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${warehouse.id}`, warehouse, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    deleteWarehouse(id: number) : Observable<void>{
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
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
