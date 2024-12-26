import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CommonService} from './common.service';
import {Observable} from 'rxjs';
import {CONFIG} from '../common/config';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    private API_URL = 'files';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    upload(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/upload',
            method: CONFIG.KEY.METHOD_POST,
            body: body,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    delete(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/delete/' + id,
            method: CONFIG.KEY.METHOD_DELETE,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

}
