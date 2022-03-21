import { Injectable }                                 from '@angular/core';
import { IGRN }                                       from "../model/IGRN";
import { Observable, throwError }                     from 'rxjs';
import { catchError }                                 from 'rxjs/operators';
import { environment }                                from "../../../../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';


@Injectable({
  providedIn: 'root'
})

export class GrnService {

    constructor( private httpClient: HttpClient ) { }
  
    getAllGRNs(): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'Grn')
      .pipe(catchError(this.handleError));
    }
  
    getGRNMasterById(id: number): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'Grn/' + id)
      .pipe(catchError(this.handleError));
    }

    createGRN(grnModel: IGRN): Observable<any> {
      return this.httpClient.post<IGRN>(environment.baseUrl + 'Grn', grnModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(catchError(this.handleError))
    }
  
     workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'Grn' + '/workflow', workflow);
     }

     updateGRN(grnModel: IGRN): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `Grn/${grnModel.id}`,grnModel)
     }
  
    // getGRNDetailById(id: number): Observable<any> {
    //   return this.httpClient.get(environment.baseUrl + 'Grn/d/' + id)
    //   .pipe(catchError(this.handleError));
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




    
   






