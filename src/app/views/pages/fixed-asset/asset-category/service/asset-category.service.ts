import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IAssetCategory } from '../model/IAssetCategory';


@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService extends AppServiceBase {

    baseUrl = environment.baseUrl + 'AssetCategory';
    
    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getAssetCategories(): Observable<IPaginationResponse<IAssetCategory[]>> {
        return this.httpClient.get<IPaginationResponse<IAssetCategory[]>>(this.baseUrl)
    }

    getAssetCategoriesDropdown(): Observable<IApiResponse<IAssetCategory[]>> {
        return this.httpClient.get<IApiResponse<IAssetCategory[]>>(this.baseUrl + '/dropdown')
    }

    getAssetCategoryById(id: number): Observable<IApiResponse<IAssetCategory>> {
        return this.httpClient.get<IApiResponse<IAssetCategory>>(`${this.baseUrl}/${id}`)
    }

    createAssetCategory(assetCategory : IAssetCategory): Observable<any>{
        return this.httpClient.post<any>(`${this.baseUrl}`, assetCategory, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateAssetCategory(assetCategory: IAssetCategory): Observable<any> {
        return this.httpClient.put<any>(`${this.baseUrl}/${assetCategory.id}`, assetCategory, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null, params?.filterModel?.bankName?.filter)});
    }
}



