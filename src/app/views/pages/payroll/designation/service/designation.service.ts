import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';

@Injectable({
  providedIn: 'root'
})

export class DesignationService {

  baseUrl = environment.baseUrl + 'designation';

  constructor(private httpClient: HttpClient) { }

  getDesignations(): Observable<IPaginationResponse<[]>> {
    return this.httpClient.get<IPaginationResponse<[]>>(this.baseUrl)
  }

  getDesignationsDropdown(): Observable<IApiResponse<[]>> {
    return this.httpClient.get<IApiResponse<[]>>(this.baseUrl + '/dropdown')
  }  
}


