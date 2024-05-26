import { Injectable, Injector }  from '@angular/core';
import { IGoodsReturnNote } from "../model/IGoodsReturnNote";
import { Observable }  from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class GoodsReturnNoteService  extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'GoodsReturnNote'

    constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
  
    getGoodsReturnNotes(): Observable<IPaginationResponse<IGoodsReturnNote[]>> {
      return this.httpClient.get<IPaginationResponse<IGoodsReturnNote[]>>(this.baseUrl)
    }
  
    getGoodsReturnNoteById(id: number): Observable<any> {
      return this.httpClient.get(this.baseUrl + '/' + id)
    }

    createGoodsReturnNote(GoodsReturnNoteModel: IGoodsReturnNote): Observable<any> {
      return this.httpClient.post<IGoodsReturnNote>(this.baseUrl, GoodsReturnNoteModel, {
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

     updateGoodsReturnNote(GoodsReturnNoteModel: IGoodsReturnNote): Observable<any> {
        return this.httpClient.put(this.baseUrl + '/' + GoodsReturnNoteModel.id , GoodsReturnNoteModel)
     }

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.returnDate?.dateFrom, 'MM/d/y'))});
     }
     getRecordByYearMonth(startDate: any, endDate: any): Observable<any> {        
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + "GoodsReturnNote?startDate=" + startDate + '&endDate=' + endDate);
    }
}




    
   








