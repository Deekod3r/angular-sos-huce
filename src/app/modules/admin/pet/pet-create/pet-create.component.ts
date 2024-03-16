import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete/autocomplete.interface';
import { Subject, takeUntil } from 'rxjs';
import { petBreed, petColor, petType, petAge, petGender, petMoreInfor, petStatus, CALENDER_CONFIG, MIN_DATE, MAX_DATE } from 'src/app/common/constant';
import { message, title } from 'src/app/common/message';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';


@Component({
    selector: 'app-pet-create',
    templateUrl: './pet-create.component.html',
    providers: [MessageService],
    styleUrls: ['./pet-create.component.css']
})
export class PetCreateComponent implements OnInit {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    types: any[] = [];
    age: any[] = [];
    gender: any[] = [];
    status: any[] = [];
    moreInfor: any[] = [];
    filteredBreeds: any[] = [];
    filteredColors: any[] = [];

    calendar_cf: any;
    min_date: any;
    max_date: any;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petService: PetService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            petImage: new FormControl(null, Validators.required),
            petName: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50), Validators.minLength(2)]),
            petType: new FormControl(null, Validators.required),
            petBreed: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.minLength(2)]),
            petColor: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.minLength(2)]),
            petAge: new FormControl(null, Validators.required),
            petGender: new FormControl(null, Validators.required),
            petWeight: new FormControl(0),
            petStatus: new FormControl(null, Validators.required),
            petVaccine: new FormControl(null),
            petRabies: new FormControl(null),
            petSterilization: new FormControl(null),
            petDiet: new FormControl(null),
            petToilet: new FormControl(null),
            petFriendlyToHuman: new FormControl(null),
            petFriendlyToCats: new FormControl(null),
            petFriendlyToDogs: new FormControl(null),
            petDescription: new FormControl('', [Validators.required, noWhitespaceValidator()]),
            petNote: new FormControl(''),
            intakeDate: new FormControl(null, Validators.required),
        });
        this.calendar_cf = CALENDER_CONFIG;
        this.min_date = MIN_DATE;
        this.max_date = MAX_DATE;
        this.types = petType;
        this.age = petAge;
        this.gender = petGender;
        this.moreInfor = petMoreInfor;
        this.status = petStatus;
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    filterBreed(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query.trim();

        for (let i = 0; i < (petBreed as any[]).length; i++) {
            let breed = (petBreed as any[])[i];
            if (breed && breed.label && breed.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(breed);
            }
        }
        this.filteredBreeds = filtered;
    }

    filterColor(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query.trim();

        for (let i = 0; i < (petColor as any[]).length; i++) {
            let color = (petColor as any[])[i];
            if (color && color.label && color.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                filtered.push(color);
            }
        }
        this.filteredColors = filtered;
    }

    onImagePicked(event: any) {
        if (event && event.files && event.files.length > 0) {
            this.form.controls['petImage'].markAsDirty();
            const file = event.files[0];
            this.form.patchValue({ petImage: file });
        }
    }
    
    onSavePet() {
        if (!this.form.valid) {
            this.messageService.add({severity:'error', summary: title.error, detail: message.requiredInfo});
            return;
        }
        this.petService.createPet(this.form.value).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res) => {
                if (res.success) {
                    this.form.reset();
                    this.result = true;
                    this.resultAction.emit(this.result);        
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                }
            }
        });
    }

    removePetImage() {
        this.form.patchValue({ petImage: null });
    } 
    
}
