import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, SharedModule } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    statisticAdopt = {
        countWaiting: '',
        countInProgress: '',
        countCancel: '',
        countReject: '',
        countComplete: '',
        total: ''
    };
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private adoptService: AdoptService, private messageService: MessageService) {}

    ngOnInit(): void {
        this.getAdoptStatistic();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdoptStatistic(): void {
        this.adoptService.getAdoptStatistic({})
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.statisticAdopt.countWaiting = res.data.countWaiting;
                    this.statisticAdopt.countInProgress = res.data.countInProgress;
                    this.statisticAdopt.countCancel = res.data.countCancel;
                    this.statisticAdopt.countReject = res.data.countReject;
                    this.statisticAdopt.countComplete = res.data.countComplete;
                    this.statisticAdopt.total = res.data.total;
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
