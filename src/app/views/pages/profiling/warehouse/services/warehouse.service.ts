import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWarehouse } from '../model/IWarehouse'
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class WarehouseService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Warehouse';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getWarehouses(): Observable<IPaginationResponse<IWarehouse[]>> {
        return this.httpClient.get<IPaginationResponse<IWarehouse[]>>(this.baseUrl)
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
