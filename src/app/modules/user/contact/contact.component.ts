import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';

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

    constructor(private bankService: BankService) { }

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
        .subscribe(res => {
            if (res.success) {
                this.banks = res.data;
            }
        });
    }

}
