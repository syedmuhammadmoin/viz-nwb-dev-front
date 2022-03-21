import {HttpClient} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {ITrialBalance} from "../model/ITrialBalance";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TrialBalanceService {
  constructor(
    private httpClient: HttpClient
  ) {
  }

  getTrialBalance(body: ITrialBalance): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'TrialBalance', body)
  }
}
