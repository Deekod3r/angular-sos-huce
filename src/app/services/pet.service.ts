import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';
import { HttpParams } from '@angular/common/http';
import { petStatus, petGender, petType, petAge, petMoreInfor, moreInfor, petStatusKey } from '../common/constant';
import { upcaseAllFirstLetters, upcaseFirstLetter } from '../shared/utils/string.util';
import { convertDateFormat } from '../shared/utils/data.util';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private API_URL = 'pets';

  constructor(private commonService: CommonService, private authService: AuthService) { }

  getPets(search: any): Observable<any> {
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
        params: params
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
    formData.append('diet', form.petDiet != null ? form.petDiet : moreInfor.undefined);
    formData.append('friendlyToCats', form.petFriendlyToCats != null ? form.petFriendlyToCats : moreInfor.undefined);
    formData.append('friendlyToDogs', form.petFriendlyToDogs != null ? form.petFriendlyToDogs : moreInfor.undefined);
    formData.append('friendlyToHuman', form.petFriendlyToHuman != null ? form.petFriendlyToHuman : moreInfor.undefined);
    formData.append('gender', form.petGender);
    formData.append('image', form.petImage);
    formData.append('name', upcaseAllFirstLetters(form.petName.trim()));
    formData.append('rabies', form.petRabies != null ? form.petRabies : moreInfor.undefined);
    formData.append('status', form.petStatus);
    formData.append('sterilization', form.petSterilization != null ? form.petSterilization : moreInfor.undefined);
    formData.append('toilet', form.petToilet != null ? form.petToilet : moreInfor.undefined);
    formData.append('type', form.petType);
    formData.append('vaccine', form.petVaccine != null ? form.petVaccine : moreInfor.undefined);
    formData.append('weight', form.petWeight);
    formData.append('intakeDate', convertDateFormat(form.intakeDate));
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
        diet: form.petDiet != null ? form.petDiet : moreInfor.undefined,
        friendlyToCats: form.petFriendlyToCats != null ? form.petFriendlyToCats : moreInfor.undefined,
        friendlyToDogs: form.petFriendlyToDogs != null ? form.petFriendlyToDogs : moreInfor.undefined,
        friendlyToHuman: form.petFriendlyToHuman != null ? form.petFriendlyToHuman : moreInfor.undefined,
        gender: form.petGender,
        name: upcaseAllFirstLetters(form.petName.trim()),
        rabies: form.petRabies != null ? form.petRabies : moreInfor.undefined,
        status: form.petStatus,
        sterilization: form.petSterilization != null ? form.petSterilization : moreInfor.undefined,
        toilet: form.petToilet != null ? form.petToilet : moreInfor.undefined,
        type: form.petType,
        vaccine: form.petVaccine != null ? form.petVaccine : moreInfor.undefined,
        weight: form.petWeight != null ? form.petWeight : null,
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

  deleteSoftPet(id: string): Observable<any> {
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

  isAvailable(status: number): boolean {
    return status === petStatusKey.waiting;
  }

  getStatus(status: number): string | undefined {
    const statusOption = petStatus.find(option => option.value === status);
    return statusOption ? statusOption.label : undefined;
  }

  getGender(gender: number): string | undefined {
    const genderObject = petGender.find(g => g.value === gender);
    return genderObject?.label;
  }

  getType(type: number): string | undefined {
    const typeObject = petType.find(t => t.value === type);
    return typeObject?.label;
  }

  getAge(age: number): string | undefined {
    const ageObject = petAge.find(a => a.value === age);
    return ageObject?.label;
  }

  getVaccine(vaccine: number): string | undefined {
    const vaccineObject = petMoreInfor.find(i => i.value === vaccine);
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

  getMoreInfor(moreInfor: number): string | undefined {
    const moreInforObject = petMoreInfor.find(i => i.value === moreInfor);
    return moreInforObject?.label;
  }

  getMoreInforValue(moreInfor: string): number | undefined {
    const moreInforObject = petMoreInfor.find(i => i.label === moreInfor);
    return moreInforObject?.value;
  }

  optionMoreInfor(): any[] {
    return petMoreInfor;
  }

  optionStatus(): any[] {
    return petStatus;
  }

  optionGender(): any[] {
    return petGender;
  }

  optionType(): any[] {
    return petType;
  }

  optionAge(): any[] {
    return petAge;
  }
}
