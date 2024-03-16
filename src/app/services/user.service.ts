import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CONFIG } from '../common/config';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private API_URL = 'users';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    register(form: FormGroup): Observable<any> {

        const { phoneNumber, password, name, email } = form.value;

        const request = {
            function: this.API_URL + '/register',
            method: CONFIG.KEY.METHOD_POST,
            body: {
                phoneNumber: phoneNumber.trim(),
                password: password,
                name: name.trim(),
                email: email.trim()
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
                    account: account.trim()
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
                    email: email.trim()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    verifyRegister(id: string, code: string): Observable<any> {
        const request = {
            function: this.API_URL + '/verify-register/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    code: code.trim()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    verifyForgotPassword(id: string, code: string): Observable<boolean> {
        const request = {
            function: this.API_URL + '/verify-forgot-password/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: {
                    code: code.trim()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    resetPassword(id: string, code: string, email: string, password: string): Observable<boolean> {
        const request = {
            function: this.API_URL + '/reset-password',
            method: CONFIG.KEY.METHOD_PUT,
            body: {
                id: id,
                code: code.trim(),
                email: email.trim(),
                newPassword: password
            }
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
                },
                params: {
                    role: this.authService.getRole()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getUsers(search: any): Observable<any> {
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

    verifyUpdateEmail(id: string, code: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update/verify-email/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                },
                params: {
                    code: code.trim()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

}
