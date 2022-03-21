import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getBalanceSheetReport(body: any): Observable<any> {
    const url = environment.baseUrl + 'BalanceSheet'
    return this.httpClient.post(url, body);
  }

}


