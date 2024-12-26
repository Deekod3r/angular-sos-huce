import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CommonService} from './common.service';
import {Observable} from 'rxjs';
import {CONFIG} from '../common/config';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    private API_URL = 'feedbacks';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getFeedbacks(search: any): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: search,
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    createFeedback(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
            method: CONFIG.KEY.METHOD_POST,
            body: body
        }
        return this.commonService.callAPI(request);
    }

}
