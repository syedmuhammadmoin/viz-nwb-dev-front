import { IBusinessPartner } from '../model/IBusinessPartner';
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

export class BusinessPartnerService {

    baseUrl = environment.baseUrl + 'BusinessPartner';
    
    constructor(private httpClient: HttpClient) {
    }

    getBusinessPartners(params: any): Observable<IPaginationResponse<IBusinessPartner[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
        return this.httpClient.get<IPaginationResponse<IBusinessPartner[]>>(this.baseUrl, {params: httpParams})
            .pipe(catchError(this.handleError));
    }

    getBusinessPartnersDropdown(): Observable<IApiResponse<IBusinessPartner[]>> {
        return this.httpClient.get<IApiResponse<IBusinessPartner[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getBusinessPartner(id: number): Observable<IApiResponse<IBusinessPartner>> {
        return this.httpClient.get<IApiResponse<IBusinessPartner>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addBusinessPartner(businessPartner: IBusinessPartner): Observable<IBusinessPartner>{
        return this.httpClient.post<IBusinessPartner>(`${this.baseUrl}`, businessPartner, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }
    
    updateBusinessPartner(businessPartner: IBusinessPartner): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
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
