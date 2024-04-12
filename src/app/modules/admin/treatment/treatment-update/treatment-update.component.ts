import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { FileService } from 'src/app/services/file.service';
import { TreatmentService } from 'src/app/services/treatment.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-treatment-update',
    templateUrl: './treatment-update.component.html',
    styleUrls: ['./treatment-update.component.css']
})
export class TreatmentUpdateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    @Input() pets: any[] = [];
    @Input() idTreatment: any;
    treatment: any;
    newImages: any[] = [];
    visibleUpdateImageModal: boolean = false;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public treatmentService: TreatmentService, private messageService: MessageService, 
        private confirmationService: ConfirmationService, private fileService: FileService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl(null, Validators.required),
            location: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            name: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
            price: new FormControl('', [Validators.required, Validators.min(0.1)]),
            startDate: new FormControl('', [Validators.required]),
            endDate: new FormControl('', [Validators.required]),
            quantity: new FormControl('', [Validators.required, Validators.min(1)]),
            status: new FormControl('', [Validators.required]),
            type: new FormControl('', [Validators.required]),
            description: new FormControl(''),
            petId: new FormControl({ value: '', disabled: true }, [Validators.required]),
            
        });
        this.getTreatment();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getTreatment(): void {
        this.treatmentService.getTreatment(this.idTreatment)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.treatment = res.data;
                    this.onInitForm();
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

    onInitForm(): void {
        this.form.patchValue({
            id: this.treatment.id,
            location: this.treatment.location,
            name: this.treatment.name,
            price: this.treatment.price,
            startDate: new Date(this.treatment.startDate),
            endDate: new Date(this.treatment.endDate),
            quantity: this.treatment.quantity,
            status: this.treatment.status,
            type: this.treatment.type,
            description: this.treatment.description,
            petId: this.treatment.petId,
        });
    }

    onSaveTreatment(event: any): void {
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
                    id: this.form.controls['id'].value,
                    name: this.form.controls['name'].value.trim(),
                    status: this.form.controls['status'].value,
                    price: this.form.controls['price'].value,
                    startDate: convertDateFormat(this.form.controls['startDate'].value),
                    endDate: convertDateFormat(this.form.controls['endDate'].value),
                    quantity: this.form.controls['quantity'].value,
                    type: this.form.controls['type'].value,
                    description: this.form.controls['description'].value ? this.form.controls['description'].value.trim() : '',
                    location: this.form.controls['location'].value.trim()
                };
                this.treatmentService.updateTreatment(this.idTreatment, body)
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
            reject: () => {
            }
        });
    }

    onDeleteImage(id: string): void {
        this.confirmationService.confirm({
            message: 'Bạn chắc chắn muốn xoá hình ảnh này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.fileService.delete(id)
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
            reject: () => {
            }
        });
    }
    
    onImagePicked(event: any): void {
        if (event && event.files && event.files.length > 0) {
            for (const file of event.files) {
                this.newImages.push(file);
            }
        }
    }

    onRemoveImage(event: any): void {
        this.newImages.splice(event.index, 1);
    }

    onUploadImages(): void {
        let formData = new FormData();
        for (const file of this.newImages) {
            formData.append('images', file);
        }
        formData.append('objectId', this.idTreatment);
        formData.append('objectName', this.treatment.name);
        this.fileService.upload(formData)
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

}
