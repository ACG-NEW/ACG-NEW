
import { Injectable } from '@angular/core';

const TOKEN_KEY = '';

@Injectable()
export class TokenService {
  constructor() { }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    // //console.log(token);
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem('TOKEN_KEY', token);
  }

  public getToken() {
    //console.log(TOKEN_KEY);
    return sessionStorage.getItem(TOKEN_KEY);
  }
}
