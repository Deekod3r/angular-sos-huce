import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Subject, takeUntil} from 'rxjs';
import {message, title} from 'src/app/common/message';
import {AdoptService} from 'src/app/services/adopt.service';
import {PetService} from 'src/app/services/pet.service';
import {SharedModule} from 'src/app/shared/shared.module';
import {KnobModule} from 'primeng/knob';
import {ChartModule} from 'primeng/chart';
import {DonationService} from 'src/app/services/donation.service';
import {DropdownModule} from 'primeng/dropdown';
import {LivingCostService} from 'src/app/services/living-cost.service';
import {TreatmentService} from 'src/app/services/treatment.service';
import {BadgeModule} from 'primeng/badge';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {StatisticAdoptModule} from 'src/app/shared/components/statistic-adopt/statistic-adopt.module';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [SharedModule, KnobModule, ChartModule, DropdownModule,
        BadgeModule, DialogModule, TableModule, StatisticAdoptModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    statisticAdopt!: any;
    statisticCases!: any;

    defaultDataDonate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    defaultDataAdopt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    defaultDataLivingCost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    defaultDataTreatment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    donateData: any;
    adoptData: any;
    feeData: any;
    options: any;
    year = new Date().getFullYear();
    years: number[] = [];

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private adoptService: AdoptService, private petService: PetService,
                private messageService: MessageService, private donationService: DonationService,
                private livingCostService: LivingCostService, private treatmentService: TreatmentService) {
    }

    ngOnInit(): void {
        this.getAdoptStatistic();
        this.getStatisticCases();
        this.getDataChart();

        const currentYear = new Date().getFullYear();
        const startYear = 2020;
        for (let year = startYear; year <= currentYear; year++) {
            this.years.push(year);
        }
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = '#495057';
        const textColorSecondary = '#6c757d';
        const surfaceBorder = '#dfe7ef';

        this.feeData = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Phí sinh hoạt',
                    data: this.defaultDataLivingCost,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Viện phí',
                    data: this.defaultDataTreatment,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };

        this.donateData = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Tiền ủng hộ',
                    data: this.defaultDataDonate,
                    backgroundColor: ['rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)'],
                    borderWidth: 1
                }
            ]
        };

        this.adoptData = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [
                {
                    label: 'Tiền vía nhận nuôi',
                    data: this.defaultDataAdopt,
                    backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                    borderColor: ['rgb(54, 162, 235)'],
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

    getAdoptStatistic(): void {
        this.adoptService.getAdoptStatistic({})
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.statisticAdopt = res.data;
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

    getStatisticCases(): void {
        this.petService.getStatisticCases({
            compare: true
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.statisticCases = res.data;
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

    getTotalDonation(): void {
        this.donationService.getTotalDonation({
            year: this.year
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.defaultDataDonate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        let data = res.data;
                        data.forEach((element: any) => {
                            this.defaultDataDonate[element.month - 1] = element.totalAmount;
                        });
                        this.updateDonateData();
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

    getToalFeeAdopt(): void {
        this.adoptService.getTotalFeeAdopt({
            year: this.year
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.defaultDataAdopt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        let data = res.data;
                        data.forEach((element: any) => {
                            this.defaultDataAdopt[element.month - 1] = element.totalAmount;
                        });
                        this.updateAdoptData();
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

    getTotalLivingCost(): void {
        this.livingCostService.getTotalLivingCost({
            year: this.year
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.defaultDataLivingCost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        let data = res.data;
                        data.forEach((element: any) => {
                            this.defaultDataLivingCost[element.month - 1] = element.totalAmount;
                        });
                        this.updateLivingCostData();
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

    getToalTreatmentCost(): void {
        this.treatmentService.getTotalTreatmentCost({
            year: this.year
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.defaultDataTreatment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        let data = res.data;
                        data.forEach((element: any) => {
                            this.defaultDataTreatment[element.month - 1] = element.totalAmount;
                        });
                        this.updateTreatmentData();
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

    getDataChart(): void {
        this.getTotalDonation();
        this.getToalFeeAdopt();
        this.getTotalLivingCost();
        this.getToalTreatmentCost();
    }

    getSumArray(arr: any): number {
        return arr.reduce((a: number, b: number) => a + b, 0);
    }

    updateDonateData(): void {
        this.donateData.datasets[0].data = this.defaultDataDonate;
        this.donateData = {...this.donateData};
    }

    updateAdoptData(): void {
        this.adoptData.datasets[0].data = this.defaultDataAdopt;
        this.adoptData = {...this.adoptData};
    }

    updateLivingCostData(): void {
        this.feeData.datasets[0].data = this.defaultDataLivingCost;
        this.feeData = {...this.feeData};
    }

    updateTreatmentData(): void {
        this.feeData.datasets[1].data = this.defaultDataTreatment;
        this.feeData = {...this.feeData};
    }

}
