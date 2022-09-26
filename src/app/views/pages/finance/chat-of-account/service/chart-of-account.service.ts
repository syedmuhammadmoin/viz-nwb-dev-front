import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ILevel2} from '../model/ILevel2';
import {ILevel3} from '../level3/model/ILevel3';
import {ILevel4} from '../level4/model/ILevel4';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountService {
  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }

  getLevel2Account(): Observable<ILevel2[]> {
    return this.httpClient.get<ILevel2[]>(this.baseUrl + 'level2');
  }

  getLevel3Account(): Observable<ILevel3[]> {
    return this.httpClient.get<ILevel3[]>(this.baseUrl + 'level3');
  }

  getLevel4Accounts(): Observable <IPaginationResponse<ILevel4[]>> {
    return this.httpClient.get<IPaginationResponse<ILevel4[]>>(this.baseUrl + 'level4');
  }

  getLevel4AccountsDropdown(): Observable <IApiResponse<ILevel4[]>> {
    return this.httpClient.get<IApiResponse<ILevel4[]>>(this.baseUrl + 'level4/dropdown');
  }

  getLevel3AccountsDropdown(): Observable <IApiResponse<ILevel3[]>> {
    return this.httpClient.get<IApiResponse<ILevel3[]>>(this.baseUrl + 'level3/dropdown');
  }

  createLevel3Account(level3: ILevel3): Observable<ILevel3> {
    return this.httpClient.post<ILevel3>(this.baseUrl + 'level3', level3);
  }

  createLevel4Account(level4: ILevel4): Observable<ILevel4> {
    return this.httpClient.post<ILevel4>(this.baseUrl + 'level4', level4);
  }

  updateLevel4Account(level4: ILevel4): Observable<ILevel4> {
    const url = environment.baseUrl + 'level4/' + level4.id
    return this.httpClient.put<ILevel4>(url, level4);
  }

  updateLevel3Account(level3: ILevel3): Observable<ILevel3> {
    const url = environment.baseUrl + 'level3/' + level3.id
    return this.httpClient.put<ILevel3>(url, level3);
  }

  getChartOfAccount(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'coa');
  }

  getLevel3AccountById(id: number): Observable<ILevel3> {
    const url = environment.baseUrl + 'level3/' + id;
    return this.httpClient.get<ILevel3>(url);
  }

  getLevel4AccountById(id: number): Observable<ILevel4> {
    const url = environment.baseUrl + 'level4/' + id;
    return this.httpClient.get<ILevel4>(url);
  }

  getPayableAccounts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'level4/payables');
  }

  getReceivableAccounts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'level4/receivables');
  }

  getOtherAccounts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'level4/OtherAccounts');
  }

  getBudgetAccounts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'level4/budgetAccounts');
  }

  getAssetAccounts(): Observable<any> {
    return this.httpClient.get<any>(environment.baseUrl + 'level4/fixedAsset');
  }
}

