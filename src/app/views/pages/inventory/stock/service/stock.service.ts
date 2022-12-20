import { Injectable, Injector }  from '@angular/core';
import { Observable }  from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { IStock } from '../model/IStock';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class StockService extends AppServiceBase {
  
    baseUrl = AppConst.remoteServiceBaseUrl + 'stock'
  
      constructor( private httpClient: HttpClient, injector: Injector ) { super(injector) }
    
      getStock(): Observable<IPaginationResponse<IStock[]>> {
        return this.httpClient.get<IPaginationResponse<IStock[]>>(this.baseUrl)
      }

      //get stock by item and warehouse Id
      getStockByIds(model: any): Observable<any> {
        return this.httpClient.post<any>(this.baseUrl, model, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      });
      }
    
      // getGRNById(id: number): Observable<any> {
      //   return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'Grn/' + id)
      // }
  
      // createGRN(grnModel: IGRN): Observable<any> {
      //   return this.httpClient.post<IGRN>(AppConst.remoteServiceBaseUrl + 'Grn', grnModel, {
      //     headers: new HttpHeaders({
      //       'Content-Type': 'application/json'
      //     })
      //   })
      // }
  
      //  updateGRN(grnModel: IGRN): Observable<any> {
      //     return this.httpClient.put(AppConst.remoteServiceBaseUrl + `Grn/${grnModel.id}`,grnModel)
      //  }
  
       getRecords(params: any): Observable<any> {
        return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params, this.dateHelperService.transformDate(params?.filterModel?.grnDate?.dateFrom, 'MM/d/y') , params?.filterModel?.itemName?.filter )});
       }
  }
  
  
  
  
      
     
  
  
  
  
  
  
  





    
   








