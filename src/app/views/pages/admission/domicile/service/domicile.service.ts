import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AppServiceBase } from "src/app/views/shared/app-service-base";
import { AppConst } from "src/app/views/shared/AppConst";
import { IApiResponse } from "src/app/views/shared/IApiResponse";
import { IDomicile } from "../model/IDomicile";

@Injectable({
  providedIn: 'root'
})
export class DomicileService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'Domicile';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  createDomicile(domicile: IDomicile): Observable<IApiResponse<IDomicile>> {
    return this.httpClient.post<IApiResponse<IDomicile>>(this.baseUrl, domicile, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateDomicile(domicile: IDomicile): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${domicile.id}`, domicile, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
 
  getDomicileById(id: number): Observable<IApiResponse<IDomicile>> {
    return this.httpClient.get<IApiResponse<IDomicile>>(this.baseUrl + '/' + id)
  }

  getDomicileDropdown(): Observable<IApiResponse<IDomicile[]>> {
    return this.httpClient.get<IApiResponse<IDomicile[]>>(this.baseUrl + '/dropdown');
  }

  getDomicileByDistrict(DistrictId :number): Observable<IApiResponse<IDomicile[]>> {
    return this.httpClient.get<IApiResponse<IDomicile[]>>(this.baseUrl + '/GetByDistrict' + DistrictId);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }

}
