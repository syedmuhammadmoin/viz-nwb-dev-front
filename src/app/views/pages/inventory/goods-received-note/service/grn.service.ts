import { Injectable }  from '@angular/core';
import { IGRN } from "../model/IGRN";
import { Observable }  from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';

@Injectable({
  providedIn: 'root'
})

export class GrnService {

  baseUrl = environment.baseUrl + 'Grn'

    constructor( private httpClient: HttpClient ) { }
  
    getGRNs(): Observable<IPaginationResponse<IGRN[]>> {
      return this.httpClient.get<IPaginationResponse<IGRN[]>>(this.baseUrl)
    }
  
    getGRNById(id: number): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'Grn/' + id)
    }

    createGRN(grnModel: IGRN): Observable<any> {
      return this.httpClient.post<IGRN>(environment.baseUrl + 'Grn', grnModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
     workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'Grn' + '/workflow', workflow);
     }

     updateGRN(grnModel: IGRN): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `Grn/${grnModel.id}`,grnModel)
     }
  

    // private handleError(errorResponse: HttpErrorResponse) {
    //   if (errorResponse.error instanceof ErrorEvent) {
    //      console.error('Client Side Error :', errorResponse.error.message);
    //   } else {
    //      console.error('Server Side Error :', errorResponse);
    //   }
    //  return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    // }
}




    
   






