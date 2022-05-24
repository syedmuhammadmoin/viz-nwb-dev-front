import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { environment } from 'src/environments/environment';
import { IEstimatedBudget } from '../model/IEstimatedBudget';

@Injectable({
  providedIn: 'root'
})
export class EstimatedBudgetService {

  baseUrl = environment.baseUrl + 'EstimatedBudget';

  constructor(private httpClient: HttpClient) { }

  getEstimatedBudgets(params: any): Observable<IPaginationResponse<IEstimatedBudget[]>> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
    return this.httpClient.get<IPaginationResponse<IEstimatedBudget[]>>(this.baseUrl , { params: httpParams})
  }

  getEstimatedBudgetDropdown(): Observable<IApiResponse<IEstimatedBudget[]>> {
    return this.httpClient.get<IApiResponse<IEstimatedBudget[]>>(this.baseUrl + '/dropdown')
  }

  getEstimatedBudgetById(id: number): Observable<IApiResponse<IEstimatedBudget>> {
    return this.httpClient.get<IApiResponse<IEstimatedBudget>>(this.baseUrl + '/' + id)
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
}
