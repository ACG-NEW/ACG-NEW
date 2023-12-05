
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
// import { AuthService } from 'src/app/service/authentication/auth.service';
@Injectable()
export class ManageJobAuthGuard implements CanActivate {
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
