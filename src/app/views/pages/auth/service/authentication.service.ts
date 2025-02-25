import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { AppConst } from "src/app/views/shared/AppConst";
import { APP_ROUTES, AUTH } from "src/app/views/shared/AppRoutes";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(
        private httpClient: HttpClient
    ) {}
    
    signIn(email: string, password: string): Observable<any> {
        return this.httpClient.post(AppConst.remoteServiceBaseUrl + '/' + APP_ROUTES.AUTH + '/' + AUTH.LOGIN, {email, password});
    }

    signOut(): Observable<boolean> {
        const signOutObservable = new Observable((observer: Observer<boolean>) => {
            try {
                localStorage.clear();
                console.log('localStorage.clear() called')
                observer.next(true);
                console.log('observer.next(true) called')
            } catch (err) {
                observer.error(err)
                console.log('observer.error(err)',err)
            }
        });
        return signOutObservable
    }
}