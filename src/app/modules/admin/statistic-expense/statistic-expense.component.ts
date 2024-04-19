import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { Subject } from 'rxjs';
import { message, title } from 'src/app/common/message';
import { LivingCostService } from 'src/app/services/living-cost.service';
import { TreatmentService } from 'src/app/services/treatment.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { filteredSearch } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-statistic-expense',
    standalone: true,
    imports: [SharedModule, CalendarModule, DropdownModule, ChartModule],
    templateUrl: './statistic-expense.component.html',
    styleUrls: ['./statistic-expense.component.css']
})
export class StatisticExpenseComponent implements OnInit, OnDestroy {

    objectStatisticSelected!: any;
    typeStatisticSelected!: any;
    year!: number;
    month!: number;
    options: any;
    statisticData: any;
    private subscribes$: Subject<void> = new Subject<void>();
    objectStatistic = [
        {
            label: 'Sinh hoạt phí',
            value: 1
        },
        {
            label: 'Viện phí',
            value: 2
        }
    ];
    monthNames = [
        {
            label: 'Tháng 1',
            value: '01',
        },
        {
            label: 'Tháng 2',
            value: '02',
        },
        {
            label: 'Tháng 3',
            value: '03',
        },
        {
            label: 'Tháng 4',
            value: '04',
        },
        {
            label: 'Tháng 5',
            value: '05',
        },
        {
            label: 'Tháng 6',
            value: '06',
        },
        {
            label: 'Tháng 7',
            value: '07',
        },
        {
            label: 'Tháng 8',
            value: '08',
        },
        {
            label: 'Tháng 9',
            value: '09',
        },
        {
            label: 'Tháng 10',
            value: '10',
        },
        {
            label: 'Tháng 11',
            value: '11',
        },
        {
            label: 'Tháng 12',
            value: '12',
        }
    ]

    constructor(public treatmentService: TreatmentService, public livingCostService: LivingCostService, private messageService: MessageService) { }

    ngOnInit(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.statisticData = {
            labels: [],
            datasets: [
                {
                    label: '',
                    data: [],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)'],
                    borderWidth: 1
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onStatistic(): void {
        if (!this.objectStatisticSelected) {
            this.messageService.add({ severity: 'error', summary: title.error, detail: 'Vui lòng chọn đối tượng' });
            return;
        }
        if (!this.year) {
            this.messageService.add({ severity: 'error', summary: title.error, detail: 'Vui lòng chọn năm' });
            return;
        }
        if (this.objectStatisticSelected == 1) {
            let search = {
                month: this.month,
                year: this.year,
                byCategory: true
            };
            this.livingCostService.getTotalLivingCost(filteredSearch(search)).subscribe({
                next: (res) => {
                    if (res.success) {
                        this.statisticData = {
                            labels: res.data.map((item: any) => this.livingCostService.getCategory(item.category)),
                            datasets: [
                                {
                                    label: 'Sinh hoạt phí',
                                    data: res.data.map((item: any) => item.totalAmount),
                                    backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                                    borderColor: ['rgb(255, 159, 64)'],
                                    borderWidth: 1
                                }
                            ]
                        };
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
        } else {
            let search = {
                month: this.month,
                year: this.year,
                byType: true
            };
            this.treatmentService.getTotalTreatmentCost(filteredSearch(search)).subscribe({
                next: (res) => {
                    if (res.success) {
                        this.statisticData = {
                            labels: res.data.map((item: any) => this.treatmentService.getType(item.category)),
                            datasets: [
                                {
                                    label: 'Viện phí',
                                    data: res.data.map((item: any) => item.totalAmount),
                                    backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                                    borderColor: ['rgb(255, 159, 64)'],
                                    borderWidth: 1
                                }
                            ]
                        };
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

}
