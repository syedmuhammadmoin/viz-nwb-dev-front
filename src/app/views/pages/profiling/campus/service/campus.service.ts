import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICampus } from '../model/ICampus';

@Injectable({
  providedIn: 'root'
})

export class CampusService {

    baseUrl = environment.baseUrl + 'Campus';
    
    constructor(private httpClient: HttpClient) { }

    getCampuses(params: any): Observable<IPaginationResponse<ICampus[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
        return this.httpClient.get<IPaginationResponse<ICampus[]>>(this.baseUrl ,{ params: httpParams})
            .pipe(catchError(this.handleError));
    }

    getCampusDropdown(): Observable<IApiResponse<ICampus[]>> {
        return this.httpClient.get<IApiResponse<ICampus[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getCampusById(id: number): Observable<IApiResponse<ICampus>> {
        return this.httpClient.get<IApiResponse<ICampus>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addCampus(campus: ICampus): Observable<ICampus> {
        return this.httpClient.post<ICampus>(this.baseUrl, campus, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    updateCampus(campus: ICampus): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${campus.id}`, campus, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}

