import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {AutoCompleteCompleteEvent} from 'primeng/autocomplete/autocomplete.interface';
import {Subject, takeUntil} from 'rxjs';
import {PET} from 'src/app/common/constant';
import {message, title} from 'src/app/common/message';
import {PetService} from 'src/app/services/pet.service';
import {convertDateFormat} from 'src/app/shared/utils/data.util';
import {noWhitespaceValidator, upperCaseAllFirstLetters, upperCaseFirstLetter} from 'src/app/shared/utils/string.util';


@Component({
    selector: 'app-pet-create',
    templateUrl: './pet-create.component.html',
    styleUrls: ['./pet-create.component.css']
})
export class PetCreateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    filteredBreeds: any[] = [];
    filteredColors: any[] = [];
    maxDate: Date = new Date();

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            petImage: new FormControl(null, Validators.required),
            petName: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(50), Validators.minLength(2)]),
            petType: new FormControl(null, Validators.required),
            petBreed: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.minLength(2)]),
            petColor: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.minLength(2)]),
            petAge: new FormControl(null, Validators.required),
            petGender: new FormControl(null, Validators.required),
            petWeight: new FormControl(null, [Validators.required, Validators.min(0.01)]),
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
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onFilterBreed(event: AutoCompleteCompleteEvent): void {
        this.filteredBreeds = this.petService.filterBreed(event);
    }

    onFilterColor(event: AutoCompleteCompleteEvent): void {
        this.filteredColors = this.petService.filterColor(event);
    }

    onImagePicked(event: any): void {
        if (event && event.files && event.files.length > 0) {
            this.form.controls['petImage'].markAsDirty();
            const file = event.files[0];
            this.form.patchValue({petImage: file});
        }
    }

    onSavePet(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        const formData = new FormData();
        formData.append('age', this.form.value.petAge);
        formData.append('breed', upperCaseFirstLetter((this.form.value.petBreed.label ? this.form.value.petBreed.label : this.form.value.petBreed).trim()));
        formData.append('color', upperCaseFirstLetter((this.form.value.petColor.label ? this.form.value.petColor.label : this.form.value.petColor).trim()));
        formData.append('description', this.form.value.petDescription.trim());
        formData.append('note', this.form.value.petNote ? this.form.value.petNote.trim() : this.form.value.petNote);
        formData.append('diet', this.form.value.petDiet ? this.form.value.petDiet : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('friendlyToCats', this.form.value.petFriendlyToCats ? this.form.value.petFriendlyToCats : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('friendlyToDogs', this.form.value.petFriendlyToDogs ? this.form.value.petFriendlyToDogs : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('friendlyToHuman', this.form.value.petFriendlyToHuman ? this.form.value.petFriendlyToHuman : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('gender', this.form.value.petGender);
        formData.append('image', this.form.value.petImage);
        formData.append('name', upperCaseAllFirstLetters(this.form.value.petName.trim()));
        formData.append('rabies', this.form.value.petRabies ? this.form.value.petRabies : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('status', this.form.value.petStatus);
        formData.append('sterilization', this.form.value.petSterilization ? this.form.value.petSterilization : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('toilet', this.form.value.petToilet ? this.form.value.petToilet : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('type', this.form.value.petType);
        formData.append('vaccine', this.form.value.petVaccine ? this.form.value.petVaccine : PET.MORE_INFO_KEY.UNKNOWN);
        formData.append('weight', this.form.value.petWeight);
        formData.append('intakeDate', convertDateFormat(this.form.value.intakeDate));
        this.petService.createPet(formData)
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
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    onRemovePetImage(): void {
        this.form.patchValue({petImage: null});
    }

}
