import { Injectable } from '@angular/core';
import { IOrganization } from '../model/IOrganization';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { AppConst } from 'src/app/views/shared/AppConst';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Organization';
    
  constructor(private httpClient: HttpClient) { }

  getOrganizations(): Observable<IPaginationResponse<IOrganization[]>> {
    return this.httpClient.get<IPaginationResponse<IOrganization[]>>(this.baseUrl)
  }

  getOrganizationsDropdown(): Observable<IApiResponse<IOrganization[]>> {
    return this.httpClient.get<IApiResponse<IOrganization[]>>(this.baseUrl + '/dropdown')
  }
    
  getOrganization(id: number): Observable<IApiResponse<IOrganization>> {
    return this.httpClient.get<IApiResponse<IOrganization>>(`${this.baseUrl}/${id}`)
  }

  addOrganization(organization: IOrganization): Observable<IOrganization>{
    return this.httpClient.post<IOrganization>(`${this.baseUrl}`, organization, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    })
  }
    
  updateOrganization(organization: IOrganization): Observable<void> {
      return this.httpClient.put<void>(`${this.baseUrl}/${organization.id}`, organization, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
  }
}

