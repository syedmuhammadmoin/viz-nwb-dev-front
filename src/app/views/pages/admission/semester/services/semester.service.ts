import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {ISemester} from '../model/ISemester';

@Injectable({
  providedIn: 'root'
})
export class SemesterService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'semester';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.businessPartnerName?.filter)});
  }

  getAll(): Observable<IPaginationResponse<ISemester[]>> {
    return this.httpClient.get<IPaginationResponse<ISemester[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<ISemester[]>> {
    return this.httpClient.get<IApiResponse<ISemester[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<ISemester>> {
    return this.httpClient.get<IApiResponse<ISemester>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: ISemester): Observable<ISemester> {
    return this.httpClient.post<ISemester>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: ISemester): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
