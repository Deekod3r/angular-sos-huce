import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message, messageLivingCost } from 'src/app/common/message';
import { FileService } from 'src/app/services/file.service';
import { LivingCostService } from 'src/app/services/living-cost.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-living-cost-update',
    templateUrl: './living-cost-update.component.html',
    styleUrls: ['./living-cost-update.component.css']
})
export class LivingCostUpdateComponent implements OnInit, OnDestroy {

    @Input() idLivingCost!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    livingCost: any;
    visibleUpdateImageModal: boolean = false;
    newImages: any[] = [];
    maxDate: Date = new Date();
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private messageService: MessageService, public livingCostService: LivingCostService, 
        private confirmationService: ConfirmationService, private fileService: FileService) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl(null, Validators.required),
            name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator()]),
            cost: new FormControl(null, [Validators.required]),
            category: new FormControl('', [Validators.required]),
            date: new FormControl('', [Validators.required]),
            note: new FormControl(''),
        });
        this.getLivingCost();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getLivingCost(): void {
        this.livingCostService.getLivingCost(this.idLivingCost)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.livingCost = res.data;
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
        this.form.controls['id'].setValue(this.livingCost.id);
        this.form.controls['name'].setValue(this.livingCost.name);
        this.form.controls['cost'].setValue(this.livingCost.cost);
        this.form.controls['date'].setValue(new Date(this.livingCost.date));
        this.form.controls['category'].setValue(this.livingCost.category);
        this.form.controls['note'].setValue(this.livingCost.note);
    }

    onSaveLivingCost(event: any): void {
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
                    cost: this.form.controls['cost'].value,
                    date: convertDateFormat(this.form.controls['date'].value),
                    category: this.form.controls['category'].value,
                    note: this.form.controls['note'].value ? this.form.controls['note'].value.trim() : ''
                };
                this.livingCostService.updateLivingCost(body, this.idLivingCost)
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
        formData.append('objectId', this.idLivingCost);
        formData.append('objectName', this.livingCost.name);
        this.fileService.upload(formData)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.getLivingCost();
                    this.visibleUpdateImageModal = false;
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageLivingCost.updateSuccess });
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
                            this.getLivingCost();
                            this.visibleUpdateImageModal = false;
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageLivingCost.updateSuccess });
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

}
