import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'users/';

  constructor(private commonService: CommonService) { }

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
