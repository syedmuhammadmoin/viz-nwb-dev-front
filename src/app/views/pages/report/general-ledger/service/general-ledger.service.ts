import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {IGeneralLedger} from '../model/IGeneralLedger';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {

  baseUrl = environment.baseUrl+'generalLedger';
  constructor(private httpClient: HttpClient) {
  }
  getLedger(generalLedger): Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}`, generalLedger, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
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
