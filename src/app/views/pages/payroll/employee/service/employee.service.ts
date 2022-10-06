import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IEmployee } from '../model/IEmployee';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService extends AppServiceBase {

  private baseUrl = AppConst.remoteServiceBaseUrl + 'employee';

  private header = new HttpHeaders().set("key", "b4!V47w^e3QhItW_XY:jHgWQp%$&93nMS|h)Bj~R0&Q#J1m%lI^;b4C,&]Gf2(H_fu]5&X@1Oy~")

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector)}

    getEmployees(): Observable<IPaginationResponse<[]>> {
        return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl , {headers: this.header })
    }

    getEmployeesDropdown(): Observable<IApiResponse<[]>> {
      return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + '/dropdown')
    }

    getEmployeeById(id: number): Observable<IApiResponse<[]>> {
      return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + "/" + id)
    }

    updateEmployee(employee: IEmployee): Observable<void> {
      return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
    }

    getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null) , headers: this.header});
    }
}


