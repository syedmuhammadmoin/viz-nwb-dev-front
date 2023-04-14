import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { ISubject } from '../model/ISubject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'Subject';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getForDropdown(): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/dropdown');
  }

  updateSubject(body: ISubject): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'Subject/' + body.id, body);
  }

  createSubject(subject: ISubject): Observable<ISubject>{
    return this.httpClient.post<ISubject>(`${this.baseUrl}`, subject, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }

  getSubjectById(id: number): Observable<IApiResponse<ISubject>> {
      return this.httpClient.get<IApiResponse<ISubject>>(`${this.baseUrl}/${id}`)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }

}
