import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { title, message } from 'src/app/common/message';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [SharedModule, InputTextareaModule, TabViewModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

    banks!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private bankService: BankService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getBanks();
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

}
