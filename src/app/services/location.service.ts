import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';

@Injectable({
    providedIn: 'root'
})

export class LocationService {

    private API_URL = 'location';

    constructor(private commonService: CommonService) { }

    getProvinces(): Observable<any> {
        const request = {
            function: this.API_URL + '/provinces',
            method: CONFIG.KEY.METHOD_GET
        }
        return this.commonService.callAPI(request);
    }

    getDistricts(provinceId: string): Observable<any> {
        const request = {
            function: this.API_URL + '/districts',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    provinceId: provinceId
                }

            }
        }
        return this.commonService.callAPI(request);
    }

    getWards(districtId: string): Observable<any> {
        const request = {
            function: this.API_URL + '/wards',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    districtId: districtId
                }
            }
        }
        return this.commonService.callAPI(request);
    }

}
