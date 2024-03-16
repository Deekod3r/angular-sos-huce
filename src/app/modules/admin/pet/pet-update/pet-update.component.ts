import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { petType, petAge, petGender, petMoreInfor, petStatus, petBreed, petColor, CALENDER_CONFIG, MAX_DATE, MIN_DATE, petStatusKey } from 'src/app/common/constant';
import { message, messagePet, title } from 'src/app/common/message';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-update',
    templateUrl: './pet-update.component.html',
    providers: [MessageService],
    styleUrls: ['./pet-update.component.css']
})
export class PetUpdateComponent {

    @Input() idPet!: string;
    @Output() resultAction = new EventEmitter<boolean>();

    visibleUpdateImageModal: boolean = false;
    pet!: any;
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
        this.calendar_cf = CALENDER_CONFIG;
        this.min_date = MIN_DATE;
        this.max_date = MAX_DATE;
        this.getPet();
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

    getPet() {
        this.petService.getPetById(this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res) => {
                if (res.success) {
                    this.pet = res.data;
                    this.form = new FormGroup({
                        petId: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, [Validators.required, noWhitespaceValidator()]),
                        petName: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, [Validators.required, noWhitespaceValidator()]),
                        petType: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, Validators.required),
                        petBreed: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, [Validators.required, noWhitespaceValidator()]),
                        petColor: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, [Validators.required, noWhitespaceValidator()]),
                        petAge: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, Validators.required),
                        petGender: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, Validators.required),
                        petWeight: new FormControl({ value: 0, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petStatus: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, Validators.required),
                        petVaccine: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petRabies: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petSterilization: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petDiet: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petToilet: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petFriendlyToHuman: new FormControl({value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petFriendlyToCats: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petFriendlyToDogs: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        petDescription: new FormControl({ value: '', disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, [Validators.required, noWhitespaceValidator()]),
                        petNote: new FormControl({ value: '', disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }),
                        intakeDate: new FormControl({ value: null, disabled: this.pet.status == petStatusKey.adopted || this.pet.status == petStatusKey.dead }, Validators.required),
                    });
                    this.initForm();
                }
            }
        });
    }

    initForm() {
        this.form.patchValue({
            petId: this.pet.id,
            petName: this.pet.name,
            petType: this.pet.type,
            petBreed: {
                label: this.pet.breed
            },
            petColor: {
                label: this.pet.color
            },
            petAge: this.pet.age,
            petGender: this.pet.gender,
            petWeight: this.pet.weight,
            petStatus: this.pet.status,
            petVaccine: this.pet.vaccine,
            petRabies: this.pet.rabies,
            petSterilization: this.pet.sterilization,
            petDiet: this.pet.diet,
            petToilet: this.pet.toilet,
            petFriendlyToHuman: this.pet.friendlyToHuman,
            petFriendlyToCats: this.pet.friendlyToCats,
            petFriendlyToDogs: this.pet.friendlyToDogs,
            petDescription: this.pet.description,
            petNote: this.pet.note,
            intakeDate: new Date(this.pet.intakeDate)
        });
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
    
    onSavePet() {
        if (!this.form.valid) {
            this.messageService.add({severity:'error', summary: title.error, detail: message.requiredInfo});
            return;
        }
        this.petService.updatePet(this.form.value, this.idPet)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.form.reset();
                    this.result = true;
                    this.resultAction.emit(this.result);        
                }
            },
            error: (res) => {
                console.log(res);
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                }
            }
        });
    }
    
    showUpdateImageModal() {
        this.visibleUpdateImageModal = true;
    }

    upload(event: any) {
        const image = event.files[0];
        this.petService.updatePetImage(image, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.visibleUpdateImageModal = false;
                    this.result = true;
                    this.resultAction.emit(this.result);        
                    this.messageService.add({severity:'success', summary: title.success, detail: messagePet.updateImageSuccess});
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
    
    isNotAvailableForUpdate(): boolean {
        return this.pet.status === petStatusKey.dead || this.pet.status === petStatusKey.adopted;
    }

}
