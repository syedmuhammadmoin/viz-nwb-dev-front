import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IStatus } from "../model/IStatus";

@Injectable({
  providedIn: 'root'
})
  
export class StatusService {

  constructor( private httpClient: HttpClient) { }

getStatuses(params): Observable<any> {
  let httpParams = new HttpParams();

  httpParams = httpParams.append('PageStart', params?.startRow);
  httpParams = httpParams.append('PageEnd', params?.endRow);
  
    return this.httpClient.get(environment.baseUrl + 'status' , { params: httpParams} );
}

getStatusesDropdown(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'status/dropdown');
}

createStatus(body: IStatus): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'status', body);
}

updateStatus(body: IStatus): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'status/' + body.id, body);
}

getStatus(id: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'status/' + id);
}
}
