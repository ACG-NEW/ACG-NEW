import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../services/token.service'
import { Router, NavigationStart } from '@angular/router';
import { AccessSettings } from '@/utils/access-settings';
import { LoginService } from './login.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap } from 'rxjs/operators';

const USER = 'user';
const ROLES = 'roles';
const DISPLAYNAME = 'displayname';
const USER_ID = 'userid';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public errorMsg!: string;
  user: any;
  helper: any;
  public type: any;
  public id: any;
  pspmenuTmp: boolean = false;
  rconTmp: boolean = false;
  AMTmp: boolean = false;
  UMTmp: boolean = false;
  public navigationURL: string = '';
  sessionUser: any;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public token$: Observable<string | null> = this.tokenSubject.asObservable();
  private userDataSubject = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private loginService: LoginService,
    private location: Location, private _loader: NgxUiLoaderService,
    private tokenService: TokenService, private router: Router, private toastr: ToastrService,) {
    this.helper = new JwtHelperService();
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationStart) {
        this.navigationURL = value.url;
      }
    });
  }
  isLoggedin() {
    this.user = sessionStorage.getItem('user');
    if (this.user) {
      return true;
    } else {
      return false;
    }
  }
  isAppConfig() {
    if (sessionStorage.getItem('app')) {
      return true;
    } else {
      return false;
    }
  }
  getnavigationURL() {
    return this.navigationURL;
  }

  // getUserRoles() {
  //   const roles = sessionStorage.getItem(ROLES);
  //   return roles;
  // }
  signin(username: string, password: string) {
    const credentials = { username: username, password: password };
    return this.http.post(AccessSettings.JAVA_BACKEND_URL + 'signin/', credentials);
  }
  getUserData() {
    return this.userDataSubject.asObservable();
  }
  login(token: string) {

    console.log(token);
    this.tokenService.saveToken(token);
    window.sessionStorage.removeItem(USER);
    window.sessionStorage.setItem(USER, this.helper.decodeToken(token).sub);
    window.sessionStorage.setItem(ROLES, this.helper.decodeToken(token).roles);
    window.sessionStorage.setItem(DISPLAYNAME, this.helper.decodeToken(token).displayname);
    window.sessionStorage.setItem(USER_ID, this.helper.decodeToken(token).userid);
    // sessionStorage.setItem('user', this.helper.decodeToken(token).preferred_username);
    // this.sessionUser = this.helper.decodeToken(token).preferred_username;
    // try {
    //   this.loginService.getUserDetails().subscribe((res: any) => {
    //     if (res.validUser != undefined && res.validateUser != "") {
    //       try {
    //         if (res.validUser === 'N') {
    //           this._loader.stop();
    //           this.toastr.error('Are you a iRec user? Please Contact System Administrator', "Error");
    //           return;
    //         }
    //         else {
    //           this.loginService.loadUser().subscribe((res: any) => {

    //             if (res.error === "") {
    //               // alert('no data found');
    //               this.toastr.error('Are you a iRec user? Please Contact System Administrator', "Error");
    //               this._loader.stop();
    //               return;
    //             }
    //             if (res.error != "" && res.error != undefined) {
    //               this._loader.stop();
    //               const errorString = res.error;
    //               const regex = /no data found/gi;
    //               const match = regex.exec(errorString);
    //               const errorMessage = match ? match[0] : "Unknown error";
    //               this.toastr.error('Are you a iRec user? Please Contact System Administrator', "Error")
    //               return;
    //             }
    //             else {
    //               this.router.navigate(['dashboard']);
    //               this._loader.stop();
    //               sessionStorage.setItem('pspList', JSON.stringify(res.pspList));
    //               sessionStorage.setItem('menudata', JSON.stringify(res.urlDto.URLS));
    //               this.userDataSubject.next(JSON.stringify(res.urlDto.URLS));
    //               sessionStorage.setItem('userId', res.userId);
    //               if (res.urlDto.URLS.AM) {
    //                 this.AMTmp = true;
    //                 sessionStorage.setItem('app', 'applciationCondig');
    //               }
    //               if (res.urlDto.URLS.PSP) {
    //                 this.pspmenuTmp = true
    //                 sessionStorage.setItem('psp', 'pspConfig');
    //               }
    //               if (res.urlDto.URLS.RECON) {
    //                 this.rconTmp = true
    //                 sessionStorage.setItem('recon', 'reconConfig');
    //               }
    //               if (res.urlDto.URLS.UM) {
    //                 this.UMTmp = true;
    //                 sessionStorage.setItem('UM', 'userManagement');
    //               }
    //             }
    //           });
    //         }
    //       }
    //       catch (ex) {
    //         this.toastr.error(ex, "Exception")
    //         this._loader.stop();
    //         return;
    //       }
    //     }
    //     else {
    //       this.toastr.error('Are you a iRec user? Please Contact System Administrator', "Error");
    //       this._loader.stop();
    //       return;
    //     }
    //   });
    // }
    // catch (ex) {
    //   this.toastr.error(ex, "Exception")
    //   this._loader.stop();
    //   return;
    // }

  }

  async logout() {
    try {
      // Clear user-related data in your application
      this.user = null;
      // localStorage.removeItem('token');
      sessionStorage.clear();
      sessionStorage.removeItem('TOKEN_KEY');
      // this.msService.logout();
      // this.msService.instance.clearCache();
      // Use MSAL to sign the user out by revoking tokens

      this.router.navigateByUrl('');

      // if (localStorage.getItem('refreshed') === null) {
      //   // localStorage['refreshed'] = true;
      //   window.location.reload();
      // } else {
      //   localStorage.removeItem('refreshed');
      // }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }


}
