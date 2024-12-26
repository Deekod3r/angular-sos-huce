import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PetService} from 'src/app/services/pet.service';

@Component({
    selector: 'app-info-pet',
    templateUrl: './info-pet.component.html',
    styleUrls: ['./info-pet.component.css']
})
export class InfoPetComponent implements OnInit, OnDestroy {

    @Input() visibleNote: boolean = false;
    @Input() pet: any;

    constructor(public petService: PetService) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

}
