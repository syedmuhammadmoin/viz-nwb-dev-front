import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IFeeItem} from '../models/IFeeItem';
import {IFee} from '../../fee-type/model/IFee';

@Injectable({
  providedIn: 'root'
})
export class FeeItemService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'FeeItem';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.name?.filter)});
  }

  getAll(): Observable<IPaginationResponse<IFeeItem[]>> {
    return this.httpClient.get<IPaginationResponse<IFeeItem[]>>(this.baseUrl)
  }

  getForDropdown(): Observable<IApiResponse<IFeeItem[]>> {
    return this.httpClient.get<IApiResponse<IFeeItem[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<IFeeItem>> {
    return this.httpClient.get<IApiResponse<IFeeItem>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: IFeeItem): Observable<IFeeItem> {
    return this.httpClient.post<IFeeItem>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: IFeeItem): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
