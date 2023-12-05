
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@services/auth.service';
@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private router: Router, private _authService: AuthService) {}
  canActivate() {
    if (this._authService.isLoggedin()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
