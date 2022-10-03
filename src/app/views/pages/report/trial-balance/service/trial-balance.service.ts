import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { ITrialBalance} from "../model/ITrialBalance";
import { BehaviorSubject, Observable} from "rxjs";
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class TrialBalanceService {

  trialBalancePrintData = new BehaviorSubject<any>([]);
  currentTrialBalancePrintData = this.trialBalancePrintData.asObservable();
 
  constructor(private httpClient: HttpClient) { }

  setTrialBalanceDataForPrintComponent(data: any[]) {
    this.trialBalancePrintData.next(data);
  }

  getTrialBalance(body: ITrialBalance): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'TrialBalance', body)
  }
}
