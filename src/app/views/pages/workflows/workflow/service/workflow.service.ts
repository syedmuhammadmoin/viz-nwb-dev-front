import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { environment } from 'src/environments/environment';
import { IWorkflow } from '../model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
  
export class WorkflowService extends AppServiceBase {
 
  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getWorkflows(params: any): Observable<any> {
    let httpParams = new HttpParams();

    httpParams = httpParams.append('PageStart', params?.startRow);
    httpParams = httpParams.append('PageEnd', params?.endRow);
    
    return this.httpClient.get(environment.baseUrl + 'workflow', { params: httpParams})
  }

  createWorkflow(body: IWorkflow): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'workflow', body)
  }

  updateWorkflow(body: IWorkflow): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'workflow/' + body.id, body);
  }

  getWorkflow(id: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'workflow/' + id);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'workflow', { params: this.getfilterParams(params , null)});
  }
}
