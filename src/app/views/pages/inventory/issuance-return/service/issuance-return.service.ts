import { Injectable, Injector }  from '@angular/core';
import { IIssuanceReturn } from "../model/IIssuanceReturn";
import { Observable }  from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class IssuanceReturnService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'issuanceReturn'

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

     uploadFile(id: number , file: File ): Observable<any> {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
     }

     updateIssuanceReturn(IssuanceReturnModel: IIssuanceReturn): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${IssuanceReturnModel.id}`,IssuanceReturnModel)
     }

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.issuanceReturnDate?.dateFrom, 'MM/d/y') , params?.filterModel?.employeeName)});
     }

     getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + "issuanceReturn?startDate=" + startDate + '&endDate=' + endDate);
    }
}




    
   








