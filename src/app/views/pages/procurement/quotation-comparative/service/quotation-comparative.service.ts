import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IAwardVendor, IQuotationComparative } from '../model/IQuotationComparative';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';


@Injectable({
  providedIn: 'root'
})

export class QuotationComparativeService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'QuotationComparative';

    constructor(private httpClient: HttpClient, injector: Injector) { super(injector) }

    getQuotationComparativeById(id: number): Observable<IApiResponse<any>> {
      return this.httpClient.get<IApiResponse<any>>(`${this.baseUrl}/${id}`)
    }

    createQuotationComparative(quotComparative: IQuotationComparative): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, quotComparative, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    updateQuotationComparative(quotComparativeModel: IQuotationComparative): Observable<any> {
        return this.httpClient.put<any>(this.baseUrl + `/${quotComparativeModel.id}`, quotComparativeModel)
    }

    awardVendor(model: IAwardVendor): Observable<any> {
      return this.httpClient.put<any>(this.baseUrl + '/AwardedVendor', model)
    }

    getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.quotComparativeDate?.dateFrom, 'MM/d/y'))});
    }
}
