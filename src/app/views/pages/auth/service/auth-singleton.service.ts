import { Injectable } from "@angular/core";
import { User } from "src/app/core/auth";
import { DecodeTokenService } from "src/app/views/shared/decode-token.service";

@Injectable({
    providedIn: 'root'
})
export class AuthSingletonService {
    constructor(
        private decodeTokenService: DecodeTokenService
    ) { }

    isLoggedIn(): boolean {
        let isExpired = true;
        if (this.decodeTokenService.getToken()) {
            const token = this.decodeTokenService.decode(this.decodeTokenService.getToken())
            isExpired = this.decodeTokenService.isTokenExpired();
        }
        return !isExpired;
    }

    getCurrentUser(): User {
        let user = undefined
        if (this.decodeTokenService.getToken()) {
            user = this.decodeTokenService.setUser(
                this.decodeTokenService.decode(
                    this.decodeTokenService.getToken()
                )
            );
        }
        return user;
    }

    getCurrentUserPermission(): string[] {
        let permission
        try {
            permission = this.getCurrentUser().permissions
        } catch (err) {
            permission = false
        }
        return permission
    }
}