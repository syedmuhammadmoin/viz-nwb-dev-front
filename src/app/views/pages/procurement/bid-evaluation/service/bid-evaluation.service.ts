import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable} from "rxjs";
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IBidEvaluation } from '../model/IBidEvaluation';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';

@Injectable({
  providedIn: 'root'
})
export class BidEvaluationService extends AppServiceBase {

  baseUrl = AppConst.remoteServiceBaseUrl + 'bidEvaluation';

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getBidEvaluations(): Observable<IPaginationResponse<IBidEvaluation[]>> {
    return this.httpClient.get<IPaginationResponse<IBidEvaluation[]>>(this.baseUrl);
  }

  getBidEvaluationById(id: number): Observable<IApiResponse<IBidEvaluation>> {
    return this.httpClient.get<IApiResponse<IBidEvaluation>>(this.baseUrl + '/' + id);
  }

  createBidEvaluation(bidEvaluationModel: IBidEvaluation): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, bidEvaluationModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBidEvaluation(bidEvaluationModel: IBidEvaluation): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + '/' + bidEvaluationModel.id ,  bidEvaluationModel)
  }

  getRecords(params: any): Observable<any> {             
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.bidEvaluationDate?.dateFrom, 'MM/d/y'))});
  }
}




