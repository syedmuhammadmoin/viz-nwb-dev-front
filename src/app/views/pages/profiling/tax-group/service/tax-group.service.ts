import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { Observable } from 'rxjs';
import { ITaxGroupModel } from '../model/ITaxGroupModel';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})
export class TaxGroupService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'TaxGroup';
    
    constructor(private httpClient: HttpClient,injector : Injector) {super(injector) }

    getAll(): Observable<IPaginationResponse<ITaxGroupModel[]>> {
        return this.httpClient.get<IPaginationResponse<ITaxGroupModel[]>>(this.baseUrl)
    }

    get(id: number): Observable<IApiResponse<ITaxGroupModel>> {
        return this.httpClient.get<IApiResponse<ITaxGroupModel>>(`${this.baseUrl}/${id}`)
    }
    add(tax: ITaxGroupModel): Observable<any> {
        return this.httpClient.post<ITaxGroupModel>(this.baseUrl , tax, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
    update(tax: ITaxGroupModel): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${tax.id}`, tax, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
     }

     deleteAll(id : string[]):Observable<any>{
        return this.httpClient.delete(`${AppConst.remoteServiceBaseUrl + "TaxGroup"}`,{
          body : id
        })
      }
  
}
