import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICampus } from '../model/ICampus';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class CampusService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Campus';

    private header = new HttpHeaders().set("key", AppConst.apiKey)

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCampuses(): Observable<IPaginationResponse<ICampus[]>> {
        return this.httpClient.get<IPaginationResponse<ICampus[]>>(this.baseUrl , {headers: this.header})
    }

    getCampusDropdown(): Observable<IApiResponse<ICampus[]>> {
        return this.httpClient.get<IApiResponse<ICampus[]>>(this.baseUrl + '/dropdown')
    }

    getCampusById(id: number): Observable<IApiResponse<ICampus>> {
        return this.httpClient.get<IApiResponse<ICampus>>(`${this.baseUrl}/${id}`)
    }

    // addCampus(campus: ICampus): Observable<ICampus> {
    //     return this.httpClient.post<ICampus>(this.baseUrl, campus, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    // }

    // updateCampus(campus: ICampus): Observable<void> {
    //     return this.httpClient.put<void>(`${this.baseUrl}/${campus.id}`, campus, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    // }

    getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.name?.filter) , headers: this.header});
    }
}

