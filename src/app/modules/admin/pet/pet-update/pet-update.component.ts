import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { MAX_DATE, MIN_DATE, petConfig } from 'src/app/common/constant';
import { message, messagePet, title } from 'src/app/common/message';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-update',
    templateUrl: './pet-update.component.html',
    styleUrls: ['./pet-update.component.css']
})
export class PetUpdateComponent {

    @Input() idPet!: string;
    @Output() resultAction = new EventEmitter<boolean>();

    visibleUpdateImageModal: boolean = false;
    pet!: any;
    result: boolean = false;
    form!: FormGroup;
    filteredBreeds: any[] = [];
    filteredColors: any[] = [];
    min_date: any;
    max_date: any;
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getPet();
        this.min_date = MIN_DATE;
        this.max_date = MAX_DATE;
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getPet(): void {
        this.petService.getPetById(this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res) => {
                if (res.success) {
                    this.pet = res.data;
                    this.form = new FormGroup({
                        petId: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, [Validators.required, noWhitespaceValidator()]),
                        petName: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, [Validators.required, noWhitespaceValidator()]),
                        petType: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, Validators.required),
                        petBreed: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, [Validators.required, noWhitespaceValidator()]),
                        petColor: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, [Validators.required, noWhitespaceValidator()]),
                        petAge: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, Validators.required),
                        petGender: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, Validators.required),
                        petWeight: new FormControl({ value: 0, disabled: this.isNotAvailableForUpdate() }),
                        petStatus: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, Validators.required),
                        petVaccine: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petRabies: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petSterilization: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petDiet: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petToilet: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petFriendlyToHuman: new FormControl({value: null, disabled: this.isNotAvailableForUpdate() }),
                        petFriendlyToCats: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petFriendlyToDogs: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }),
                        petDescription: new FormControl({ value: '', disabled: this.isNotAvailableForUpdate() }, [Validators.required, noWhitespaceValidator()]),
                        petNote: new FormControl({ value: '', disabled: this.isNotAvailableForUpdate() }),
                        intakeDate: new FormControl({ value: null, disabled: this.isNotAvailableForUpdate() }, Validators.required),
                    });
                    this.initForm();
                }
            }
        });
    }

    initForm(): void {
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

    filterBreed(event: AutoCompleteCompleteEvent): void {
        this.filteredBreeds = this.petService.filterBreed(event);
    }

    filterColor(event: AutoCompleteCompleteEvent): void {
        this.filteredColors = this.petService.filterColor(event);
    }
    
    onSavePet(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
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
    
    showUpdateImageModal(): void {
        this.visibleUpdateImageModal = true;
    }

    upload(event: any): void {
        const image = event.files[0];
        this.petService.updatePetImage(image, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.visibleUpdateImageModal = false;
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
    
    isNotAvailableForUpdate(): boolean {
        return this.pet.status === petConfig.statusKey.dead || this.pet.status === petConfig.statusKey.adopted;
    }

}
