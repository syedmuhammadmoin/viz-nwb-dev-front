import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IAccountingSettingModel } from '../accounting.component';

@Injectable({
  providedIn: 'root'
})
export class AccountingService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'AccountingSetting'; 

  constructor(private httpClient : HttpClient , private injector : Injector) { super(injector)}
  add(model: IAccountingSettingModel): Observable<any> {
    return this.httpClient.post<IAccountingSettingModel>(this.baseUrl, model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
  getById(id : number):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/${id}`)
  }
}
