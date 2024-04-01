import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';
import { petConfig } from '../common/constant';
import { upcaseAllFirstLetters, upcaseFirstLetter } from '../shared/utils/string.util';
import { convertDateFormat } from '../shared/utils/data.util';
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

    createPet(form: any): Observable<any> {
        const formData = new FormData();
        formData.append('age', form.petAge);
        formData.append('breed', upcaseFirstLetter((form.petBreed.label ? form.petBreed.label : form.petBreed).trim()));
        formData.append('color', upcaseFirstLetter((form.petColor.label ? form.petColor.label : form.petColor).trim()));
        formData.append('description', form.petDescription.trim());
        formData.append('note', form.petNote ? form.petNote.trim() : form.petNote);
        formData.append('diet', form.petDiet ? form.petDiet : petConfig.moreInforKey.undefined);
        formData.append('friendlyToCats', form.petFriendlyToCats ? form.petFriendlyToCats : petConfig.moreInforKey.undefined);
        formData.append('friendlyToDogs', form.petFriendlyToDogs ? form.petFriendlyToDogs : petConfig.moreInforKey.undefined);
        formData.append('friendlyToHuman', form.petFriendlyToHuman ? form.petFriendlyToHuman : petConfig.moreInforKey.undefined);
        formData.append('gender', form.petGender);
        formData.append('image', form.petImage);
        formData.append('name', upcaseAllFirstLetters(form.petName.trim()));
        formData.append('rabies', form.petRabies ? form.petRabies : petConfig.moreInforKey.undefined);
        formData.append('status', form.petStatus);
        formData.append('sterilization', form.petSterilization ? form.petSterilization : petConfig.moreInforKey.undefined);
        formData.append('toilet', form.petToilet ? form.petToilet : petConfig.moreInforKey.undefined);
        formData.append('type', form.petType);
        formData.append('vaccine', form.petVaccine ? form.petVaccine : petConfig.moreInforKey.undefined);
        formData.append('weight', form.petWeight);
        formData.append('intakeDate', convertDateFormat(form.intakeDate));
        const request = {
            function: this.API_URL + '/create',
            method: CONFIG.KEY.METHOD_POST,
            body: formData,
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken(),
                    'Content-Type': 'application/json'
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updatePet(form: any, id: string): Observable<any> {
        const request = {
            function: this.API_URL + '/update/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: {
                id: form.petId,
                age: form.petAge,
                breed: upcaseFirstLetter((form.petBreed.label ? form.petBreed.label : form.petBreed).trim()),
                color: upcaseFirstLetter((form.petColor.label ? form.petColor.label : form.petColor).trim()),
                description: form.petDescription.trim(),
                note: form.petNote ? form.petNote.trim() : form.petNote,
                diet: form.petDiet ? form.petDiet : petConfig.moreInforKey.undefined,
                friendlyToCats: form.petFriendlyToCats ? form.petFriendlyToCats : petConfig.moreInforKey.undefined,
                friendlyToDogs: form.petFriendlyToDogs ? form.petFriendlyToDogs : petConfig.moreInforKey.undefined,
                friendlyToHuman: form.petFriendlyToHuman ? form.petFriendlyToHuman : petConfig.moreInforKey.undefined,
                gender: form.petGender,
                name: upcaseAllFirstLetters(form.petName.trim()),
                rabies: form.petRabies ? form.petRabies : petConfig.moreInforKey.undefined,
                status: form.petStatus,
                sterilization: form.petSterilization ? form.petSterilization : petConfig.moreInforKey.undefined,
                toilet: form.petToilet ? form.petToilet : petConfig.moreInforKey.undefined,
                type: form.petType,
                vaccine: form.petVaccine ? form.petVaccine : petConfig.moreInforKey.undefined,
                weight: form.petWeight,
                intakeDate: convertDateFormat(form.intakeDate)
            },
            options: {
                headers: {
                    'Authorization': 'Bearer ' + this.authService.getToken()
                }
            }
        }
        return this.commonService.callAPI(request);
    }

    updatePetImage(file: any, id: string): Observable<any> {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('image', file);
        const request = {
            function: this.API_URL + '/update-image/' + id,
            method: CONFIG.KEY.METHOD_PUT,
            body: formData,
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
        for (let i = 0; i < (petConfig.breed as any[]).length; i++) {
            let breed = (petConfig.breed as any[])[i];
            if (breed && breed.label && breed.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(breed);
            }
        }
        return filtered;
    }

    filterColor(event: AutoCompleteCompleteEvent): any[] {
        let filtered: any[] = [];
        let query = event.query.trim();

        for (let i = 0; i < (petConfig.color as any[]).length; i++) {
            let color = (petConfig.color as any[])[i];
            if (color && color.label && color.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(color);
            }
        }
        return filtered;
    }
    
    isAvailableForAdopt(status: number): boolean {
        return status === petConfig.statusKey.waiting;
    }

    getStatus(status: number): string | undefined {
        const statusOption = petConfig.status.find(option => option.value === status);
        return statusOption ? statusOption.label : undefined;
    }

    getGender(gender: number): string | undefined {
        const genderObject = petConfig.gender.find(g => g.value === gender);
        return genderObject?.label;
    }

    getType(type: number): string | undefined {
        const typeObject = petConfig.type.find(t => t.value === type);
        return typeObject?.label;
    }

    getAge(age: number): string | undefined {
        const ageObject = petConfig.age.find(a => a.value === age);
        return ageObject?.label;
    }

    getVaccine(vaccine: number): string | undefined {
        const vaccineObject = petConfig.moreInfor.find(i => i.value === vaccine);
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
        return petConfig.moreInfor;
    }

    optionStatus(): any[] {
        return petConfig.status;
    }

    optionGender(): any[] {
        return petConfig.gender;
    }

    optionType(): any[] {
        return petConfig.type;
    }

    optionAge(): any[] {
        return petConfig.age;
    }

}
