import { Injectable } from '@angular/core';
import { IDispatchNote } from "../model/IDispatchNote";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWorkflow } from '../../../purchase/vendorBill/model/IWorkflow';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
  providedIn: 'root'
})

export class DispatchNoteService {

    constructor( private httpClient: HttpClient ) { }
  
    getAllDispatchNotes(): Observable<any> {
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'gdn')
    }
  
    getDispatchNoteMasterById(id: number): Observable<any> {
      return this.httpClient.get(AppConst.remoteServiceBaseUrl + 'gdn/' + id)
    }

    createDispatchNote(dispatchNoteModel: IDispatchNote): Observable<any> {
      return this.httpClient.post<IDispatchNote>(AppConst.remoteServiceBaseUrl + 'gdn', dispatchNoteModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
    }
  
    workflow(workflow: IWorkflow): Observable<any> {
      return this.httpClient.post(AppConst.remoteServiceBaseUrl + 'gdn' + '/workflow', workflow);
    }

    updateGDN(gdnModel: IDispatchNote): Observable<any> {
      return this.httpClient.put(AppConst.remoteServiceBaseUrl + `gdn/${gdnModel.id}`,gdnModel)
    }
}




    
   








