import {Injectable, Injector} from '@angular/core';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {IProgram} from '../models/IProgram';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends AppServiceBase {
  baseUrl = AppConst.remoteServiceBaseUrl + 'program';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<IProgram[]>> {
    return this.httpClient.get<IPaginationResponse<IProgram[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<IProgram[]>> {
    return this.httpClient.get<IApiResponse<IProgram[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<IProgram>> {
    return this.httpClient.get<IApiResponse<IProgram>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: IProgram): Observable<IApiResponse<IProgram>> {
    return this.httpClient.post<IApiResponse<IProgram>>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: IProgram): Observable<IApiResponse<IProgram>> {
    return this.httpClient.put<IApiResponse<IProgram>>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
