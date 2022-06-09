import { Injectable, Injector } from '@angular/core';
import { IDebitNote } from '../model/IDebitNote';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
    providedIn: 'root'
})

export class DebitNoteService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'DebitNote';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getDebitNotes(params: any): Observable<IPaginationResponse<IDebitNote[]>> {
        let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
        return this.httpClient.get<IPaginationResponse<IDebitNote[]>>(this.baseUrl, { params: httpParams})
    }

    getDebitNoteById(id: number): Observable<IApiResponse<IDebitNote>> {
        return this.httpClient.get<IApiResponse<IDebitNote>>(`${this.baseUrl}/${id}`)
    }


    updateDebitNote(debitNoteModel: IDebitNote): Observable<any> {
        return this.httpClient.put(this.baseUrl + `/${debitNoteModel.id}`, debitNoteModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl,{ params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.noteDate?.dateFrom, 'MM/d/y'))})
    }

    createDebitNote(debitNote: IDebitNote): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, debitNote, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }
}



