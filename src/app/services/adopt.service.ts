import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { CONFIG } from '../common/config';
import { adoptStatus, adoptStatusKey } from '../common/constant';

@Injectable({
  providedIn: 'root'
})

export class AdoptService {

    private API_URL = 'adopts';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    getAdopts(): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request).pipe(
            map((response: any) => {
                return response;
            })
        );
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
      return this.commonService.callAPI(request).pipe(
          map((response: any) => {
              return response;
          })
      );
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
        return this.commonService.callAPI(request).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    createAdopt(form: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create',
            method: 'POST',
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

    cancelAdopt(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/cancel/' + id,
            method: 'PUT',
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

    getSeverityStatus(status: number): string | undefined {
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
}