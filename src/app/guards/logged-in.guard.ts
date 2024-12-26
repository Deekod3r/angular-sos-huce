import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {CONFIG} from '../common/config';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated()) {
            const role = this.authService.getRole();
            if (CONFIG.ROLE.ROOT.includes(role)) {
                this.router.navigateByUrl('/admin/trang-chu').then(() => {
                });
                return false;
            }
            this.router.navigateByUrl('').then(() => {
            });
            return false;
        }
        return true;
    }

}
