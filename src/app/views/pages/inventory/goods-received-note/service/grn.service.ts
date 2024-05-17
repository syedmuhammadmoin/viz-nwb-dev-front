import { Injectable, Injector }  from '@angular/core';
import { IGRN } from "../model/IGRN";
import { Observable }  from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class GrnService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'Grn'

    constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
  
    getGRNs(): Observable<IPaginationResponse<IGRN[]>> {
      return this.httpClient.get<IPaginationResponse<IGRN[]>>(this.baseUrl)
    }
  
    getGRNById(id: number): Observable<any> {
      return this.httpClient.get(this.baseUrl + '/' + id)
    }

    createGRN(grnModel: IGRN): Observable<any> {
      return this.httpClient.post<IGRN>(this.baseUrl, grnModel, {
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

     updateGRN(grnModel: IGRN): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${grnModel.id}`,grnModel)
     }

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.grnDate?.dateFrom, 'MM/d/y'))});
     }

     getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + "Grn?startDate=" + startDate + '&endDate=' + endDate);
    }
}




    
   






