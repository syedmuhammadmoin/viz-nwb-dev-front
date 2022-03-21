import { IDepartment } from '../model/IDepartment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
    providedIn: 'root',
  })
export class DepartmentService {

    baseUrl = environment.baseUrl + 'Department';
    
    constructor(private httpClient: HttpClient) { }

    getDepartments(): Observable<IPaginationResponse<IDepartment[]>> {
        return this.httpClient.get<IPaginationResponse<IDepartment[]>>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getDepartmentsDropdown(): Observable<IApiResponse<IDepartment[]>> {
        return this.httpClient.get<IApiResponse<IDepartment[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getDepartment(id: number): Observable<IApiResponse<IDepartment>> {
        return this.httpClient.get<IApiResponse<IDepartment>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addDepartment(department: IDepartment): Observable<IDepartment>{
        return this.httpClient.post<IDepartment>(`${this.baseUrl}`, department, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateDepartment(department: IDepartment): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${department.id}`, department, {
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
