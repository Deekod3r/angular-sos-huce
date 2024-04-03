import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { DonationService } from 'src/app/services/donation.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-donation-create',
    templateUrl: './donation-create.component.html',
    styleUrls: ['./donation-create.component.css']
})
export class DonationCreateComponent implements OnInit, OnDestroy  {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private donationService: DonationService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            remitter: new FormControl('', [Validators.required, noWhitespaceValidator()]),
            payee: new FormControl('', [Validators.required, noWhitespaceValidator()]),
            amount: new FormControl('', [Validators.required]),
            detail: new FormControl(''),
            date: new FormControl('', [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }
    
    onSaveDonate(): void {
        if(this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let body = {
            remitter: this.form.value.remitter.trim(),
            payee: this.form.value.payee.trim(),
            amount: this.form.value.amount,
            detail: this.form.get('detail')?.value,
            date: convertDateFormat(this.form.value.date)
        }
        this.donationService.createDonation(body)
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
