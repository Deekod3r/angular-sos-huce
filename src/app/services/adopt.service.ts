import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CommonService} from './common.service';
import {AuthService} from './auth.service';
import {CONFIG} from '../common/config';
import {ADOPT} from '../common/constant';

@Injectable({
    providedIn: 'root'
})

export class AdoptService {

    private API_URL = 'adopts';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getAdopts(search: any): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                },
                params: search
            }
        }
        return this.commonService.callAPI(request);
    }

    getAdoptById(id: string): Observable<any> {
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

    getAdoptStatistic(search: any): Observable<any> {
        const request = {
            function: this.API_URL + '/statistic',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                },
                params: search
            }
        }
        return this.commonService.callAPI(request);
    }

    getTotalFeeAdopt(search: any): Observable<any> {
        const request = {
            function: this.API_URL + '/total-fee',
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

    getAdoptsNearLog(): Observable<any> {
        const request = {
            function: this.API_URL + '/near-log',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    createAdopt(body: any): Observable<any> {
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

    updateAdopt(form: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: form,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updateStatusAdopt(body: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update-status/' + id,
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

    cancelAdopt(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/cancel/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    deleteAdopt(id: string): Observable<any> {
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

    getStatus(status: number): string | undefined {
        const statusOption = ADOPT.STATUS.find(option => option.value === status);
        return statusOption?.label;
    }

    getSeverityStatus(status: number): any {
        switch (status) {
            case 1:
                return 'primary';
            case 2:
                return 'warning';
            case 3:
                return 'danger';
            case 4:
                return 'info';
            case 5:
                return 'success';
            case 6:
                return 'danger';
            default:
                return 'info';
        }
    }

    isAvailableForCancelByUser(status: number): boolean {
        return status === ADOPT.STATUS_KEY.WAITING;
    }

    optionStatus(): any[] {
        return ADOPT.STATUS;
    }

}
