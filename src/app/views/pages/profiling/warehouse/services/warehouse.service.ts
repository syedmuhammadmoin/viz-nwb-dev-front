import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IWarehouse } from '../model/IWarehouse'
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class WarehouseService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'Warehouse';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getWarehouses(params: any): Observable<IPaginationResponse<IWarehouse[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
           
        return this.httpClient.get<IPaginationResponse<IWarehouse[]>>(this.baseUrl,{ params: httpParams})
    }

    getWarehousesDropdown(): Observable<IApiResponse<IWarehouse[]>> {
        return this.httpClient.get<IApiResponse<IWarehouse[]>>(this.baseUrl + '/dropdown')
    }

    getWarehouse(id: number): Observable<IApiResponse<IWarehouse>> {
        return this.httpClient.get<IApiResponse<IWarehouse>>(`${this.baseUrl}/${id}`)
    }

    addWarehouse(warehouse: IWarehouse): Observable<IWarehouse>{
        return this.httpClient.post<IWarehouse>(`${this.baseUrl}`, warehouse, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateWarehouse(warehouse: IWarehouse): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${warehouse.id}`, warehouse, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getWarehouseByCampusId(id: number): Observable<IApiResponse<IWarehouse>> {
        return this.httpClient.get<IApiResponse<IWarehouse>>(`${this.baseUrl}/getWarehouseByCampus/${id}`)
    }

    getRecords(params: any): Observable<any> {
       return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.name?.filter)});
    }
}
