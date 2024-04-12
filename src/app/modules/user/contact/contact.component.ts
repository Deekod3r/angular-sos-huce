import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { title, message, messageFeedback } from 'src/app/common/message';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [SharedModule, InputTextareaModule, TabViewModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

    banks!: any;
    socials: any;
    contacts: any;
    formFeedback!: FormGroup;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private bankService: BankService, private messageService: MessageService, 
        private configService: ConfigService, private feedbackService: FeedbackService) { }

    ngOnInit(): void {
        this.getBanks();
        this.getConfigs();
        this.formFeedback = new FormGroup({
            fullName: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(100), Validators.minLength(2)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            message: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.minLength(20)])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getBanks(): void {
        this.bankService.getBanks()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.banks = res.data;
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

    getConfigs(): void {
        this.configService.socials.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.socials = data;
        });
        this.configService.contacts.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.contacts = data;
        });
    }

    onFeedback(): void {
        if (this.formFeedback.invalid) {
            this.formFeedback.markAllAsTouched();
            return;
        }
        let body = {
            fullName: this.formFeedback.get('fullName')?.value.trim(),
            email: this.formFeedback.get('email')?.value.trim(),
            message: this.formFeedback.get('message')?.value.trim()
        }
        this.feedbackService.createFeedback(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageFeedback.createSuccess });
                    this.formFeedback.reset();
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
