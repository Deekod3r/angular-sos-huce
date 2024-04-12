import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { Table, TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { FeedbackService } from 'src/app/services/feedback.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { convertDateFormat } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [SharedModule, CalendarModule, TableModule],
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {

    @ViewChild("table") table!: Table;
    currentDate = new Date();
    key = {
        fromDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
        toDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
    }
    feedbacks: any[] = [];
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private feedbackService: FeedbackService, private messageService: MessageService) {}

    ngOnInit(): void {
        this.getFeedbacks();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getFeedbacks(): void {
        let search = {
            fromDate: convertDateFormat(this.key.fromDate),
            toDate: convertDateFormat(this.key.toDate)
        }
        this.feedbackService.getFeedbacks(search)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.table.reset();
                    this.feedbacks = res.data;
                    if (this.feedbacks.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    }
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

    onRefresh(): void {
        this.key = {
            fromDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),
            toDate: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0)
        }
        this.getFeedbacks();
    }

}
