import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IJournalEntry } from '../model/IJournalEntry';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';


@Injectable({
  providedIn: 'root'
})

export class JournalEntryService {

  baseUrl = environment.baseUrl + 'journalEntry';

  constructor(private httpClient: HttpClient) { }

  getJournalEntries(): Observable<IPaginationResponse<IJournalEntry[]>> {
    return this.httpClient.get<IPaginationResponse<IJournalEntry[]>>(this.baseUrl)
      .pipe(catchError(this.handleError))
  }

  getJournalEntryById(id: number): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.get<IApiResponse<IJournalEntry>>(this.baseUrl + '/' + id)
      .pipe(catchError(this.handleError));
  }

  addJournalEntry(journalEntry: IJournalEntry): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.post<IApiResponse<IJournalEntry>>(this.baseUrl, journalEntry, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateJournalEntry(JVModel: IJournalEntry): Observable<IApiResponse<IJournalEntry>> {
    return this.httpClient.put<IApiResponse<IJournalEntry>>(this.baseUrl + `/${JVModel.id}`, JVModel, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }).pipe(catchError(this.handleError));
  }


  workflow(workflow: IWorkflow): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/workflow', workflow);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}
