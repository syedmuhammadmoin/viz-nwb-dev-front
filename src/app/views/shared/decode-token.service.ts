import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode'
import { User } from "../../core/auth";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
  
export class DecodeTokenService {

  //private tokenToReturn: any = {userId: '', email: '', name: '', roles: [], claims: []};
  private tokenToReturn: any = { userId: '', email: '', name: '', roles: [], permissions: [], tokenExpiration: 0 };
  private decodedToken: any
  constructor() { }


  decode(token: string): any {
    try{
      this.decodedToken = jwt_decode(token);
      // console.log('decode', this.decodedToken);
      if (this.decodedToken) {
        this.tokenToReturn.email = this.decodedToken?.Email;
        this.tokenToReturn.tokenExpiration = this.decodedToken?.exp
        this.tokenToReturn.name = this.decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null;
        this.tokenToReturn.permissions = this.decodedToken?.Permission
        //this.tokenToReturn.claims = this.decodedToken?.Claims
        const roles = this.decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
        this.tokenToReturn.roles = roles !== null ? roles.toString().split(',') : [];
        // console.log('roles: ', this.tokenToReturn.roles);
        this.tokenToReturn.userId = this.decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
        // console.log('token', this.tokenToReturn)
        return this.tokenToReturn;
      }
    } catch (e) {
      console.error('token error', e);
    }
  }

  setUser(decodedToken: any) {
    // const model = new User();
    // model.username = decodedToken.email
    // model.email = decodedToken.email;
    // model.roles = decodedToken.roles;
    // model.id = decodedToken.userId;
    // model.fullname = decodedToken.name;
    // return model

    const model = new User();
    model.username = decodedToken.name
    model.email = decodedToken.email;
    model.roles = decodedToken.roles;
    model.id = decodedToken.userId;
    model.fullname = decodedToken.name;
    model.permissions = decodedToken.permissions
    model.tokenExpiry = this.getTokenExpirationDate();
    // console.log(model);
    return model
  }

  private getTokenExpirationDate(token?: string): Date {
    token = token ?? this.getToken()
    const decoded = this.decode(token);

    if (decoded.tokenExpiration === undefined) return null;

    const date = new Date(0);
    // console.log('expiry: ', decoded.tokenExpiration)
    date.setUTCSeconds(decoded.tokenExpiration);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return true;
    return !(date.valueOf() > new Date().valueOf());
  }

  getToken(): any {
    let token = null;
    try {
      token = localStorage.getItem(environment.authTokenKey);
    } catch (err) {
      throw err;
      // return false
    }
    return token;
  }
}
