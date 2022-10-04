import { HttpClient} from "@angular/common/http";
import { Injectable} from "@angular/core";
import { BehaviorSubject, Observable} from "rxjs";
import { AppConst } from "src/app/views/shared/AppConst";
import { IProfitLoss} from "../model/IProfitLoss";

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {

  profitNLossPrintData = new BehaviorSubject<any>([]);
  currentProfitNLossPrintData = this.profitNLossPrintData.asObservable();
 
  constructor(private httpClient: HttpClient) { }

  setProfitNLossDataForPrintComponent(data: any[]) {
    this.profitNLossPrintData.next(data);
  }
  
  getProfitNLoss(body: IProfitLoss): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'pnl', body)
  }
}
