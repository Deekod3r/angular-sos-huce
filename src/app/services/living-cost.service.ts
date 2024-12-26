import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CONFIG} from '../common/config';
import {AuthService} from './auth.service';
import {CommonService} from './common.service';
import {LIVING_COST} from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class LivingCostService {

    private API_URL = 'living-costs';

    constructor(private commonService: CommonService, private authService: AuthService) {
    }

    getLivingCosts(search: any): Observable<any> {
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

    getLivingCost(id: string): Observable<any> {
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

    getTotalLivingCost(search: any): Observable<any> {
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

    createLivingCost(body: any): Observable<any> {
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

    updateLivingCost(body: any, id: string): Observable<any> {
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

    deleteLivingCost(id: string): Observable<any> {
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

    getStatus(status: boolean): string | undefined {
        return LIVING_COST.STATUS.find(item => item.value === status)?.label;
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

    optionStatus(): any[] {
        return LIVING_COST.STATUS;
    }

    optionCategory(): any[] {
        return LIVING_COST.CATEGORY;
    }

    getCategory(category: number): string | undefined {
        return LIVING_COST.CATEGORY.find(item => item.value === category)?.label;
    }

}
