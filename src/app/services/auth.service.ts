import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encryption.service';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private encryptionService: EncryptionService, private commonService: CommonService) { }

  login(form: FormData): Observable<boolean> {
    const request = {
      function: 'login',
      method: CONFIG.KEY.METHOD_POST,
      body: form
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        localStorage.setItem(CONFIG.KEY.IS_LOGGED_IN, this.encryptionService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE));
        localStorage.setItem(CONFIG.KEY.TOKEN, this.encryptionService.encrypt(JSON.stringify(response.data)));
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  verify(id: string, code: string): Observable<any> {

    const request = {
      function: 'verify/' + id + '?code=' + code.trim(),
      method: CONFIG.KEY.METHOD_GET
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
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

  getInfoUser():any {
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

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
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

