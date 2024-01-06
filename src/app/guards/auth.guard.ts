import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';
import { CONFIG } from '../common/config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private encryptService: EncryptionService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isLoggedIn = localStorage.getItem(CONFIG.KEY.IS_LOGGED_IN) == this.encryptService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE);

    if (isLoggedIn && state.url.startsWith('/auth')) {
      return this.router.parseUrl('/home');
    }

    if (!isLoggedIn && !state.url.startsWith('/auth')) {
      return this.router.parseUrl('/home');
    }

    return true;
    
  }
  
}
