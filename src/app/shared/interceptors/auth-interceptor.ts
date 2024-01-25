import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const lastActiveTime = localStorage.getItem(CONFIG.KEY.LAST_ACTIVE_TIME);
        if (lastActiveTime && (Date.now() - parseInt(lastActiveTime, 10) > CONFIG.DEFAULT_VALUE.SESSION_TIME_IN_SECONDS * 1000)) {
            alert("Đã hết phiên đăng nhập, vui lòng đăng nhập lại!")
            this.authService.logout();
            this.router.navigateByUrl(CONFIG.KEY.ROOT_PAGE);
        }
        return next.handle(request);
    }
    
}
