import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdoptService {

    private API_URL = 'adopts';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    createAdopt(form: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
            method: 'POST',
            body: form,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }
}