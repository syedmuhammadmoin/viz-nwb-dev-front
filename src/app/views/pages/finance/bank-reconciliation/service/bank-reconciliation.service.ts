import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment} from '../../../../../../environments/environment';
import { IApiResponse} from '../../../../shared/IApiResponse';
import { IPayment} from '../../payment/model/IPayment';
import { IBankStatement} from "../../bank-statement/model/IBankStatement";

@Injectable({
  providedIn: 'root'
})
  
export class BankReconciliationService {

  bankStatementList = new BehaviorSubject<IBankStatement[]>(null);
  paymentList = new BehaviorSubject<IPayment[]>(null);

  baseUrl = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }


  getBankStatement(id: number){
    return this.httpClient.get<IApiResponse<IBankStatement[]>>(`${this.baseUrl}bankStmt/bankstatus/${id}`)
      .subscribe((res) => {
        this.bankStatementList.next(res.result)
      });
  }
  getPaymentStatement(id: number){
    return this.httpClient.get<IApiResponse<IPayment[]>>(`${this.baseUrl}payment/bankstatus/${id}`)
      .subscribe((res) => {
        this.paymentList.next(res.result);
      })
  }

  reconcileStatement(arrayOfReconData: any): Observable<any>{
    return this.httpClient.post(this.baseUrl + 'BankRecon', arrayOfReconData)
  }
}
