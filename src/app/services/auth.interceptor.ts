import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpResponse, HttpErrorResponse, HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh = false;
  constructor(private _loader: NgxUiLoaderService,
    private router: Router, private toastr: ToastrService,
    private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const idToken = sessionStorage.getItem("TOKEN_KEY");
    if (idToken != null) {
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${idToken}`
        }
      });
    }
    return next.handle(authReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
          if (error.status === 412) {
            this.toastr.error(error.error.message, error.error.status);
            this._loader.stop();
          } else
            if (error.status === 401) {
              this.toastr.error(error.error.message, error.status.toString());
              this._loader.stop();
              // return new Observable<HttpEvent<any>>((observer) => {
              //   this.authService.refreshToken().subscribe(
              //     (newToken: string | null) => {
              //       if (newToken !== null) {
              //         const updatedReq = authReq.clone({
              //           setHeaders: {
              //             Authorization: `Bearer ${newToken}`
              //           }
              //         });
              //         this._loader.stop();
              //         next.handle(updatedReq).subscribe(
              //           (event) => observer.next(event),
              //           (error) => observer.error(error),
              //           () => observer.complete()
              //         );
              //       } else {
              //         this._loader.stop();
              //         this.toastr.error("Unable to refresh token.", "Error");
              //         observer.error('Unable to refresh token.');
              //       }
              //     }
              //   );
              // });
              // }
            }
            else if (error.status === 403) {
              // console.log(error);
              this.toastr.error(error.error.message, error.status.toString());
              this._loader.stop();
            }
            else if (error.status === 400) {
              this.toastr.error('Bad Request', error.status.toString());
              this._loader.stop();
            }
            else if (error.status === 404) {
              this.toastr.error('Not Found', error.status.toString());
              this._loader.stop();
            }
            else if (error.status === 405) {
              this.toastr.error('Method Not Allowed', error.status.toString());
              this._loader.stop();
            }
            else if (error.status === 500) {
              this.toastr.error(' Internal Server Error', error.status.toString());
              this._loader.stop();
            }
            else if (error.status === 502) {
              this.toastr.warning('Please contact administrator, stating error code' + error.status, error.status.toString());
              this._loader.stop();
            }
            else {
              this.toastr.error(error.error.message, 'Error');
              this._loader.stop();
            }
        }
        return throwError(() => error)
      }));
  }

}

