import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { donateConfig } from 'src/app/common/constant';
import { title, message } from 'src/app/common/message';
import { DonationService } from 'src/app/services/donation.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-sponsor',
    standalone: true,
    imports: [SharedModule, CalendarModule, DropdownModule, PaginatorModule, TableModule],
    templateUrl: './sponsor.component.html',
    styleUrls: ['./sponsor.component.css']
})
export class SponsorComponent implements OnInit, OnDestroy {

    year!: number;
    month!: number;
    donates!: any;
    limit = 1;
    first!: number;
    private subscribes$: Subject<void> = new Subject<void>();

    monthNames = [
        {
            label: 'Tháng 1',
            value: '01',
            numberOfDay: 31
        },
        {
            label: 'Tháng 2',
            value: '02',
            numberOfDay: 28
        },
        {
            label: 'Tháng 3',
            value: '03',
            numberOfDay: 31
        },
        {
            label: 'Tháng 4',
            value: '04',
            numberOfDay: 30
        },
        {
            label: 'Tháng 5',
            value: '05',
            numberOfDay: 31
        },
        {
            label: 'Tháng 6',
            value: '06',
            numberOfDay: 30
        },
        {
            label: 'Tháng 7',
            value: '07',
            numberOfDay: 31
        },
        {
            label: 'Tháng 8',
            value: '08',
            numberOfDay: 31
        },
        {
            label: 'Tháng 9',
            value: '09',
            numberOfDay: 30
        },
        {
            label: 'Tháng 10',
            value: '10',
            numberOfDay: 31
        },
        {
            label: 'Tháng 11',
            value: '11',
            numberOfDay: 30
        },
        {
            label: 'Tháng 12',
            value: '12',
            numberOfDay: 31
        }
    ]

    constructor(private donationService: DonationService, private messageService: MessageService) {}

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onSearchDonations() {
        if(!this.year || !this.month) {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.requiredInfo });
            return;
        }
        let search = {
            fromDate: this.year + '-' + this.month + '-01',
            toDate: this.year + '-' + this.month + '-' + this.monthNames[this.month - 1].numberOfDay,
        }
        this.donationService.getDonations(search)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.donates = res.data.donates;
                    if(this.donates.length == 0) {
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

}
