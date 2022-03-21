import { ILocation } from '../model/ILocation';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IPaginationResponse } from 'src/app/views/shared/IPaginationResponse';


@Injectable({
    providedIn: 'root',
  })
export class LocationService {

    baseUrl = environment.baseUrl + 'Location';
    
    constructor(private httpClient: HttpClient) { }

    getLocations(): Observable<IPaginationResponse<ILocation[]>> {
        return this.httpClient.get<IPaginationResponse<ILocation[]>>(this.baseUrl)
            .pipe(catchError(this.handleError));
    }

    getLocationsDropdown(): Observable<IApiResponse<ILocation[]>> {
        return this.httpClient.get<IApiResponse<ILocation[]>>(this.baseUrl + '/dropdown')
            .pipe(catchError(this.handleError));
    }

    getLocation(id: number): Observable<IApiResponse<ILocation>> {
        return this.httpClient.get<IApiResponse<ILocation>>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    addLocation(location: ILocation): Observable<ILocation>{
        return this.httpClient.post<ILocation>(`${this.baseUrl}`, location, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateLocation(location: ILocation): Observable<void> {
        return this.httpClient.put<void>(`${this.baseUrl}/${location.id}`, location, {
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
