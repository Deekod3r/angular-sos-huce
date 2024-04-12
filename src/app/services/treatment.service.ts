import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { CONFIG } from '../common/config';
import { TREATMENT } from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class TreatmentService {

    private API_URL = 'treatments';

    constructor(private commonService: CommonService, private authService: AuthService) { }
    
    getTreatments(search: any): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: search,
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getTreatment(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getTotalTreatmentCost(search: any): Observable<any> {
        const request = {
            function: this.API_URL + '/total-cost',
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

    createTreatment(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
            method: CONFIG.KEY.METHOD_POST,
            body: body,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updateTreatment(id: string, body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: body,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    deleteTreatment(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/delete/' + id,
            method: CONFIG.KEY.METHOD_DELETE,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getStatusBadge(status: boolean): string | undefined {
        switch (status) {
            case false:
                return 'danger';
            case true:
                return 'success';
            default:
                return 'success';
        }
    }

    getStatus(status: boolean): string | undefined {
        return TREATMENT.STATUS.find(item => item.value === status)?.label;
    }

    optionStatus(): any[] {
        return TREATMENT.STATUS;
    }

    getType(type: number): string | undefined {
        return TREATMENT.TYPE.find(item => item.value === type)?.label;
    }

    optionType(): any[] {
        return TREATMENT.TYPE;
    }

}
