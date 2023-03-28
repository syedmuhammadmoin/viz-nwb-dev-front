import {Injectable, Injector} from '@angular/core';
import {AppServiceBase} from '../../../../shared/app-service-base';
import {AppConst} from '../../../../shared/AppConst';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPaginationResponse} from '../../../../shared/IPaginationResponse';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {ICourse} from '../model/ICourse';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'Course';

  constructor(
    private httpClient: HttpClient,
    injector: Injector
  ) {
    super(injector)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, {params: this.getfilterParams(params, null, params?.filterModel?.businessPartnerName?.filter)});
  }

  getAll(): Observable<IPaginationResponse<ICourse[]>> {
    return this.httpClient.get<IPaginationResponse<ICourse[]>>(this.baseUrl)
  }

  getCoursesForDropdown(): Observable<IApiResponse<ICourse[]>> {
    return this.httpClient.get<IApiResponse<ICourse[]>>(this.baseUrl + '/dropdown')
  }

  getById(id: number): Observable<IApiResponse<ICourse>> {
    return this.httpClient.get<IApiResponse<ICourse>>(`${this.baseUrl}/${id}`)
  }

  create(businessPartner: ICourse): Observable<ICourse> {
    return this.httpClient.post<ICourse>(`${this.baseUrl}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  update(businessPartner: ICourse): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${businessPartner.id}`, businessPartner, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
}
