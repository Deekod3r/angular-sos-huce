import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'users/';

  constructor(private commonService: CommonService, private authService: AuthService) { }

  register(form: FormGroup): Observable<any> {

    const { phoneNumber, password, name, email } = form.value;

    const request = {
      function: this.API_URL + 'register',
      method: CONFIG.KEY.METHOD_POST,
      body: {
        phoneNumber: phoneNumber.trim(),
        password: password,
        name: name.trim(),
        email: email.trim()
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  checkExist(account: string): Observable<any> {
    const request = {
      function: this.API_URL + 'check-exist',
      method: CONFIG.KEY.METHOD_GET,
      options: {
        params: {
          account: account.trim()
        }
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    const request = {
      function: this.API_URL + 'forgot-password',
      method: CONFIG.KEY.METHOD_GET,
      options: {
        params: {
          email: email.trim()
        }
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verifyRegister(id: string, code: string): Observable<any> {
    const request = {
      function: this.API_URL + 'verify-register/' + id,
      method: CONFIG.KEY.METHOD_GET,
      options: {
        params: {
          code: code.trim()
        }
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  verifyForgotPassword(id: string, code: string): Observable<boolean> {
    const request = {
      function: this.API_URL + 'verify-forgot-password/' + id,
      method: CONFIG.KEY.METHOD_GET,
      options: {
        params: {
          code: code.trim()
        }
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  resetPassword(id: string, code: string, email: string, password: string): Observable<boolean> {
    const request = {
      function: this.API_URL + 'reset-password',
      method: CONFIG.KEY.METHOD_PUT,
      body: {
        id: id,
        code: code.trim(),
        email: email.trim(),
        newPassword: password
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUserById(id: string): Observable<any> {
    const request = {
      function: this.API_URL + id,
      method: CONFIG.KEY.METHOD_GET,
      options: {
        headers: {
          'Authorization': 'Bearer ' + this.authService.getToken()
        },
        params: {
          role: this.authService.getRole()
        }
      }
    }

    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
