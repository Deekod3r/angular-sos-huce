import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Faculty } from '../models/faculty.model';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  private API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  public getAllFaculty(): Observable<Faculty[]> {
    return this.http.get<any>(`${this.API_URL}/faculties`)
      .pipe(
        map(response => {
          if (response.error) {
            throw new Error(response.error);
          }
          return response.data as Faculty[];
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

}
