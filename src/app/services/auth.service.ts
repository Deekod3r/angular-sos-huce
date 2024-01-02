import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  public login(form: FormGroup): Observable<boolean> {
    const { studentCode, password } = form.value;

    const requestBody = {
      studentCode: studentCode,
      password: password
    };

    return this.http.post<any>(`${this.API_URL}/login`, requestBody)
      .pipe(
        map(response => {
          console.log(response)
          if (response.error) {
            throw new Error(response.error);
          }
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('studentInfo', JSON.stringify(response.data))
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return throwError(() => error);
        })
      );
  }

  public logout(): void {
    localStorage.clear();
  }

}

