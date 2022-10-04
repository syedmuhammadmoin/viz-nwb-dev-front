import { ILocation } from '../model/ILocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';
import { AppConst } from 'src/app/views/shared/AppConst';


@Injectable({
    providedIn: 'root',
  })
export class LocationService {

    baseUrl = AppConst.remoteServiceBaseUrl + 'Location';
    
    constructor(private httpClient: HttpClient) { }

    getLocations(): Observable<IPaginationResponse<ILocation[]>> {
        return this.httpClient.get<IPaginationResponse<ILocation[]>>(this.baseUrl)
    }

    getLocationsDropdown(): Observable<IApiResponse<ILocation[]>> {
        return this.httpClient.get<IApiResponse<ILocation[]>>(this.baseUrl + '/dropdown')
    }

    getLocation(id: number): Observable<IApiResponse<ILocation>> {
        return this.httpClient.get<IApiResponse<ILocation>>(`${this.baseUrl}/${id}`)
    }

    addLocation(location: ILocation): Observable<ILocation>{
        return this.httpClient.post<ILocation>(`${this.baseUrl}`, location, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }

    updateLocation(location: ILocation): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${location.id}`, location, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
    }
}
