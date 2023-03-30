import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IAcademicDepartment } from '../model/IAcademicDepartment';
import { ICreateAcademicDepartment } from '../model/ICreateAcademicDepartment';

@Injectable({
  providedIn: 'root'
})
export class AcademicDepartmentService extends AppServiceBase {


  baseUrl = AppConst.remoteServiceBaseUrl + 'AcademicDepartment';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  createAcademicDepartment(academicDepartment: ICreateAcademicDepartment): Observable<IApiResponse<ICreateAcademicDepartment>> {
    return this.httpClient.post<IApiResponse<ICreateAcademicDepartment>>(this.baseUrl, academicDepartment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateAcademicDepartment(body: ICreateAcademicDepartment): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'AcademicDepartment/' + body.id, body);
  }
 
  getAcademicDepartmentById(id: number): Observable<IApiResponse<ICreateAcademicDepartment>> {
    return this.httpClient.get<IApiResponse<ICreateAcademicDepartment>>(this.baseUrl + '/' + id)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }


}