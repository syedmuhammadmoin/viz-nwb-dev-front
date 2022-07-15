import { Injectable, Injector }  from '@angular/core';
import { IIssuanceReturn } from "../model/IIssuanceReturn";
import { Observable }  from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class IssuanceReturnService extends AppServiceBase {

  baseUrl = environment.baseUrl + 'issaunceReturn'

    constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
  
    getIssuanceReturns(): Observable<IPaginationResponse<IIssuanceReturn[]>> {
      return this.httpClient.get<IPaginationResponse<IIssuanceReturn[]>>(this.baseUrl)
    }
  
    getIssuanceReturnById(id: number): Observable<any> {
      return this.httpClient.get(this.baseUrl + '/' + id)
    }

    createIssuanceReturn(IssuanceReturnModel: IIssuanceReturn): Observable<any> {
      return this.httpClient.post<IIssuanceReturn>(this.baseUrl, IssuanceReturnModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
     workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
     }

     updateIssuanceReturn(IssuanceReturnModel: IIssuanceReturn): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${IssuanceReturnModel.id}`,IssuanceReturnModel)
     }

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.issuanceReturnDate?.dateFrom, 'MM/d/y'))});
     }
}




    
   








