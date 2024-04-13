import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';

@Component({
    selector: 'app-statistic-adopt',
    templateUrl: './statistic-adopt.component.html',
    styleUrls: ['./statistic-adopt.component.css']
})
export class StatisticAdoptComponent implements OnInit, OnDestroy {

    @Input() userId: string = '';
    @Input() visibleAdoptsNearLog: boolean = false;
    visibleAdoptsNearLogModal: boolean = false;
    adoptsNearLog!: any;

    statistic = {
        countWaiting: '',
        countInProgress: '',
        countCancel: '',
        countReject: '',
        countComplete: '',
        total: ''
    };
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private adoptService: AdoptService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getAdoptStatistic();
        if (this.visibleAdoptsNearLog) {
            this.getAdoptsNearLog();
        }
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userId'] && !changes['userId'].firstChange) {
            this.getAdoptStatistic();
        }
    }   

    getAdoptStatistic(): void {
        this.adoptService.getAdoptStatistic({ 
            user: this.userId
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.statistic = res.data;
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

    getAdoptsNearLog(): void {
        this.adoptService.getAdoptsNearLog()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.adoptsNearLog = res.data;
                    const currentDate = new Date();
                    this.adoptsNearLog.forEach((element: any) => {
                        const checkDates = [
                            new Date(element.checkDateFirst),
                            new Date(element.checkDateSecond),
                            new Date(element.checkDateThird)
                        ];
                        const nearestDate = checkDates.reduce(
                            (nearest, date) => Math.abs(date.getTime() - currentDate.getTime()) < Math.abs(nearest.getTime() - currentDate.getTime()) ? date : nearest);
                        element.checkDate = nearestDate.getFullYear() + '-' + (nearestDate.getMonth() + 1) + '-' + nearestDate.getDate();
                        const differenceInTime = nearestDate.getTime() - currentDate.getTime();
                        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
                        element.dateDiff = Math.ceil(differenceInDays);
                    });
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
