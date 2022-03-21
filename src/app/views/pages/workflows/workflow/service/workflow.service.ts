import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IWorkflow } from '../model/IWorkflow';

@Injectable({
  providedIn: 'root'
})
  
export class WorkflowService {
 
  constructor( private httpClient: HttpClient) { }

  getWorkflows(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'workflow')
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
}
