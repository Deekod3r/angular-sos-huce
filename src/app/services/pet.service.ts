import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';
import { PET } from '../common/constant';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Injectable({
    providedIn: 'root'
})
export class PetService {

    private API_URL = 'pets';

    constructor(private commonService: CommonService, private authService: AuthService) { }

    getPets(search: any): Observable<any> {
        const request = {
            function: this.API_URL,
            method: CONFIG.KEY.METHOD_GET,
            options: {
                params: search
            }
        }
        return this.commonService.callAPI(request);
    }

    getPetById(id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/' + id,
            method: CONFIG.KEY.METHOD_GET
        }
        return this.commonService.callAPI(request);
    }

    createPet(body: any): Observable<any> {
        console.log(body);
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

    updatePet(body: any, id: string): Observable<any> {
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

    updateImagePet(body: any, id: string): Observable<any> {
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

    deletePet(id: string): Observable<any> {
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

    getStatisticCases(): Observable<any> {
        const request = {
            function: this.API_URL + '/statistic-cases',
            method: CONFIG.KEY.METHOD_GET
        }
        return this.commonService.callAPI(request);
    }

    filterBreed(event: AutoCompleteCompleteEvent): any[] {
        let filtered: any[] = [];
        let query = event.query.trim();
        for (let i = 0; i < (PET.BREED as any[]).length; i++) {
            let breed = (PET.BREED as any[])[i];
            if (breed && breed.label && breed.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(breed);
            }
        }
        return filtered;
    }

    filterColor(event: AutoCompleteCompleteEvent): any[] {
        let filtered: any[] = [];
        let query = event.query.trim();
        for (let i = 0; i < (PET.COLOR as any[]).length; i++) {
            let color = (PET.COLOR as any[])[i];
            if (color && color.label && color.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(color);
            }
        }
        return filtered;
    }
    
    isAvailableForAdopt(status: number): boolean {
        return status === PET.STATUS_KEY.WAITING;
    }

    getStatus(status: number): string | undefined {
        const statusOption = PET.STATUS.find(option => option.value === status);
        return statusOption ? statusOption.label : undefined;
    }

    getGender(gender: number): string | undefined {
        const genderObject = PET.GENDER.find(g => g.value === gender);
        return genderObject?.label;
    }

    getType(type: number): string | undefined {
        const typeObject = PET.TYPE.find(t => t.value === type);
        return typeObject?.label;
    }

    getAge(age: number): string | undefined {
        const ageObject = PET.AGE.find(a => a.value === age);
        return ageObject?.label;
    }

    getVaccine(vaccine: number): string | undefined {
        const vaccineObject = PET.MORE_INFO.find(i => i.value === vaccine);
        return vaccineObject?.label;
    }

    getSeverityStatus(status: number): string {
        switch (status) {
            case 1:
                return 'danger';
            case 2:
                return 'success';
            case 3:
                return 'warning';
            case 4:
                return 'info';
            default:
                return 'info';
        }
    }

    getBadgeSeverity(info: number) {
        switch (info) {
            case 1:
                return 'danger';
            case 2:
                return 'success';
            case 3:
                return 'warning';
            case 4:
                return 'info';
            default:
                return 'info';
        }
    }

    getBadgeValue(info: number) {
        switch (info) {
            case 1:
                return '✗';
            case 2:
                return '✓';
            case 3:
                return '?';
            default:
                return '?';
        }
    }

    optionMoreInfor(): any[] {
        return PET.MORE_INFO;
    }

    optionStatus(): any[] {
        return PET.STATUS;
    }

    optionStatusModify(): any[] {
        return PET.STATUS_MODIFY;
    
    }

    optionGender(): any[] {
        return PET.GENDER;
    }

    optionType(): any[] {
        return PET.TYPE;
    }

    optionAge(): any[] {
        return PET.AGE;
    }

}
