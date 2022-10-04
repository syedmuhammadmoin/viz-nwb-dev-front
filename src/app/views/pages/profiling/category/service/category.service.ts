import { ICategory } from '../model/ICategory';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
    providedIn: 'root',
})

export class CategoryService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Category';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCategories(): Observable<IPaginationResponse<ICategory[]>> {
        return this.httpClient.get<IPaginationResponse<ICategory[]>>(this.baseUrl)
    }

    getCategoriesDropdown(): Observable<IApiResponse<ICategory[]>> {
        return this.httpClient.get<IApiResponse<ICategory[]>>(this.baseUrl + '/dropdown')
    }

    getCategory(id: number): Observable<IApiResponse<ICategory>> {
        return this.httpClient.get<IApiResponse<ICategory>>(`${this.baseUrl}/${id}`)
    }

    addCategory(category: ICategory): Observable<ICategory> {
        return this.httpClient.post<ICategory>(this.baseUrl, category, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateCategory(category: ICategory): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${category.id}`, category, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.name?.filter)});
    }
}