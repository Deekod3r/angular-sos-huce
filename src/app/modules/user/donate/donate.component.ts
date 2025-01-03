import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {FieldsetModule} from 'primeng/fieldset';
import {Subject, takeUntil} from 'rxjs';
import {message, title} from 'src/app/common/message';
import {BankService} from 'src/app/services/bank.service';
import {ConfigService} from 'src/app/services/config.service';
import {SharedModule} from 'src/app/shared/shared.module';

@Component({
    selector: 'app-donate',
    standalone: true,
    imports: [SharedModule, FieldsetModule],
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit, OnDestroy {

    banks!: any;
    donationIntroductions: any;
    volunteerIntroduction: any;
    volunteerConditions: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private bankService: BankService, private messageService: MessageService, private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.getBanks();
        this.configService.donates.asObservable()
            .pipe(takeUntil(this.subscribes$))
            .subscribe(data => {
                this.donationIntroductions = data;
            });
        this.configService.volunteerIntroduction.asObservable()
            .pipe(takeUntil(this.subscribes$))
            .subscribe(data => {
                this.volunteerIntroduction = data;
            });
        this.configService.volunteerConditions.asObservable()
            .pipe(takeUntil(this.subscribes$))
            .subscribe(data => {
                this.volunteerConditions = data;
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
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

}
