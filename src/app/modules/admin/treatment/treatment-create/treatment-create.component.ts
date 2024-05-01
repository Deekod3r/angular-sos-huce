import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { TreatmentService } from 'src/app/services/treatment.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
function endDateAfterStartDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const startDate = control.parent?.value.startDate;
    const endDate = control.value;
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();
      if (endDateTime < startDateTime) {
        return { 'endDateBeforeStartDate': true };
      }
    }
    return null;
}
@Component({
    selector: 'app-treatment-create',
    templateUrl: './treatment-create.component.html',
    styleUrls: ['./treatment-create.component.css']
})
export class TreatmentCreateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    @Input() pets: any[] = [];
    maxDate: Date = new Date();
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public treatmentService: TreatmentService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            location: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            petId: new FormControl('', [Validators.required]),
            detailPet: new FormArray([], Validators.required),
            images: new FormArray([], Validators.required)
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onInitDetailPet(): FormGroup {
        return new FormGroup({
            name: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required, endDateAfterStartDateValidator]),
            type: new FormControl('', [Validators.required]),
            price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
            quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
            description: new FormControl('')
        });
    }

    onSaveTreatment(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.form.controls['detailPet'].invalid) {
            this.form.controls['detailPet'].markAllAsTouched();
            return;
        }
        let formData = new FormData();
        formData.append('location', this.form.controls['location'].value.trim());
        formData.append('petId', this.form.controls['petId'].value);
        for (let i = 0; i < this.form.controls['detailPet'].value.length; i++) {
            const detailPet = this.form.controls['detailPet'].value[i];
            for (const key in detailPet) {
                if (detailPet.hasOwnProperty(key)) {
                    let value = detailPet[key];
                    if (typeof value === 'string') {
                        value = value.trim();
                    }
                    formData.append(`detailPet[${i}].${key}`, value);
                }
            }
        }
        
        for (let i = 0; i < this.form.controls['images'].value.length; i++) {
            formData.append('images', this.form.controls['images'].value[i]);
        }
        this.treatmentService.createTreatment(formData)
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
    }

    onImagePicked(event: any): void {
        if (event && event.files && event.files.length > 0) {
            const imagesArray = this.form.controls['images'] as FormArray;
            for (const file of event.files) {
                imagesArray.push(new FormControl(file));
            }
        }
    }

    onRemoveImage(event: any): void {
        const imagesArray = this.form.controls['images'] as FormArray;
        imagesArray.removeAt(event.index);
    }

    getDetailPet(): AbstractControl[] {
        return (this.form.controls['detailPet'] as FormArray).controls;
    }

    getDetailPetControl(index: number): FormGroup {
        return (this.form.controls['detailPet']  as FormArray).at(index) as FormGroup;
    }

    onAddDetailPet(): void {
        if (this.form.controls['petId'].invalid) {
            this.form.controls['petId'].markAllAsTouched();
            return;
        }
        const detailLocationArray = this.form.controls['detailPet'] as FormArray;
        detailLocationArray.push(this.onInitDetailPet());
    }    

    onRemoveDetailPet(index: number): void {
        const detailLocationArray = this.form.controls['detailPet'] as FormArray;
        detailLocationArray.removeAt(index);
    }

}
