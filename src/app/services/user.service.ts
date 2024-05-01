import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { USER } from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private API_URL = 'users';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    register(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/register',
            method: CONFIG.KEY.METHOD_POST,
            body: body
        }
        return this.commonService.callAPI(request);
    }

    createAdmin(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/create/admin',
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

    updateAdmin(id:string, body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/update/admin' + '/' + id,
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

    updatePasswordAdmin(id: string, body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/update/password/admin' + '/' + id,
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

    checkExist(account: string): Observable<any> {
        const request = {
            function: this.API_URL + '/check-exist',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    account: account
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    forgotPassword(email: string): Observable<boolean> {
        const request = {
            function: this.API_URL + '/forgot-password',
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    email: email
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    verifyRegister(data: any): Observable<any> {
        const request = {
            function: this.API_URL + '/verify-register/' + data.id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    code: data.code
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    verifyForgotPassword(data: any): Observable<any> {
        const request = {
            function: this.API_URL + '/verify-forgot-password/' + data.id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    code: data.code
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    resetPassword(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/reset-password',
            method: CONFIG.KEY.METHOD_PUT,
            body: body
        }
        return this.commonService.callAPI(request);
    }

    getUserById(id: string): Observable<any> {
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

    getUsers(search: any): Observable<any> {
        Object.assign(search, { roleRequest: this.authService.getRole() });
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

    updateUser(id: string, body: any, functionName: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + functionName + '/' + id,
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

    verifyUpdateEmail(data: any): Observable<any> {
        const request = {
            function: this.API_URL + '/update/verify-email/' + data.id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                },
                params: {
                    code: data.code
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getStatus(status: boolean): string | undefined {
        const statusObject = USER.STATUS.find(i => i.value === status);
        return statusObject ? statusObject.label : '';
    }

    isActivated(status: boolean): any {
        if (!status) return 'p-button-danger';
    }
    
    optionStatus(): any {
        return USER.STATUS
    }
}
