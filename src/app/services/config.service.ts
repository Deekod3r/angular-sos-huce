import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';
import { systemConfig } from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private API_URL = 'configs';
    
    socials: any;
    contacts: any;
    introductions: any;
    adoptProcess: any;
    adoptConditions: any;
    donates: any;

    constructor(private commonService: CommonService, private authService: AuthService) { }

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
