import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IEstimatedBudget } from '../model/IEstimatedBudget';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
export class EstimatedBudgetService extends AppServiceBase{

  baseUrl = AppConst.remoteServiceBaseUrl + 'EstimatedBudget';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector)}

  getEstimatedBudgets(): Observable<IPaginationResponse<IEstimatedBudget[]>> {
    return this.httpClient.get<IPaginationResponse<IEstimatedBudget[]>>(this.baseUrl)
  }

  getEstimatedBudgetDropdown(): Observable<IApiResponse<IEstimatedBudget[]>> {
    return this.httpClient.get<IApiResponse<IEstimatedBudget[]>>(this.baseUrl + '/dropdown')
  }

  getEstimatedBudgetById(id: number): Observable<IApiResponse<IEstimatedBudget>> {
    return this.httpClient.get<IApiResponse<IEstimatedBudget>>(this.baseUrl + '/' + id)
  }
  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl + '/workflow', workflow);
  }

  createEstimatedBudget(estimatedBudget: IEstimatedBudget): Observable<IApiResponse<IEstimatedBudget>> {
    return this.httpClient.post<IApiResponse<IEstimatedBudget>>(this.baseUrl , estimatedBudget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  updateEstimatedBudget(estimatedBudget: IEstimatedBudget): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + '/' + estimatedBudget.id , estimatedBudget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.estimatedBudgetName?.filter )});
  }
}
