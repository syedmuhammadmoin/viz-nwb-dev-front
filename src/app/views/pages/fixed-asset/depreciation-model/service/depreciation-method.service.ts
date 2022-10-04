import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IDepreciation } from '../model/IDepreciation';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})
export class DepreciationMethodService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'DepreciationModel';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getDepreciations(): Observable<IPaginationResponse<IDepreciation[]>> {
        return this.httpClient.get<IPaginationResponse<IDepreciation[]>>(this.baseUrl)
    }

    getDepreciationModelsDropdown(): Observable<IApiResponse<IDepreciation[]>> {
        return this.httpClient.get<IApiResponse<IDepreciation[]>>(this.baseUrl + '/dropdown')
    }

    getDepreciationById(id: number): Observable<IApiResponse<IDepreciation>> {
        return this.httpClient.get<IApiResponse<IDepreciation>>(`${this.baseUrl}/${id}`)
    }

    createDepreciation(Depreciation : IDepreciation): Observable<any>{
        return this.httpClient.post<any>(`${this.baseUrl}`, Depreciation, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateDepreciation(Depreciation: IDepreciation): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/${Depreciation.id}`, Depreciation, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankName?.filter)});
    }
}

