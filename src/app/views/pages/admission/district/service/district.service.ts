import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AppServiceBase } from "src/app/views/shared/app-service-base";
import { AppConst } from "src/app/views/shared/AppConst";
import { IApiResponse } from "src/app/views/shared/IApiResponse";
import { IDistrict } from "../model/IDistrict";

@Injectable({
  providedIn: 'root'
})
export class DistrictService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'District';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  createDistrict(district: IDistrict): Observable<IApiResponse<IDistrict>> {
    return this.httpClient.post<IApiResponse<IDistrict>>(this.baseUrl, district, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateDistrict(district: IDistrict): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${district.id}`, district, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  getDistrictById(id: number): Observable<IApiResponse<IDistrict>> {
    return this.httpClient.get<IApiResponse<IDistrict>>(this.baseUrl + '/' + id)
  }

  getDistrictDropdown(): Observable<IApiResponse<IDistrict[]>> {
    return this.httpClient.get<IApiResponse<IDistrict[]>>(this.baseUrl + '/dropdown');
  }

  getDistrictByCity(cityId: number): Observable<IApiResponse<IDistrict[]>> {
    return this.httpClient.get<IApiResponse<IDistrict[]>>(this.baseUrl + '/GetByCity' + cityId);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.name?.filter) });
  }

}
