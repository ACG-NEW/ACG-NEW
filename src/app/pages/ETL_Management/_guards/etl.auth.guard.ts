
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@services/auth.service';

// import { AuthService } from 'src/app/service/authentication/auth.service';
@Injectable()
export class ETLAuthGuard implements CanActivate {
  constructor(private router: Router,
    private _authService: AuthService) { }

  canActivate() {
    if (this._authService.isLoggedin()) {
      // this._authService.getUserRoles();
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
