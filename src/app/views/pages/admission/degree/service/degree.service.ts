import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IDegree } from '../model/IDegree';

@Injectable({
  providedIn: 'root'
})
export class DegreeService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'Degree';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getDegreeDropdown(): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/dropdown');
  }

  updateDegree(body: IDegree): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'Degree/' + body.id, body);
  }

  createDegree(degree: IDegree): Observable<IDegree>{
    return this.httpClient.post<IDegree>(`${this.baseUrl}`, degree, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }

  getDegreeId(id: number): Observable<IApiResponse<IDegree>> {
      return this.httpClient.get<IApiResponse<IDegree>>(`${this.baseUrl}/${id}`)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }
  
}