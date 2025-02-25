import {HttpClient} from '@angular/common/http';
import {IReport} from '../model/IReport';
import {BehaviorSubject, Observable} from 'rxjs';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {IFixedAssetReport} from '../model/IFixedAssetReport';
import {AppConst} from '../../../../shared/AppConst';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetReportService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  fixedAssetPrintData = new BehaviorSubject<any>([]);
  currentFixedAssetPrintData = this.fixedAssetPrintData.asObservable();

  fixedAssetMonthlyPrintData = new BehaviorSubject<any>([]);
  currentFixedAssetMonthlyPrintData = this.fixedAssetMonthlyPrintData.asObservable();

  baseUrl = AppConst.remoteServiceBaseUrl + 'FixedAsset';

  getFixedAssetReport(reportModel: IReport): Observable<IApiResponse<IFixedAssetReport[]>> {
    return this.httpClient.post<IApiResponse<IFixedAssetReport[]>>(this.baseUrl + '/report', reportModel)
  }

  getFixedAssetMonthlyReport(reportModel: IReport): Observable<IApiResponse<IFixedAssetReport[]>> {
    return this.httpClient.post<IApiResponse<IFixedAssetReport[]>>(this.baseUrl + '/MonthlyReport', reportModel)
  }

  setFixedAssetDataForPrintComponent(data) {
    this.fixedAssetPrintData.next(data);
  }

  setFixedAssetMonthlyDataForPrintComponent(data) {
    this.fixedAssetMonthlyPrintData.next(data);
  }

}
