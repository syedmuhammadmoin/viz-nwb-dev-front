import { Injectable } from '@angular/core';
import { ICreditNote } from '../model/ICreditNote';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class CreditNoteService {

    baseUrl = environment.baseUrl + 'CreditNote';

    constructor(private httpClient: HttpClient) { }

    getCreditNotes(): Observable<IPaginationResponse<ICreditNote[]>> {
      return this.httpClient.get<IPaginationResponse<ICreditNote[]>>(this.baseUrl)
        .pipe(catchError(this.handleError));
    }
  
    getCreditNoteById(id: number): Observable<IApiResponse<ICreditNote>> {
      return this.httpClient.get<IApiResponse<ICreditNote>>(`${this.baseUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }
    
    createCreditNote(creditNote: ICreditNote): Observable<IApiResponse<ICreditNote>> {
        return this.httpClient.post<IApiResponse<ICreditNote>>(this.baseUrl, creditNote, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateCreditNote(creditNoteModel: ICreditNote): Observable<IApiResponse<ICreditNote>> {
        return this.httpClient.put<IApiResponse<ICreditNote>>(this.baseUrl + `/${creditNoteModel.id}`, creditNoteModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
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
  
  
  
  

