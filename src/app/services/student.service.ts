import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_URL = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  public register(form: FormGroup): Observable<any> {
    const { studentCode, password, faculty, name, email } = form.value;

    const requestBody = {
      studentCode: studentCode,
      password: password,
      faculty: faculty.id,
      name: name,
      email: email
    };

    return this.http.post<any>(`${this.API_URL}/register`, requestBody)
      .pipe(
        map(response => {
          if (response.error) {
            throw new Error(response.error);
          }
          return response.data.id;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

}
