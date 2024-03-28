import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { adoptConfig } from 'src/app/common/constant';
import { title, message } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
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
    adopts: any[] = [];
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petCareLogService: PetCareLogService, private messageService: MessageService, private adoptService: AdoptService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', [Validators.required]),
            adoptId: new FormControl({value: '', disabled: true}, [Validators.required]),
            date: new FormControl(null, [Validators.required]),
            note: new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
        this.getAdopts();
        this.getLog();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdopts(): void {
        this.adoptService.getAdopts({ status: adoptConfig.statusKey.complete })
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.adopts = res.data.adopts;
            }
        });
    }

    getLog(): void {
        this.petCareLogService.getLogById(this.idLog)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.log = res.data;
                this.form.patchValue({
                    id: this.log.id,
                    adoptId: this.log.adoptId,
                    date: new Date(this.log.date),
                    note: this.log.note
                });
            }
        });
    }

    onSaveLog(): void {
        if (this.form.valid) {
            let body = {
                id: this.form.value.id,
                adoptId: this.form.value.adoptId,
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
        } else {
            this.form.markAllAsTouched();
        }
    }
    
}
