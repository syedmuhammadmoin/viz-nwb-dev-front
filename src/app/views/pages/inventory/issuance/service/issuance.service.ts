import { Injectable, Injector } from '@angular/core';
import { IIssuance } from '../model/IIssuance';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})

export class IssuanceService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'issuance';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getIssuances(): Observable<IPaginationResponse<IIssuance[]>> {
        return this.httpClient.get<IPaginationResponse<IIssuance[]>>(this.baseUrl)
    }

    getIssuanceById(id: number): Observable<IApiResponse<IIssuance>> {
        return this.httpClient.get<IApiResponse<IIssuance>>(`${this.baseUrl}/${id}`)
    }

    createIssuance(issuance: IIssuance): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, issuance, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateIssuance(IssuanceModel: IIssuance): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${IssuanceModel.id}`, IssuanceModel)
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    uploadFile(id: number , file: File ): Observable<any> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post<any>(`${this.baseUrl}/DocUpload/${id}`, formData)
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.issuanceDate?.dateFrom, 'MM/d/y'))});
    }
}


