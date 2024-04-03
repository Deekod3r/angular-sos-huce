import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { PetCareLogService } from 'src/app/services/pet-care-log.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-care-log-update',
    templateUrl: './pet-care-log-update.component.html',
    styleUrls: ['./pet-care-log-update.component.css']
})
export class PetCareLogUpdateComponent implements OnInit, OnDestroy {

    @Input() idLog!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;

    form!: FormGroup;
    log: any;
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petCareLogService: PetCareLogService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', [Validators.required]),
            date: new FormControl(null, [Validators.required]),
            note: new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
        this.getLog();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getLog(): void {
        this.petCareLogService.getLogById(this.idLog)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.log = res.data;
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
            id: this.log.id,
            date: new Date(this.log.date),
            note: this.log.note
        });
    }

    onSaveLog(event: any): void {
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
                    id: this.form.value.id,
                    date: convertDateFormat(this.form.value.date),
                    note: this.form.value.note.trim()
                }
                this.petCareLogService.updateLog(body, this.idLog)
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
    
}
