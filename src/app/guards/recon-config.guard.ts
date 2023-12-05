import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReconConfigGuard implements CanActivate {
  constructor(private authService: AuthService) {

  }
  canActivate() {
    return this.getReconconfig();
  }
  getReconconfig() {
    if(sessionStorage.getItem('recon')){
      return true;
    }else{
      return false;
    }
  }

}
