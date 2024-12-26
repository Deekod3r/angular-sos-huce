import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-card-pet',
    templateUrl: './card-pet.component.html',
    styleUrls: ['./card-pet.component.css']
})
export class CardPetComponent {

    @Input() id: any;
    @Input() image: any;
    @Input() name: any;
    @Input() breed: any;
    @Input() age: any;
    @Input() vaccine: any;
    @Input() gender: any;
    @Input() severity: any;
    @Input() status: any;
    @Input() visibleStatus: any;

}
