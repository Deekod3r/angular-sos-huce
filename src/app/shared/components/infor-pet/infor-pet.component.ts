import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pet.service';

@Component({
    selector: 'app-infor-pet',
    templateUrl: './infor-pet.component.html',
    styleUrls: ['./infor-pet.component.css']
})
export class InforPetComponent implements OnInit, OnDestroy {

    @Input() visibleNote: boolean = false;
    @Input() pet: any;

    constructor(public petService: PetService) { }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

}
