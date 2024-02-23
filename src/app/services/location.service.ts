import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class LocationService {

    private API_URL = 'location';

    constructor(private commonService: CommonService) { }

    getPronvinces(): Observable<any> {
        const request = {
            function: this.API_URL + '/provinces',
            method: 'GET'
        }
        return this.commonService.callAPI(request);
    }

    getDistricts(provinceId: string): Observable<any> {
        const request = {
            function: this.API_URL + '/districts',
            method: 'GET',
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
            method: 'GET',
            options: {
                params: {
                    districtId: districtId
                }
            }
        }
        return this.commonService.callAPI(request);
    }

}