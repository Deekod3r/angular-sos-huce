import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encryption.service';
import { CONFIG } from '../common/config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }

  public login(form: FormGroup): Observable<boolean> {
    const { studentCode, password } = form.value;

    const requestBody = {
      studentCode: studentCode,
      password: password
    };

    return this.http.post<any>(`${this.API_URL}/login`, requestBody)
      .pipe(
        map(response => {
          if (response.error) {
            throw new Error(response.error);
          }
          localStorage.setItem(CONFIG.KEY.IS_LOGGED_IN, this.encryptionService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE))
          localStorage.setItem(CONFIG.KEY.TOKEN, this.encryptionService.encrypt(JSON.stringify(response.data)))
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return throwError(() => error);
        })
      );
  }

  public verify(id: string, code: string): Observable<any> {

    return this.http.get<any>(`${this.API_URL}/verify/` + id + `?code=` + code)
      .pipe(
        map(response => {
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

  public logout(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

}

