import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IFaculty } from '../model/IFaculty';

@Injectable({
  providedIn: 'root'
})
export class FacultyService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'Faculty';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getFacultyDropdown(): Observable<IApiResponse<IFaculty[]>> {
    return this.httpClient.get<IApiResponse<IFaculty[]>>(this.baseUrl + '/dropdown')
  }

  updateFaculty(body: IFaculty): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'Faculty/' + body.id, body);
  }

  createFaculty(faculty: IFaculty): Observable<IFaculty>{
    return this.httpClient.post<IFaculty>(`${this.baseUrl}`, faculty, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }

  getFacultyById(id: number): Observable<IApiResponse<IFaculty>> {
      return this.httpClient.get<IApiResponse<IFaculty>>(`${this.baseUrl}/${id}`)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }

}
