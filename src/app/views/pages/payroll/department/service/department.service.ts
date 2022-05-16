import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class DepartmentService {

  baseUrl = environment.baseUrl + 'department';

    constructor(private httpClient: HttpClient) { }

    getDepartments(): Observable<IPaginationResponse<[]>> {
        return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl , { headers: new HttpHeaders().set("key", "b4!V47w^e3QhItW_XY:jHgWQp%$&93nMS|h)Bj~R0&Q#J1m%lI^;b4C,&]Gf2(H_fu]5&X@1Oy~")})
    }

    getDepartmentsDropdown(): Observable<IApiResponse<[]>> {
      return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + '/dropdown')
    }
}





