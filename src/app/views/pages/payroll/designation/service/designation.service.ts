import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class DesignationService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'designation';

  private header = new HttpHeaders().set("key", "b4!V47w^e3QhItW_XY:jHgWQp%$&93nMS|h)Bj~R0&Q#J1m%lI^;b4C,&]Gf2(H_fu]5&X@1Oy~")

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getDesignations(params): Observable<IPaginationResponse<[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
    return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl , { params: httpParams, headers: this.header})
  }

  getDesignationsDropdown(): Observable<IApiResponse<[]>> {
    return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + '/dropdown')
  }  

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null) , headers: this.header});  
  }
}


