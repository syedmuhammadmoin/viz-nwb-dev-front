import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, Subject, Subscription } from "rxjs";
import { isLoggedOut } from "src/app/core/auth";
import { APP_ROUTES, AUTH } from "src/app/views/shared/AppRoutes";
import { BetweenLocalization } from "src/assets/plugins/formvalidation/src/js/validators/between";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor(
        private httpClient: HttpClient
    ) {}
    
    signIn(email: string, password: string): Observable<any> {
        return this.httpClient.post(environment.baseUrl + '/' + APP_ROUTES.AUTH + '/' + AUTH.LOGIN, {email, password});
    }

    signOut(): Observable<boolean> {
        const signOutObservable = new Observable((observer: Observer<boolean>) => {
            try {
                localStorage.clear();
                observer.next(true);
            } catch (err) {
                observer.error(err)
                console.log(err)
            }
        });
        return signOutObservable
    }
}