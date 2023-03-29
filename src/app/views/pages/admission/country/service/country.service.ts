import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {ICountry} from '../models/ICountry';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'country';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<ICountry[]>> {
    return this.httpClient.get<IPaginationResponse<ICountry[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<ICountry[]>> {
    return this.httpClient.get<IApiResponse<ICountry[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<ICountry>> {
    return this.httpClient.get<IApiResponse<ICountry>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: ICountry): Observable<ICountry> {
    return this.httpClient.post<ICountry>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: ICountry): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
