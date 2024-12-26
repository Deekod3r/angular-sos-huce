import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Subject, takeUntil} from 'rxjs';
import {message, title} from 'src/app/common/message';
import {LivingCostService} from 'src/app/services/living-cost.service';
import {convertDateFormat} from 'src/app/shared/utils/data.util';
import {noWhitespaceValidator} from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-living-cost-create',
    templateUrl: './living-cost-create.component.html',
    styleUrls: ['./living-cost-create.component.css']
})
export class LivingCostCreateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    maxDate: Date = new Date();
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public livingCostService: LivingCostService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]),
            cost: new FormControl(null, [Validators.required]),
            date: new FormControl('', [Validators.required]),
            category: new FormControl('', [Validators.required]),
            note: new FormControl(''),
            images: new FormArray([], [Validators.required])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onSaveLivingCost(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let formData = new FormData();
        formData.append('name', this.form.controls['name'].value.trim());
        formData.append('cost', this.form.controls['cost'].value);
        formData.append('date', convertDateFormat(this.form.controls['date'].value));
        formData.append('category', this.form.controls['category'].value);
        formData.append('note', this.form.controls['note'].value ? this.form.controls['note'].value.trim() : '');
        const imagesArray = this.form.controls['images'] as FormArray;
        for (const file of imagesArray.value) {
            formData.append('images', file);
        }
        this.livingCostService.createLivingCost(formData)
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

}
