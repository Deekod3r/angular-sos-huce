import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private API_URL = 'pets/';

  constructor(private commonService: CommonService) { }

  getPets(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            id: 1,
            code: 'PET-0001',
            name: 'Bobby',
            age: 2,
            gender: 'Male',
            type: 'Cat',
            breed: 'Labrador',
            vaccination: 'Yes',
            weight: 10,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 1
          },
          {
            id: 2,
            code: 'PET-0002',
            name: 'Molly',
            age: 1,
            gender: 'Male',
            type: 'Dog',
            breed: 'Beagle',
            vaccination: 'Yes',
            weight: 1.5,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 2
          },
          {
            id: 3,
            code: 'PET-0003',
            name: 'Charlie',
            age: 3,
            gender: 'Male',
            type: 'Cat',
            breed: 'Pug',
            vaccination: 'No',
            weight: 0.8,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 0
          },
          {
            id: 4,
            code: 'PET-0004',
            name: 'Buddy',
            age: 4,
            gender: 'Female',
            type: 'Cat',
            breed: 'Poodle',
            vaccination: 'Yes',
            weight: 2.0,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 1
          },
          {
            id: 5,
            code: 'PET-0005',
            name: 'Oscar',
            age: 2,
            gender: 'Female',
            type: 'Dog',
            breed: 'Bulldog',
            vaccination: 'No',
            weight: 1.2,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 0
          },
          {
            id: 6,
            code: 'PET-0006',
            name: 'Milo',
            age: 1,
            gender: 'Female',
            type: 'Cat',
            breed: 'Labrador',
            vaccination: 'Yes',
            weight: 1.1,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 3
          },
          {
            id: 7,
            code: 'PET-0007',
            name: 'Archie',
            age: 3,
            gender: 'Female',
            type: 'Dog',
            breed: 'Beagle',
            vaccination: 'No',
            weight: 0.9,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 3
          },
          {
            id: 8,
            code: 'PET-0008',
            name: 'Teddy',
            age: 4,
            gender: 'Female',
            type: 'Dog',
            breed: 'Pug',
            vaccination: 'Yes',
            weight: 3.0,
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg',
            status: 0
          }
        ]);
      });
    });
  }

  getStatisticCases(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(
          {
            sumCase: 2500,
            adopted: 1500,
            ready: 500,
            notReady: 200
          }
        );
      });
    });
  }
  

}
