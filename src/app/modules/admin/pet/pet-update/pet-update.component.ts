import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { PET } from 'src/app/common/constant';
import { message, title } from 'src/app/common/message';
import { PetService } from 'src/app/services/pet.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator, upcaseAllFirstLetters, upcaseFirstLetter } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-update',
    templateUrl: './pet-update.component.html',
    styleUrls: ['./pet-update.component.css']
})
export class PetUpdateComponent implements OnInit, OnDestroy {

    @Input() idPet!: string;
    @Output() resultAction = new EventEmitter<boolean>();

    visibleUpdateImageModal: boolean = false;
    pet!: any;
    result: boolean = false;
    form!: FormGroup;
    filteredBreeds: any[] = [];
    filteredColors: any[] = [];
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getPet();
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
                    this.onInitForm();
                }
            }
        });
    }

    onInitForm(): void {
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

    onFilterBreed(event: AutoCompleteCompleteEvent): void {
        this.filteredBreeds = this.petService.filterBreed(event);
    }

    onFilterColor(event: AutoCompleteCompleteEvent): void {
        this.filteredColors = this.petService.filterColor(event);
    }
    
    onSavePet(event: any): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.form.dirty) {
            this.messageService.add({ severity: 'info', summary: title.info, detail: message.noChange });
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn cập nhật thông tin chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                let body = {
                    id: this.form.value.petId,
                    age: this.form.value.petAge,
                    breed: upcaseFirstLetter((this.form.value.petBreed.label ? this.form.value.petBreed.label : this.form.value.petBreed).trim()),
                    color: upcaseFirstLetter((this.form.value.petColor.label ? this.form.value.petColor.label : this.form.value.petColor).trim()),
                    description: this.form.value.petDescription.trim(),
                    note: this.form.value.petNote ? this.form.value.petNote.trim() : this.form.value.petNote,
                    diet: this.form.value.petDiet ? this.form.value.petDiet : PET.MORE_INFO_KEY.UNKNOWN,
                    friendlyToCats: this.form.value.petFriendlyToCats ? this.form.value.petFriendlyToCats : PET.MORE_INFO_KEY.UNKNOWN,
                    friendlyToDogs: this.form.value.petFriendlyToDogs ? this.form.value.petFriendlyToDogs : PET.MORE_INFO_KEY.UNKNOWN,
                    friendlyToHuman: this.form.value.petFriendlyToHuman ? this.form.value.petFriendlyToHuman : PET.MORE_INFO_KEY.UNKNOWN,
                    gender: this.form.value.petGender,
                    name: upcaseAllFirstLetters(this.form.value.petName.trim()),
                    rabies: this.form.value.petRabies ? this.form.value.petRabies : PET.MORE_INFO_KEY.UNKNOWN,
                    status: this.form.value.petStatus,
                    sterilization: this.form.value.petSterilization ? this.form.value.petSterilization : PET.MORE_INFO_KEY.UNKNOWN,
                    toilet: this.form.value.petToilet ? this.form.value.petToilet : PET.MORE_INFO_KEY.UNKNOWN,
                    type: this.form.value.petType,
                    vaccine: this.form.value.petVaccine ? this.form.value.petVaccine : PET.MORE_INFO_KEY.UNKNOWN,
                    weight: this.form.value.petWeight,
                    intakeDate: convertDateFormat(this.form.value.intakeDate)
                }
                this.petService.updatePet(body, this.idPet)
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
                        if (res.error) {
                            this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                        } else {
                            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                        }
                    }
                });
            },
            reject: () => {}
        });
    }
    
    onShowUpdateImageModal(): void {
        this.visibleUpdateImageModal = true;
    }

    onUploadImage(event: any): void {
        const image = event.files[0];
        let formData = new FormData();
        formData.append('id', this.idPet);
        formData.append('image', image);
        this.petService.updatePetImage(formData, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
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
        return this.pet.status === PET.STATUS_KEY.DEAD || this.pet.status === PET.STATUS_KEY.ADOPTED;
    }

}
