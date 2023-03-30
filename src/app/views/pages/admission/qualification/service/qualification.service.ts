import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IQualification } from '../model/IQualification';

@Injectable({
  providedIn: 'root'
})
export class QualificationService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'Qualification';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  updateQualification(body: IQualification): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'Qualification/' + body.id, body);
  }

  createQualification(qualification: IQualification): Observable<IQualification>{
    return this.httpClient.post<IQualification>(`${this.baseUrl}`, qualification, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    })
  }

  getQualificationDropdown(): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/dropdown');
  }

  getQualificationById(id: number): Observable<IApiResponse<IQualification>> {
      return this.httpClient.get<IApiResponse<IQualification>>(`${this.baseUrl}/${id}`)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }

}
