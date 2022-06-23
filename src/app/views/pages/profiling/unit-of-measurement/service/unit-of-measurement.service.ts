import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IUnitOfMeasurement } from '../model/IUnitOfMeasurement';


@Injectable({
  providedIn: 'root'
})

export class UnitOfMeasurementService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'unitOfMeasurement';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getUnitOfMeasurements(params: any): Observable<IPaginationResponse<IUnitOfMeasurement[]>> {
        let httpParams = new HttpParams();

        httpParams = httpParams.append('PageStart', params?.startRow);
        httpParams = httpParams.append('PageEnd', params?.endRow);
        
        return this.httpClient.get<IPaginationResponse<IUnitOfMeasurement[]>>(this.baseUrl,{ params: httpParams})
    }

    // getProductsDropdown(): Observable<IApiResponse<IUnitOfMeasurement[]>> {
    //     return this.httpClient.get<IApiResponse<IUnitOfMeasurement[]>>(this.baseUrl + '/dropdown')
    // }

    getUnitOfMeasurement(id: number): Observable<IApiResponse<IUnitOfMeasurement>> {
        return this.httpClient.get<IApiResponse<IUnitOfMeasurement>>(`${this.baseUrl}/${id}`)
    }

    addUnitOfMeasurement(product: IUnitOfMeasurement): Observable<IUnitOfMeasurement>{
        return this.httpClient.post<IUnitOfMeasurement>(`${this.baseUrl}`, product, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
    
    updateUnitOfMeasurement(unitOfMeasurement: IUnitOfMeasurement): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${unitOfMeasurement.id}`, unitOfMeasurement, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
     }
}





