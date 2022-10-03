import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {

  balanceSheetPrintData = new BehaviorSubject<any>([]);
  currentBalanceSheetPrintData = this.balanceSheetPrintData.asObservable();
 
  constructor(private httpClient: HttpClient) { }

  setBalanceSheetDataForPrintComponent(data: any[]) {
    this.balanceSheetPrintData.next(data);
  }

  getBalanceSheetReport(body: any): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'BalanceSheet', body);
  }
}


