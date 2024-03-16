import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { CONFIG } from '../common/config';
import { adoptStatus, adoptStatusKey } from '../common/constant';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AdoptService {

    private API_URL = 'adopts';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    getAdopts(search: any): Observable<any> {
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
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                },
                params: params
            }
        }
        return this.commonService.callAPI(request);
    }

    getAdoptsByUser(): Observable<any> {
      const request = {
          function: this.API_URL + '/user' + '/' + this.authService.getInfoUser().id,
          method: CONFIG.KEY.METHOD_GET,
          options: {
              headers: {
                  'Authorization': 'Bearer ' + this.authService.getToken()
              }
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
                },
                params: {
                    role: this.authService.getRole()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    createAdopt(form: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
            method: CONFIG.KEY.METHOD_POST,
            body: {
                petId: form.petAdopt,
                registeredBy: form.registeredBy,
                address: form.address ? form.address.trim() : '',
                wardId: form.ward,
                districtId: form.district,
                provinceId: form.province,
                reason: form.reason ? form.reason.trim() : ''
            },
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
            body: {
                id: form.id,
                address: form.address ? form.address.trim() : '',
                wardId: form.ward,
                districtId: form.district,
                provinceId: form.province,
                reason: form.reason ? form.reason.trim() : '',
                fee: form.fee
            },
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updateStatusAdopt(form: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update-status/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: {
                id: form.id,
                status: form.status,
                message: form.message ? form.message.trim() : form.message
            },
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

    deleteSoftAdopt(id: string): Observable<any> {
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
        const statusOption = adoptStatus.find(option => option.value === status);
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
        return status === adoptStatusKey.waiting;
    }

    optionStatus() {
        return adoptStatus;
    }
}