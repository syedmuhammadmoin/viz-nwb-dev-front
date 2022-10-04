import { Injectable, Injector } from '@angular/core';
import { IDebitNote } from '../model/IDebitNote';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWorkflow } from '../../vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
    providedIn: 'root'
})

export class DebitNoteService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'DebitNote';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getDebitNotes(): Observable<IPaginationResponse<IDebitNote[]>> {
        return this.httpClient.get<IPaginationResponse<IDebitNote[]>>(this.baseUrl)
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

    uploadFile(id: number , file: File ): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
    }

    createDebitNote(debitNote: IDebitNote): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, debitNote, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }
}



