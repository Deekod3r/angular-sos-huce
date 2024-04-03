import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { DonationService } from 'src/app/services/donation.service';
import { convertDateFormat } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-donation-update',
    templateUrl: './donation-update.component.html',
    styleUrls: ['./donation-update.component.css']
})
export class DonationUpdateComponent implements OnInit, OnDestroy  {

    @Input() idDonation!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    donation: any;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private donationService: DonationService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', [Validators.required]),
            remitter: new FormControl('', [Validators.required, noWhitespaceValidator()]),
            payee: new FormControl('', [Validators.required, noWhitespaceValidator()]),
            amount: new FormControl(null, [Validators.required]),
            detail: new FormControl(''),
            date: new FormControl(null, [Validators.required]),
        });
        this.getDonate();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }
    
    getDonate(): void {
        this.donationService.getDonation(this.idDonation)
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.donation = res.data;
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
            id: this.donation.id,
            remitter: this.donation.remitter,
            payee: this.donation.payee,
            amount: this.donation.amount,
            detail: this.donation.detail,
            date: new Date(this.donation.date)
        });
    }

    onSaveDonate(event: any): void {
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
                    remitter: this.form.value.remitter.trim(),
                    payee: this.form.value.payee.trim(),
                    amount: this.form.value.amount,
                    detail: this.form.get('detail')?.value,
                    date: convertDateFormat(this.form.value.date)
                }
                this.donationService.updateDonation(body, this.idDonation)
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

}
