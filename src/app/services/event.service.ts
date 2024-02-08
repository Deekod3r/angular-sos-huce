import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  getEvents(): Observable<any> {
    return new Observable<any>(observer => {
      observer.next([
        {
          id: 1,
          title: 'Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1',
          content: 'Descrição da notícia 1 Descrição da notícia 1 Descrição da notícia 1 Descrição da notícia 1 Descrição da notícia 1 Descrição da notícia 1 Descrição da notícia 1',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 1'
        },
        {
          id: 2,
          title: 'Notícia 2',
          content: 'Descrição da notícia 2',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 2'
        },
        {
          id: 3,
          title: 'Notícia 3Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1',
          content: 'Descrição da notícia 3 Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 3'
        },
        {
          id: 4,
          title: 'Notícia 4',
          content: 'Descrição da notícia 4',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 4'
        },
        {
          id: 5,
          title: 'Notícia 5Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1Notícia 1',
          content: 'Descrição da notícia 5Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1Descrição da notícia 1',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 5'
        },
        {
          id: 6,
          title: 'Notícia 6',
          content: 'Descrição da notícia 6',
          image: 'https://www.hanoipetadoption.com/admin/user-content/News/119adaac-de1f-4e8b-b53f-1bd1057611c2.jpg',
          startDate: '2021-08-01',
          endDate: '2021-09-01',
          location: 'Local 6'
        }
      ]);
    });
  }
  
}
