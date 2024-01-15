import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor() { }

  getPets(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            id: 1,
            name: 'Bobby',
            age: 2,
            gender: 'Male',
            type: 'Dog',
            breed: 'Labrador',
            vaccination: 'Yes',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 2,
            name: 'Molly',
            age: 1,
            gender: 'Male',
            type: 'Dog',
            breed: 'Beagle',
            vaccination: 'Yes',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 3,
            name: 'Charlie',
            age: 3,
            gender: 'Male',
            type: 'Dog',
            breed: 'Pug',
            vaccination: 'No',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 4,
            name: 'Buddy',
            age: 4,
            gender: 'Female',
            type: 'Dog',
            breed: 'Poodle',
            vaccination: 'Yes',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 5,
            name: 'Oscar',
            age: 2,
            gender: 'Female',
            type: 'Dog',
            breed: 'Bulldog',
            vaccination: 'No',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 6,
            name: 'Milo',
            age: 1,
            gender: 'Female',
            type: 'Dog',
            breed: 'Labrador',
            vaccination: 'Yes',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 7,
            name: 'Archie',
            age: 3,
            gender: 'Female',
            type: 'Dog',
            breed: 'Beagle',
            vaccination: 'No',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          },
          {
            id: 8,
            name: 'Teddy',
            age: 4,
            gender: 'Female',
            type: 'Dog',
            breed: 'Pug',
            vaccination: 'Yes',
            image: 'https://www.hanoipetadoption.com/admin/user-content/Animal/4541b656-c131-4f08-b1b9-7cf22f92ac54.jpeg'
          }
        ]);
      }, 1000);
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
      }, 1000);
    });
  }
  
}
