import {Injectable, Injector} from '@angular/core';
import {IBankStatement} from '../model/IBankStatement';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class BankStatementService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'bankStmt';

  constructor(private httpClient: HttpClient, injector: Injector) { super(injector)
  }

  getBankStatements(): Observable<IPaginationResponse<IBankStatement[]>> {
    return this.httpClient.get<IPaginationResponse<IBankStatement[]>>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  getBankStatement(id: number): Observable<IApiResponse<IBankStatement>> {
    return this.httpClient.get<IApiResponse<IBankStatement>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
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
    return this.httpClient.request('post', `${this.baseUrl}`, options)
      .pipe(catchError(this.handleError));
  }

  updateBankStatement(project: IBankStatement): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${project.id}`, project, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankAccountName?.filter )});
  }

  // for error handling.....
  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}


