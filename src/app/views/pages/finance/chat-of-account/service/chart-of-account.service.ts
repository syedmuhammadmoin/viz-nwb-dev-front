import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ILevel2} from '../model/ILevel2';
import {ILevel3} from '../level3/model/ILevel3';
import {ILevel4} from '../level4/model/ILevel4';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { Level4Filter } from '../model/Level4Filter';
import { Level4AccountModel } from '../model/Level4AccountModel';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountService extends AppServiceBase {
  baseUrl = AppConst.remoteServiceBaseUrl;
  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }


 
  getLevel2Account(): Observable<ILevel2[]> {
    return this.httpClient.get<ILevel2[]>(this.baseUrl + 'level2');
  }

  getLevel3Account(): Observable<ILevel3[]> {
    return this.httpClient.get<ILevel3[]>(this.baseUrl + 'level3');
  }

  // getLevel4Accounts(filter: any): Observable <IPaginationResponse<ILevel4[]>> {
  //   return this.httpClient.get<IPaginationResponse<ILevel4[]>>(this.baseUrl + 'level4');
  // }
  getLevel4Accounts(filter: Level4Filter): Observable<IPaginationResponse<ILevel4[]>> {
    const params = new HttpParams({ fromObject: filter as any });
    return this.httpClient.get<IPaginationResponse<ILevel4[]>>(this.baseUrl + 'level4', { params });
  }
  

  getLevel4AccountsDropdown(): Observable <IApiResponse<ILevel4[]>> {
    return this.httpClient.get<IApiResponse<ILevel4[]>>(this.baseUrl + 'level4/dropdown');
  }
  
  getLevel3AccountsDropdown(): Observable <IApiResponse<ILevel3[]>> {
    return this.httpClient.get<IApiResponse<ILevel3[]>>(this.baseUrl + 'level3/dropdown');
  }
  getAccountsTypeDropdown(): Observable <IApiResponse<ILevel3[]>> {
    return this.httpClient.get<IApiResponse<ILevel3[]>>(this.baseUrl + 'COA/Types');
  }
  createLevel3Account(level3: ILevel3): Observable<ILevel3> {
    return this.httpClient.post<ILevel3>(this.baseUrl + 'level3', level3);
  }

  createLevel4Account(level4: Level4AccountModel): Observable<ILevel4> {
    return this.httpClient.post<ILevel4>(this.baseUrl + 'level4', level4);
  }

  updateLevel4Account(level4: Level4AccountModel): Observable<ILevel4> {
    const url = AppConst.remoteServiceBaseUrl + 'level4/' + level4.id
    return this.httpClient.put<ILevel4>(url, level4);
  }

  updateLevel3Account(level3: ILevel3): Observable<ILevel3> {
    const url = AppConst.remoteServiceBaseUrl + 'level3/' + level3.id
    return this.httpClient.put<ILevel3>(url, level3);
  }

  getChartOfAccount(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'coa');
  }

  getLevel3AccountById(id: number): Observable<ILevel3> {
    const url = AppConst.remoteServiceBaseUrl + 'level3/' + id;
    return this.httpClient.get<ILevel3>(url);
  }

  getLevel4AccountById(id: number): Observable<ILevel4> {
    const url = AppConst.remoteServiceBaseUrl + 'level4/' + id;
    return this.httpClient.get<ILevel4>(url);
  }

  getPayableAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/payables');
  }

  getReceivableAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/receivables');
  }

  getOtherAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/OtherAccounts');
  }

  getBudgetAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/budgetAccounts');
  }

  getAssetAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/nonCurrentAsset');
  }
  getLiabilityAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/nonCurrentLiabilities');
  }
  getExpenseAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/expenseAccounts');
  }
  getIncomeAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/IncomeAccounts');
  }
  getCurrentAssetAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/CurrentAssetAccounts');
  }
  getCashBankAccounts(): Observable<any> {
    return this.httpClient.get<any>(AppConst.remoteServiceBaseUrl + 'level4/CashBankAccounts');
  }
  deleteCOA(id : string[]):Observable<any>{
    return this.httpClient.delete(`${AppConst.remoteServiceBaseUrl + "level4"}`,{
      body : id
    })
  }
}

