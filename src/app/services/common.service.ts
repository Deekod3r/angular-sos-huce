import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EncryptionService } from './encryption.service';
import { CONFIG } from '../common/config';
import { RequestHttp } from '../models/request-http.model';


@Injectable({
    providedIn: 'root'
})
export class CommonService {

    private API_URL = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    callAPI(request: RequestHttp): any {
        let url = `${this.API_URL}/${request.function}`;
        if (request.method) {
            if (request.method == CONFIG.KEY.METHOD_POST) {
                return this.http.post<any>(url, request.body, request.options);
            } else if (request.method == CONFIG.KEY.METHOD_PUT) {
                return this.http.put<any>(url, request.body, request.options);
            } else if (request.method == CONFIG.KEY.METHOD_DELETE) {
                return this.http.delete<any>(url, request.body);
            } else {
                return this.http.get<any>(url, request.options);
            }
        } else {
            throw new Error('Method is not specified in the request.');
        }
    }

}
