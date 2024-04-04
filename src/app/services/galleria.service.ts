import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GALLERIA } from '../common/constant';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class GalleriaService {

    private API_URL = 'gallerias';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    getGallerias(search: any): Observable<any> {
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

    createGalleria(form: any): Observable<any> {
        let formData = new FormData();
        formData.append('image', form.image);
        formData.append('title', form.title.trim());
        formData.append('description', form.description.trim());
        formData.append('status', form.status);
        formData.append('link', form.link.trim());
        const request = {
            function: this.API_URL + '/create',
            method: CONFIG.KEY.METHOD_POST,
            body: formData,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    optionStatus(): any[] {
        return GALLERIA.STATUS;
    }
    
}
