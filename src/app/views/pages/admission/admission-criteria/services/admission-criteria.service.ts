import {AppServiceBase} from '../../../../shared/app-service-base';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConst} from '../../../../shared/AppConst';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IBatch} from '../../batch/model/IBatch';
import {IApiResponse} from '../../../../shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AdmissionCriteriaService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'admissionCriteria';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<IBatch[]>> {
    return this.httpClient.get<IPaginationResponse<IBatch[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<IBatch[]>> {
    return this.httpClient.get<IApiResponse<IBatch[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<IBatch>> {
    return this.httpClient.get<IApiResponse<IBatch>>(`${this.baseUrl}/${id}`)
  }

  create(batch: IBatch): Observable<IApiResponse<IBatch>> {
    return this.httpClient.post<IApiResponse<IBatch>>(`${this.baseUrl}`, batch, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(batch: IBatch): Observable<IApiResponse<IBatch>> {
    return this.httpClient.put<IApiResponse<IBatch>>(`${this.baseUrl}/${batch.id}`, batch, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
