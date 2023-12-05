import { Injectable } from '@angular/core';
import { AccessSettings } from '@/utils/access-settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loginClass } from '@modules/login/login.modal';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  login(body: any): Observable<loginClass> {
    // console.log(AccessSettings.JAVA_BACKEND_URL);
    return this.http
      .post<loginClass>(AccessSettings.JAVA_BACKEND_URL + '/signin/', body);
  }

  loadUser() {
    return this.http
      .get(AccessSettings.JAVA_BACKEND_URL + '/loadUser/loadUserInfo');
  }
  getUserDetails() {
    return this.http.get(AccessSettings.JAVA_BACKEND_URL + '/user/validateUser');
  }

  // loadUser(user) {
  //   return this.http
  //     .get(AccessSettings.JAVA_BACKEND_URL + '/loadUser/loadUserInfo/' + user);
  // }
  // getUserDetails(name: string) {
  //   return this.http.get(AccessSettings.JAVA_BACKEND_URL + '/user/validateUser/' + name);
  // }
}
