import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { EncryptionService } from './encryption.service';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private encryptionService: EncryptionService, private commonService: CommonService) { }

  login(form: FormData): Observable<any> {
    const request = {
      function: 'login',
      method: CONFIG.KEY.METHOD_POST,
      body: form
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        localStorage.setItem(CONFIG.KEY.IS_LOGGED_IN, this.encryptionService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE));
        localStorage.setItem(CONFIG.KEY.TOKEN, this.encryptionService.encrypt(JSON.stringify(response.data)));
        this.updateLastActiveTime();
        return response;
      })
    );
  }

  getProfile(): any {
    return JSON.parse(this.encryptionService.decrypt(localStorage.getItem(CONFIG.KEY.TOKEN)) || '{}')
  }

  getRole(): any {
    if (this.getInfoUser()) {
      return this.getInfoUser().role;
    }
    return null;
  }

  getInfoUser(): any {
    let profile = this.getProfile();
    if (JSON.stringify(profile) != '{}') {
      return profile.user;
    }
    return null;
  }

  getToken(): string {
    let profile = this.getProfile();
    if (JSON.stringify(profile) != '{}') {
      return profile.token;
    }
    return '';
  }

  getRefreshToken(): string {
    let profile = this.getProfile();
    if (JSON.stringify(profile) != '{}') {
      return profile.refreshToken;
    }
    return '';
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(CONFIG.KEY.IS_LOGGED_IN) === this.encryptionService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE);
  }

  updateLastActiveTime() {
    localStorage.setItem(CONFIG.KEY.LAST_ACTIVE_TIME, Date.now().toString());
  }

  logout(): void {
    localStorage.clear();
    const request = {
      function: 'logout',
      method: CONFIG.KEY.METHOD_GET,
      options: {
        headers: {
          'Authorization': 'Bearer ' + this.getToken()
        }
      }
    }
    this.commonService.callAPI(request);
  }

}

