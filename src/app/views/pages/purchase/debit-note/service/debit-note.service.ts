import { Injectable } from '@angular/core';
import { IDebitNote } from '../model/IDebitNote';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../vendorBill/model/IWorkflow';

@Injectable({
    providedIn: 'root'
})

export class DebitNoteService {

    baseUrl = environment.baseUrl + 'DebitNote';

    constructor(private httpClient: HttpClient) { }

    getDebitNotes(): Observable<any> {
        return this.httpClient.get<any[]>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getDebitNoteMaster(id: number): Observable<any> {
        return this.httpClient.get(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    // getDebitNoteDetail(id: number): Observable<any> {
    //     return this.httpClient.get(`${this.baseUrl}/` + 'details/' + `${id}`)
    //         .pipe(catchError(this.handleError));
    // }

    updateDebitNote(debitNoteModel: IDebitNote): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${debitNoteModel.id}`, debitNoteModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    createDebitNote(debitNote: IDebitNote): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, debitNote, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
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



