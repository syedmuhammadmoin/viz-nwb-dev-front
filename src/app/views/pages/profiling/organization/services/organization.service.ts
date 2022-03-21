import { Injectable } from '@angular/core';
import { IOrganization } from '../model/IOrganization';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

    baseUrl = environment.baseUrl + 'Organization';
    
  constructor(private httpClient: HttpClient) { }

  getOrganizations(): Observable<IPaginationResponse<IOrganization[]>> {
    return this.httpClient.get<IPaginationResponse<IOrganization[]>>(this.baseUrl)
        .pipe(catchError(this.handleError));
  }

  getOrganizationsDropdown(): Observable<IApiResponse<IOrganization[]>> {
    return this.httpClient.get<IApiResponse<IOrganization[]>>(this.baseUrl + '/dropdown')
        .pipe(catchError(this.handleError));
  }
    
  getOrganization(id: number): Observable<IApiResponse<IOrganization>> {
    return this.httpClient.get<IApiResponse<IOrganization>>(`${this.baseUrl}/${id}`)
        .pipe(catchError(this.handleError));
  }

  addOrganization(organization: IOrganization): Observable<IOrganization>{
    return this.httpClient.post<IOrganization>(`${this.baseUrl}`, organization, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }).pipe(catchError(this.handleError));
  }
    
  updateOrganization(organization: IOrganization): Observable<void> {
      return this.httpClient.put<void>(`${this.baseUrl}/${organization.id}`, organization, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      })
          .pipe(catchError(this.handleError));
  }

  // for error handling.....
  private handleError(errorResponse: HttpErrorResponse) {
      if (errorResponse.error instanceof ErrorEvent) {
          console.error('Client Side Error :', errorResponse.error.message);
      } else {
          console.error('Server Side Error :', errorResponse);
      }
      return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}

