import { Injectable, Injector} from '@angular/core';
import { IBankStatement} from '../model/IBankStatement';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable} from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class BankStatementService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'bankStmt';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getBankStatements(): Observable<IPaginationResponse<IBankStatement[]>> {
    return this.httpClient.get<IPaginationResponse<IBankStatement[]>>(this.baseUrl);
  }

  getBankStatement(id: number): Observable<IApiResponse<IBankStatement>> {
    return this.httpClient.get<IApiResponse<IBankStatement>>(`${this.baseUrl}/${id}`);
  }

  addBankStatement(model: { data: IBankStatement, files: File }): Observable<any> {
    const object: IBankStatement = model.data
    let params = new HttpParams();
    params = params.append('data', JSON.stringify(object));
    const formData = new FormData();
    formData.append('files', model.files);
    const options = {
      body: formData,
      params: params
    }
    return this.httpClient.request('post', `${this.baseUrl}`, options);
  }

  updateBankStatement(project: IBankStatement): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${project.id}`, project, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankAccountName?.filter )});
  }
}


