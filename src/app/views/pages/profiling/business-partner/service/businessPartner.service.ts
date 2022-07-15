import { IBusinessPartner } from '../model/IBusinessPartner';
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

export class BusinessPartnerService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'BusinessPartner';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getBusinessPartners(): Observable<IPaginationResponse<IBusinessPartner[]>> {
        return this.httpClient.get<IPaginationResponse<IBusinessPartner[]>>(this.baseUrl)
    }

    getBusinessPartnersDropdown(): Observable<IApiResponse<IBusinessPartner[]>> {
        return this.httpClient.get<IApiResponse<IBusinessPartner[]>>(this.baseUrl + '/dropdown')
    }

    getBusinessPartner(id: number): Observable<IApiResponse<IBusinessPartner>> {
        return this.httpClient.get<IApiResponse<IBusinessPartner>>(`${this.baseUrl}/${id}`)
    }

    addBusinessPartner(businessPartner: IBusinessPartner): Observable<IBusinessPartner>{
        return this.httpClient.post<IBusinessPartner>(`${this.baseUrl}`, businessPartner, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
       return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.businessPartnerName?.filter)});
    }
    
    updateBusinessPartner(businessPartner: IBusinessPartner): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
}
