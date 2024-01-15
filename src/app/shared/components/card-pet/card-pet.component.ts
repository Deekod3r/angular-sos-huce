import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-pet',
  templateUrl: './card-pet.component.html',
  styleUrls: ['./card-pet.component.css']
})
export class CardPetComponent {

  @Input() pet: any;

}
