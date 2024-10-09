import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { ITaxSettingModel } from '../model/ITaxSettingModel';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})
export class TaxsettingService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'TaxSetting';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  add(model: ITaxSettingModel): Observable<any> {
    return this.httpClient.post<ITaxSettingModel>(this.baseUrl, model, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
  getById(id : number):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}/${id}`)
  }

}
