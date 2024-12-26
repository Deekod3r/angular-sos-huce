import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Subject} from 'rxjs';
import {DONATION} from 'src/app/common/constant';
import {message, title} from 'src/app/common/message';
import {DonationService} from 'src/app/services/donation.service';
import {convertDateFormat} from 'src/app/shared/utils/data.util';
import {noWhitespaceValidator} from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-donation-update',
    templateUrl: './donation-update.component.html',
    styleUrls: ['./donation-update.component.css']
})
export class DonationUpdateComponent implements OnInit, OnDestroy {

    @Input() idDonation!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    donation: any;
    maxDate: Date = new Date();
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private donationService: DonationService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
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
                        this.form = new FormGroup({
                            id: new FormControl('', [Validators.required]),
                            remitter: new FormControl('', [Validators.required, noWhitespaceValidator()]),
                            payee: new FormControl('', [Validators.required, noWhitespaceValidator()]),
                            amount: new FormControl({
                                value: null,
                                disabled: this.donation.type != DONATION.TYPE_KEY.MONEY
                            }, [Validators.required]),
                            detail: new FormControl(''),
                            date: new FormControl(null, [Validators.required]),
                        });
                        this.onInitForm();
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
            this.messageService.add({severity: 'info', summary: title.info, detail: message.noChange});
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
                    amount: this.donation.type == DONATION.TYPE_KEY.MONEY ? this.form.value.amount : 0.00,
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
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: res.error.message
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: message.error
                                });
                            }
                        }
                    });
            },
            reject: () => {
            }
        });
    }

}
