import { Injectable, Injector } from '@angular/core';
import { ICreditNote } from '../model/ICreditNote';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base'

@Injectable({
  providedIn: 'root'
})

export class CreditNoteService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'CreditNote';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getCreditNotes(): Observable<IPaginationResponse<ICreditNote[]>> {
      return this.httpClient.get<IPaginationResponse<ICreditNote[]>>(this.baseUrl)
    }
  
    getCreditNoteById(id: number): Observable<IApiResponse<ICreditNote>> {
      return this.httpClient.get<IApiResponse<ICreditNote>>(`${this.baseUrl}/${id}`)
    }
    
    createCreditNote(creditNote: ICreditNote): Observable<IApiResponse<ICreditNote>> {
        return this.httpClient.post<IApiResponse<ICreditNote>>(this.baseUrl, creditNote, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateCreditNote(creditNoteModel: ICreditNote): Observable<IApiResponse<ICreditNote>> {
        return this.httpClient.put<IApiResponse<ICreditNote>>(this.baseUrl + `/${creditNoteModel.id}`, creditNoteModel)
    }

    uploadFile(id: number , file: File ): Observable<any> {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
  }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.noteDate?.dateFrom, 'MM/d/y'))});
    }
  }
  
  
  
  

