import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { adoptStatusKey } from 'src/app/common/constant';
import { message, title } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { PetCareLogService } from 'src/app/services/pet-care-log.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-pet-care-log-create',
    providers: [MessageService],
    templateUrl: './pet-care-log-create.component.html',
    styleUrls: ['./pet-care-log-create.component.css']
})
export class PetCareLogCreateComponent implements OnInit {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    adopts: any[] = [];
    
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petCareLogService: PetCareLogService, private messageService: MessageService, private adoptService: AdoptService) { }

    ngOnInit() {
        this.form = new FormGroup({
            adoptId: new FormControl('', [Validators.required]),
            date: new FormControl(null, [Validators.required]),
            note: new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
        this.getAdopts();
    }

    ngOnDestroy() {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdopts() {
        this.adoptService.getAdopts({ status: adoptStatusKey.complete })
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.adopts = res.data.adopts;
            }
        });
    }

    onCreateLog() {
        if (this.form.valid) {
            this.petCareLogService.createLog(this.form.value)
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
            this.messageService.add({severity:'error', summary: 'Lỗi', detail: message.requiredInfo});
        }
    }

}
