import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IState} from '../models/IState';

@Injectable({
  providedIn: 'root'
})
export class StateService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'state';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<IState[]>> {
    return this.httpClient.get<IPaginationResponse<IState[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<IState[]>> {
    return this.httpClient.get<IApiResponse<IState[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<IState>> {
    return this.httpClient.get<IApiResponse<IState>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: IState): Observable<IState> {
    return this.httpClient.post<IState>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: IState): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
