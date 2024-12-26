import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CommonService} from './common.service';
import {Observable} from 'rxjs';
import {CONFIG} from '../common/config';
import {DONATION} from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class DonationService {

    private API_URL = 'donates';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getDonations(search: any): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: search
            }
        }
        return this.commonService.callAPI(request);
    }

    getDonation(id: string): Observable<any> {
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

    getTotalDonation(search: any): Observable<any> {
        const request = {
            function: this.API_URL + '/total',
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

    createDonation(body: any): Observable<any> {
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

    updateDonation(body: any, id: string): Observable<any> {
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

    deleteDonation(id: string): Observable<any> {
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

    getType(type: number): string | undefined {
        const typeObject = DONATION.TYPE.find(t => t.value === type);
        return typeObject?.label;
    }

    optionType(): any[] {
        return DONATION.TYPE;
    }

}
