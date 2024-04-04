import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { title, message } from 'src/app/common/message';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/services/config.service';

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
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private bankService: BankService, private messageService: MessageService, private configService: ConfigService) { }

    ngOnInit(): void {
        this.getBanks();
        this.getConfigs();
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

}
