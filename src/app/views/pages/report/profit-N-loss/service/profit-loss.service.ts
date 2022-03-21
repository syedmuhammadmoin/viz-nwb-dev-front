import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {IProfitLoss} from "../model/IProfitLoss";

@Injectable({
  providedIn: 'root'
})
export class ProfitLossService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  getProfitNLoss(body: IProfitLoss): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'ProfitLoss', body)
  }
}
