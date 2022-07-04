import { Injectable, Injector }  from '@angular/core';
import { Observable }  from 'rxjs';
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IStock } from '../model/IStock';

@Injectable({
  providedIn: 'root'
})

export class StockService extends AppServiceBase {
  
    baseUrl = environment.baseUrl + 'stock'
  
      constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
    
      getStock(): Observable<IPaginationResponse<IStock[]>> {
        return this.httpClient.get<IPaginationResponse<IStock[]>>(this.baseUrl)
      }
    
      // getGRNById(id: number): Observable<any> {
      //   return this.httpClient.get(environment.baseUrl + 'Grn/' + id)
      // }
  
      // createGRN(grnModel: IGRN): Observable<any> {
      //   return this.httpClient.post<IGRN>(environment.baseUrl + 'Grn', grnModel, {
      //     headers: new HttpHeaders({
      //       'Content-Type': 'application/json'
      //     })
      //   })
      // }
  
      //  updateGRN(grnModel: IGRN): Observable<any> {
      //     return this.httpClient.put(environment.baseUrl + `Grn/${grnModel.id}`,grnModel)
      //  }
  
       getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.grnDate?.dateFrom, 'MM/d/y'))});
       }
  }
  
  
  
  
      
     
  
  
  
  
  
  
  





    
   








