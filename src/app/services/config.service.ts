import {Injectable} from '@angular/core';
import {CommonService} from './common.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {CONFIG} from '../common/config';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    socials = new BehaviorSubject<any>(null);
    contacts = new BehaviorSubject<any>(null);
    introductions = new BehaviorSubject<any>(null);
    adoptProcess = new BehaviorSubject<any>(null);
    adoptConditions = new BehaviorSubject<any>(null);
    donates = new BehaviorSubject<any>(null);
    volunteerIntroduction = new BehaviorSubject<any>(null);
    volunteerConditions = new BehaviorSubject<any>(null);
    private API_URL = 'configs';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getConfigs(key = ''): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    key: key.trim()
                },
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updateConfig(id: number, data: any): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: Object.assign({id: id}, data),
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }


}
