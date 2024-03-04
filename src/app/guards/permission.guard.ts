import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const expectedRole = route.data['expectedRole'] ? route.data['expectedRole'] : ["GUEST"];
    const role = this.authService.getRole() ? this.authService.getRole() : "GUEST";
    if (!expectedRole.includes(role)) {
      return this.router.navigateByUrl('/dang-nhap');
    }
    return true;

  }

}
