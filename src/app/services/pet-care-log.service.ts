import {Injectable} from '@angular/core';
import {CommonService} from './common.service';
import {Observable} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {CONFIG} from '../common/config';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PetCareLogService {

    private API_URL = 'pet-care-logs';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getLogs(search: any): Observable<any> {
        let params = new HttpParams();
        for (const key in search) {
            if (search.hasOwnProperty(key)) {
                params = params.set(key, search[key] != null ? search[key].toString() : '');
            }
        }
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: params,
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getLogById(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    createLog(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
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

    updateLog(body: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: body,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    deleteLog(id: string): Observable<any> {
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
