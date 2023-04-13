import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IShift} from '../model/IShift';

@Injectable({
  providedIn: 'root'
})
export class ShiftService extends AppServiceBase {
  baseUrl = AppConst.remoteServiceBaseUrl + 'shift';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<IShift[]>> {
    return this.httpClient.get<IPaginationResponse<IShift[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<IShift[]>> {
    return this.httpClient.get<IApiResponse<IShift[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<IShift>> {
    return this.httpClient.get<IApiResponse<IShift>>(`${this.baseUrl}/${id}`)
  }

  create(shift: IShift): Observable<IApiResponse<IShift>> {
    return this.httpClient.post<IApiResponse<IShift>>(`${this.baseUrl}`, shift, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(shift: IShift): Observable<IApiResponse<IShift>> {
    return this.httpClient.put<IApiResponse<IShift>>(`${this.baseUrl}/${shift.id}`, shift, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
