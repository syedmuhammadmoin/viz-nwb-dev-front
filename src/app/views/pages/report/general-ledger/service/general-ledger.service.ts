import { Injectable } from '@angular/core';
import { environment} from '../../../../../../environments/environment';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeneralLedgerService {

  baseUrl = environment.baseUrl + 'generalLedger';

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
}
