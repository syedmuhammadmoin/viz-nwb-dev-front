import { Injectable, Injector }  from '@angular/core';
import { IGoodsReturnNote } from "../model/IGoodsReturnNote";
import { Observable }  from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';


@Injectable({
  providedIn: 'root'
})

export class GoodsReturnNoteService  extends AppServiceBase {

  baseUrl = environment.baseUrl + 'GoodsReturnNote'

    constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
  
    getGoodsReturnNotes(): Observable<IPaginationResponse<IGoodsReturnNote[]>> {
      return this.httpClient.get<IPaginationResponse<IGoodsReturnNote[]>>(this.baseUrl)
    }
  
    getGoodsReturnNoteById(id: number): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'GoodsReturnNote/' + id)
    }

    createGoodsReturnNote(GoodsReturnNoteModel: IGoodsReturnNote): Observable<any> {
      return this.httpClient.post<IGoodsReturnNote>(environment.baseUrl + 'GoodsReturnNote', GoodsReturnNoteModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
     workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'GoodsReturnNote' + '/workflow', workflow);
     }

     uploadFile(id: number , file: File ): Observable<any> {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
     }

     updateGoodsReturnNote(GoodsReturnNoteModel: IGoodsReturnNote): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `GoodsReturnNote/${GoodsReturnNoteModel.id}`,GoodsReturnNoteModel)
     }

     getRecords(params: any): Observable<any> {
      return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.returnDate?.dateFrom, 'MM/d/y'))});
     }
}




    
   








