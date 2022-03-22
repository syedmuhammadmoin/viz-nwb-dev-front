import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { environment } from 'src/environments/environment';
import { IBudgetDropdown } from '../model/IBudgetDropdown';
import { IBudgetResponse } from '../model/IBudgetResponse';
import { IBudget } from '../model/IBudget';

@Injectable({
  providedIn: 'root'
})

export class BudgetService {

  baseUrl = environment.baseUrl + 'Budget';

  constructor(private httpClient: HttpClient) { }

  getBudgets(): Observable<IBudgetResponse[]> {
    return this.httpClient.get<IBudgetResponse[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getBudgetDropdown(): Observable<IApiResponse<IBudgetDropdown[]>> {
    return this.httpClient.get<IApiResponse<IBudgetDropdown[]>>(this.baseUrl + '/dropdown')
      .pipe(catchError(this.handleError));
  }

  getBudgetById(id: number): Observable<IBudgetResponse> {
    return this.httpClient.get<IBudgetResponse>(this.baseUrl + '/' + id)
      .pipe(catchError(this.handleError));
  }

  createBudget(budget: IBudget): Observable<any> {
    return this.httpClient.post<IBudget>(this.baseUrl , budget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  updateBudget(budget: IBudget): Observable<void> {
    return this.httpClient.put<void>(this.baseUrl + '/' + budget.id , budget , {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  // getBudgetAccounts(): Observable<any> {
  //   return this.httpClient.get(environment.baseUrl + 'Level4/budgetAccounts');
  // }

  // getBudgetReport(body: IBudgetReport): Observable<any> {
  //   return this.httpClient.post(this.baseUrl + '/budgetReport', body)
  // }

  // getBudgetComparisonReport(body: IBudgetComparisonReport): Observable<any> {
  //   return this.httpClient.post(this.baseUrl + '/budgetComparisonReport', body)
  // }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}
