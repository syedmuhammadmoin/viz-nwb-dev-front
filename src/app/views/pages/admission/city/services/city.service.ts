import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {ICity} from '../models/ICity';

@Injectable({
  providedIn: 'root'
})
export class CityService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'city';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<ICity[]>> {
    return this.httpClient.get<IPaginationResponse<ICity[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<ICity[]>> {
    return this.httpClient.get<IApiResponse<ICity[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<ICity>> {
    return this.httpClient.get<IApiResponse<ICity>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: ICity): Observable<ICity> {
    return this.httpClient.post<ICity>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: ICity): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
