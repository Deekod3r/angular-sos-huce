import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { BankService } from 'src/app/services/bank.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-donate',
    standalone: true,
    imports: [SharedModule, FieldsetModule],
    templateUrl: './donate.component.html',
    styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit, OnDestroy {

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
