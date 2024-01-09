import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class GeneralLedgerService {

  baseUrl = AppConst.remoteServiceBaseUrl + 'generalLedger';

  ledgerPrintData = new BehaviorSubject<any>([]);
  currentLedgerPrintData = this.ledgerPrintData.asObservable();
 
  constructor(private httpClient: HttpClient) { }

  setLedgerDataForPrintComponent(data: any[]) {
    this.ledgerPrintData.next(data);
  }

  getLedger(generalLedger): Observable<any>{
    return this.httpClient.post<any>(`${this.baseUrl}`, generalLedger, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  getOpeningBalance(id: number): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/Account/${id}/Balance`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
