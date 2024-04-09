import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ADOPT } from 'src/app/common/constant';
import { message, title } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { PetCareLogService } from 'src/app/services/pet-care-log.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-care-log-create',
    templateUrl: './pet-care-log-create.component.html',
    styleUrls: ['./pet-care-log-create.component.css']
})
export class PetCareLogCreateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    @Input() adopts: any[] = [];
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petCareLogService: PetCareLogService, private messageService: MessageService, private adoptService: AdoptService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            adoptId: new FormControl('', [Validators.required]),
            date: new FormControl(null, [Validators.required]),
            note: new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onSaveLog(): void {
        if (this.form.valid) {
            let body = {
                adoptId: this.form.value.adoptId,
                date: convertDateFormat(this.form.value.date),
                note: this.form.value.note.trim()
            }
            this.petCareLogService.createLog(body)
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
