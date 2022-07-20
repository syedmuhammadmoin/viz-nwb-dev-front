import { ICategory } from '../model/ICategory';
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

export class CategoryService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'Category';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCategories(): Observable<IPaginationResponse<ICategory[]>> {
        return this.httpClient.get<IPaginationResponse<ICategory[]>>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getCategoriesDropdown(): Observable<IApiResponse<ICategory[]>> {
        return this.httpClient.get<IApiResponse<ICategory[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getCategory(id: number): Observable<IApiResponse<ICategory>> {
        return this.httpClient.get<IApiResponse<ICategory>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addCategory(category: ICategory): Observable<ICategory> {
        return this.httpClient.post<ICategory>(this.baseUrl, category, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError));
    }

    updateCategory(category: ICategory): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${category.id}`, category, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.name?.filter)});
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