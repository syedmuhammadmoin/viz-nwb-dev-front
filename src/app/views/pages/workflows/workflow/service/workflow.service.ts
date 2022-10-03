import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from 'src/app/views/shared/app-service-base';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IWorkflow } from '../model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
  
export class WorkflowService extends AppServiceBase {

  private baseUrl = AppConst.remoteServiceBaseUrl + 'workflow'
 
  constructor( private httpClient: HttpClient, injector: Injector) { super(injector) }

  getWorkflows(): Observable<any> {
    return this.httpClient.get(this.baseUrl)
  }

  createWorkflow(body: IWorkflow): Observable<any> {
    return this.httpClient.post(this.baseUrl , body)
  }

  updateWorkflow(body: IWorkflow): Observable<any> {
    return this.httpClient.put(this.baseUrl + '/' + body.id, body);
  }

  getWorkflow(id: any): Observable<any> {
    return this.httpClient.get(this.baseUrl + '/' + id);
  }

  getRecords(params: any): Observable<any> {
    return this.httpClient.get(this.baseUrl, { params: this.getfilterParams(params , null)});
  }
}
