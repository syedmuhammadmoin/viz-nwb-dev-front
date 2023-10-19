import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IBudget } from '../model/Ibudget';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
export class BudgetReappropriationService extends AppServiceBase {


  baseUrl = AppConst.remoteServiceBaseUrl + 'BudgetReappropriation';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

  getBudgetReappropriations(): Observable<IPaginationResponse<IBudget[]>> {
    return this.httpClient.get<IPaginationResponse<IBudget[]>>(this.baseUrl);
  }

  createBudgetReappropriation(budgetReappropriation: IBudget): Observable<IApiResponse<IBudget>> {
    return this.httpClient.post<IApiResponse<IBudget>>(this.baseUrl, budgetReappropriation, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateBudgetReappropriation(budgetReappropriation: IBudget): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + '/' + budgetReappropriation.id, budgetReappropriation, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }
 
  getBudgetReapproById(id: number): Observable<IApiResponse<IBudget>> {
    return this.httpClient.get<IApiResponse<IBudget>>(this.baseUrl + '/' + id)
  }

  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl + '/workflow', workflow);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.budget?.filter) });
  }

}
