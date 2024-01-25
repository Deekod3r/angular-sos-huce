import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CommonService } from './common.service';
import { CONFIG } from '../common/config';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { petStatus, petGender, petType, petAge, petMoreInfor, moreInfor } from '../common/constant';
import { upcaseAllFirstLetters, upcaseFirstLetter } from '../shared/utils/string.util';

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
    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }


  createPet(form: any): Observable<any> {
    const formData = new FormData();
    formData.append('age', form.petAge);
    formData.append('breed', upcaseFirstLetter((form.petBreed.label ? form.petBreed.label : form.petBreed).trim()));
    formData.append('color', upcaseFirstLetter((form.petColor.label ? form.petColor.label : form.petColor).trim()));
    formData.append('description', form.petDescription ? form.petDescription.trim() : null);
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
    formData.append('type', form.petType != null ? form.petType : moreInfor.undefined);
    formData.append('vaccin', form.petVaccin != null ? form.petVaccin : moreInfor.undefined);
    formData.append('weight', form.petWeight);
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
    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getStatisticCases(): Observable<any> {
    const request = {
      function: this.API_URL + '/statistic-cases',
      method: CONFIG.KEY.METHOD_GET
    }
    return this.commonService.callAPI(request).pipe(
      map((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
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

  getVaccin(vaccin: number): string | undefined {
    const vaccinObject = petMoreInfor.find(i => i.value === vaccin);
    return vaccinObject?.label;
  }

  getSeverityStatus(status: number): string {
    switch (status) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'primary';
      default:
        return 'primary';
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
