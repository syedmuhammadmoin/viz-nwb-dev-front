import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IAsset } from '../model/IAsset';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { IUpdateAsset } from '../model/IUpdateAsset';

@Injectable({
    providedIn: 'root'
})
export class AssetService extends AppServiceBase {

    baseUrl = AppConst.remoteServiceBaseUrl + 'FixedAsset';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getAssets(): Observable<IPaginationResponse<IAsset[]>> {
        return this.httpClient.get<IPaginationResponse<IAsset[]>>(this.baseUrl)
    }

    getAssetById(id: number): Observable<IApiResponse<IAsset>> {
        return this.httpClient.get<IApiResponse<IAsset>>(`${this.baseUrl}/${id}`)
    }


    createAsset(Asset: IAsset): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}`, Asset, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateAsset(Asset: IAsset): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/${Asset.id}`, Asset, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateApprovalAsset(AUpdateAsset: IUpdateAsset): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/Update/${AUpdateAsset.id}`, AUpdateAsset, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }


    getAssetsDropdown(): Observable<IApiResponse<IAsset[]>> {
        return this.httpClient.get<IApiResponse<IAsset[]>>(this.baseUrl + '/dropdown')
    }

    getDepreciationSchedule(id: number): Observable<IApiResponse<IAsset[]>> {
        return this.httpClient.get<IApiResponse<IAsset[]>>(this.baseUrl + '/DepreciationSchedule/' + id)
    }

    getAssetsProductDropdownById(id: number): Observable<IApiResponse<IAsset[]>> {
        return this.httpClient.get<IApiResponse<IAsset[]>>(`${this.baseUrl}/Product/${id}`)
    }

    heldForDisposal(id: number): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/HeldForDisposal`, {id})
    }

    getAssetsDisposalDropdown(): Observable<IApiResponse<IAsset[]>> {
        return this.httpClient.get<IApiResponse<IAsset[]>>(this.baseUrl + '/Disposable/Dropdown')
    }

    workflow(workflow: IWorkflow): Observable<any> {
        return this.httpClient.post(this.baseUrl + '/workflow', workflow);
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, null, params?.filterModel?.bankName?.filter) });
    }
}
