import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { AuthService } from './auth.service';
import { CONFIG } from '../common/config';
import { NEWS } from '../common/constant';

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private API_URL = 'news';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    getNews(search: any): Observable<any> {
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
    
    getNewsCategories(): Observable<any> {
        const request = {
            function: this.API_URL + '/categories',
            method: CONFIG.KEY.METHOD_GET
        }
        return this.commonService.callAPI(request);
    }

    getNewsCategoryById(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/categories/' + id,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    getNewsById(id: string): Observable<any> {
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

    createNewsCategory(body: any): Observable<any> {
        const request = {
            function: this.API_URL + '/categories/create',
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

    updateNewsCategory(body: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/categories/update/' + id,
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

    deleteNewsCategory(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/categories/delete/' + id,
            method: CONFIG.KEY.METHOD_DELETE,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }


    createNews(body: any): Observable<any> {
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

    updateNews(body: any, id: string): Observable<any> {
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

    updateImageNews(body: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update-image/' + id,
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

    deleteNews(id: string): Observable<any> {
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

    getNewsByCategory(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/category/' + id,
            method: CONFIG.KEY.METHOD_GET
        }
        return this.commonService.callAPI(request);
    }

    getStatus(status: boolean): string | undefined {
        return NEWS.STATUS.find(item => item.value === status)?.label;
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
        return NEWS.STATUS;
    }


}
