import { Injectable, Injector }  from '@angular/core';
import { IGRN } from "../model/IGRN";
import { Observable }  from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class GrnService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'Grn'

    constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
  
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

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.grnDate?.dateFrom, 'MM/d/y'))});
     }
}




    
   






