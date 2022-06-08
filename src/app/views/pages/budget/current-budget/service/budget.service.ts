import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { environment } from 'src/environments/environment';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { IBudget } from '../model/IBudget';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IBudgetReport } from '../model/IBudgetReport';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class BudgetService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'Budget';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getBudgets(params: any): Observable<IPaginationResponse<IBudgetResponse[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
    return this.httpClient.get<IPaginationResponse<IBudgetResponse[]>>(this.baseUrl, { params: httpParams})
  }

  getBudgetDropdown(): Observable<IApiResponse<IBudgetResponse[]>> {
    return this.httpClient.get<IApiResponse<IBudgetResponse[]>>(this.baseUrl + '/dropdown')
  }

  getBudgetById(id: number): Observable<IApiResponse<IBudgetResponse>> {
    return this.httpClient.get<IApiResponse<IBudgetResponse>>(this.baseUrl + '/' + id)
  }

  createBudget(budget: IBudget): Observable<IApiResponse<IBudgetResponse>> {
    return this.httpClient.post<IApiResponse<IBudgetResponse>>(this.baseUrl , budget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateBudget(budget: IBudget): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + '/' + budget.id , budget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  getBudgetReport(body: IBudgetReport): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/budgetReport', body)
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.budgetName?.filter )});
  }

  // getBudgetComparisonReport(body: IBudgetComparisonReport): Observable<any> {
  //   return this.httpClient.post(this.baseUrl + '/budgetComparisonReport', body)
  // }
}
