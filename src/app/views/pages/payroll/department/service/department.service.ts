import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IdepartmentInterface } from '../model/idepartment-interface';

@Injectable({
  providedIn: 'root'
})

export class DepartmentService extends AppServiceBase {

  private baseUrl = AppConst.remoteServiceBaseUrl + 'department';

  private header = new HttpHeaders().set("key", AppConst.apiKey)

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getDepartments(): Observable<IPaginationResponse<[]>> {
        return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl , {headers: this.header})
    }

    getDepartmentsDropdown(): Observable<IApiResponse<[]>> {
      return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + '/dropdown')
    }

    getDepartmentByCampusId(id: number): Observable<IApiResponse<any>> {
      return this.httpClient.get<IApiResponse<any>>(`${this.baseUrl}/GetDepartmentByCampus/${id}`)
    }

    getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null) , headers: this.header});
    }

    addDepartment(department : IdepartmentInterface[]): Observable<IdepartmentInterface>{
      return this.httpClient.post<IdepartmentInterface>(`${this.baseUrl}`, department, {headers: this.header})
}

getdepartmentById(id: number): Observable<IApiResponse<[]>> {
  return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + "/" + id)
}


updateDepartment(deparment: IdepartmentInterface): Observable<void> {
  return this.httpClient.put<void>(`${this.baseUrl}/${deparment.id}`, deparment, {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  })
}
}




