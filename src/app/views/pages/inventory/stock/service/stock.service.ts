import { Injectable }                                 from '@angular/core';
import { IStock }                                     from "../model/IStock";
import { Observable, throwError }                     from 'rxjs';
import { catchError }                                 from 'rxjs/operators';
import { environment }                                from "../../../../../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StockService {

    constructor( private httpClient: HttpClient ) { }
  
    getAllStocks(): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'stock')
      .pipe(catchError(this.handleError));
    }
  
    getStockMasterById(id: number): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'stock/' + id)
      .pipe(catchError(this.handleError));
    }
  
    getStockDetailById(id: number): Observable<any> {
      return this.httpClient.get(environment.baseUrl + 'stock/d/' + id)
      .pipe(catchError(this.handleError));
    }

    createStock(stockModel: IStock): Observable<any> {
      return this.httpClient.post<IStock>(environment.baseUrl + 'stock', stockModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }).pipe(catchError(this.handleError))
    }
  

    private handleError(errorResponse: HttpErrorResponse) {
      if (errorResponse.error instanceof ErrorEvent) {
         console.error('Client Side Error :', errorResponse.error.message);
      } else {
         console.error('Server Side Error :', errorResponse);
      }
     return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}




    
   








