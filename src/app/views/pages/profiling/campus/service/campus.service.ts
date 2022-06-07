import { HttpClient, HttpErrorResponse, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ICampus } from '../model/ICampus';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class CampusService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'Campus';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCampuses(params: any): Observable<IPaginationResponse<ICampus[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
        return this.httpClient.get<IPaginationResponse<ICampus[]>>(this.baseUrl ,{ params: httpParams})
    }

    getCampusDropdown(): Observable<IApiResponse<ICampus[]>> {
        return this.httpClient.get<IApiResponse<ICampus[]>>(this.baseUrl + '/dropdown')
    }

    getCampusById(id: number): Observable<IApiResponse<ICampus>> {
        return this.httpClient.get<IApiResponse<ICampus>>(`${this.baseUrl}/${id}`)
    }

    addCampus(campus: ICampus): Observable<ICampus> {
        return this.httpClient.post<ICampus>(this.baseUrl, campus, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateCampus(campus: ICampus): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${campus.id}`, campus, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        console.log(params.filterModel )
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.name?.filter)});
      }
}

