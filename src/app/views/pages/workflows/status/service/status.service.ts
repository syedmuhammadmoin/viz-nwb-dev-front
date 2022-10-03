import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { AppServiceBase } from "src/app/views/shared/app-service-base";
import { AppConst } from "src/app/views/shared/AppConst";
import { IStatus } from "../model/IStatus";

@Injectable({
  providedIn: 'root'
})
  
export class StatusService extends AppServiceBase {

  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

getStatuses(): Observable<any> {
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'status');
}

getStatusesDropdown(): Observable<any> {
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'status/dropdown');
}

createStatus(body: IStatus): Observable<any> {
    return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'status', body);
}

updateStatus(body: IStatus): Observable<any> {
    return this.httpClient.put(AppConst.remoteServiceBaseUrl + 'status/' + body.id, body);
}

getStatus(id: any): Observable<any> {
    return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'status/' + id);
}

getRecords(params: any): Observable<any> {
  let httpParams = new HttpParams();

  httpParams = httpParams.append('PageStart', params?.startRow);
  httpParams = httpParams.append('PageEnd', params?.endRow);
  httpParams = httpParams.append('Name', (params?.filterModel?.status?.filter || ''));
  return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'status', { params: httpParams});
}
}
