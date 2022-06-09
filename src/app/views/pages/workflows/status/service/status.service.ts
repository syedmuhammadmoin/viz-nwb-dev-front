import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AppServiceBase } from "src/app/views/shared/app-service-base";
import { environment } from "src/environments/environment";
import { IStatus } from "../model/IStatus";

@Injectable({
  providedIn: 'root'
})
  
export class StatusService extends AppServiceBase {

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

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

getRecords(params: any): Observable<any> {
  return this.httpClient.get(environment.baseUrl + 'status', { params: this.getfilterParams(null , null, params?.filterModel?.status?.filter)});
}
}
