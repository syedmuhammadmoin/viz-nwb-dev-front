import { Injectable }                                 from '@angular/core';
import { IDispatchNote }                                       from "../model/IDispatchNote";
import { Observable, throwError }                     from 'rxjs';
import { catchError }                                 from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class DispatchNoteService {

    constructor( private httpClient: HttpClient ) { }
  
    getAllDispatchNotes(): Observable<any> {
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'gdn')
      .pipe(catchError(this.handleError));
    }
  
    getDispatchNoteMasterById(id: number): Observable<any> {
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'gdn/' + id)
      .pipe(catchError(this.handleError));
    }
  
    // getDispatchNoteDetailById(id: number): Observable<any> {
    //   return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'gdn/d/' + id)
    //   .pipe(catchError(this.handleError));
    // }

    createDispatchNote(dispatchNoteModel: IDispatchNote): Observable<any> {
      return this.httpClient.post<IDispatchNote>(AppConst.remoteServiceBaseUrl + 'gdn', dispatchNoteModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(catchError(this.handleError))
    }
  
    workflow(workflow: IWorkflow): Observable<any> {
      return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'gdn' + '/workflow', workflow);
    }

    updateGDN(gdnModel: IDispatchNote): Observable<any> {
      return this.httpClient.put(AppConst.remoteServiceBaseUrl + `gdn/${gdnModel.id}`,gdnModel)
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




    
   








