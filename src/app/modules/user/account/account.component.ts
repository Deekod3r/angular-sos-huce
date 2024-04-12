import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabView, TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { ADOPT, PET } from 'src/app/common/constant';
import { title, message, messageAdopt, messageUser } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { AuthService } from 'src/app/services/auth.service';
import { PetService } from 'src/app/services/pet.service';
import { UserService } from 'src/app/services/user.service';
import { AccountModule } from './account.module';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PetCareLogService } from 'src/app/services/pet-care-log.service';
import { TreatmentPetModule } from 'src/app/shared/components/treatment-pet/treatment-pet.module';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [AccountModule, TabViewModule, TableModule, TagModule, DialogModule, BadgeModule, TreatmentPetModule],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

    @ViewChild("tabView") tabView!: TabView;

    user: any;
    info = {
        key: '',
        title: '',
        userId: '',
        userInfo: ''
    }
    statistic = {
        countWaiting: '',
        countInProgress: '',
        countCancel: '',
        countReject: '',
        countComplete: '',
        total: ''
    };
    logs!: any;
    pets!: any;
    adopts!: any;
    petId!: any;
    detailAdopt!: any;
    detailAdoptData!: any;
    visibleDetailAdopt: boolean = false;
    visibleUpdateInfo: boolean = false;
    visiblePetCareLog: boolean = false;
    adoptStatus: any;

    constructor(public adoptService: AdoptService, public petService: PetService, 
        private userService: UserService, private authService: AuthService, private petCareLogService: PetCareLogService,
        private messageService: MessageService, private confirmationService: ConfirmationService) { }

    private subscribes$: Subject<void> = new Subject<void>();

    ngOnInit(): void {
        this.getUser();
        this.getAdoptStatistic();
        this.adoptStatus = ADOPT.STATUS_KEY;
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getUser(): void {
        this.userService.getUserById(this.authService.getCurrentUser().id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.user = res.data;
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

    getAdoptStatistic(): void {
        this.adoptService.getAdoptStatistic({ 
            user: this.authService.getCurrentUser().id 
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.statistic.countWaiting = res.data.countWaiting;
                    this.statistic.countInProgress = res.data.countInProgress;
                    this.statistic.countCancel = res.data.countCancel;
                    this.statistic.countReject = res.data.countReject;
                    this.statistic.countComplete = res.data.countComplete;
                    this.statistic.total = res.data.total;
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

    getAdopts(): void {
        this.adoptService.getAdoptsByUser()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.adopts = res.data;
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

    getAdopt(adoptId: string): void {
        this.adoptService.getAdoptById(adoptId)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.detailAdoptData = res.data;
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

    getPets(): void {
        this.petService.getPets({
            status: PET.STATUS_KEY.ADOPTED,
            adoptedBy: this.authService.getCurrentUser().id,
            fullData: true
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.pets = res.data.pets;
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

    onChangeTabView(event: any): void {
        let indexTab = event.index;
        if (indexTab === 0) {
            // this.getUser();
            // this.getAdoptStatistic();
        } else if (indexTab === 1) {
            if (!this.adopts) {
                this.getAdopts();
            }
        } else if (indexTab === 2) {
            if (!this.pets) {
                this.getPets();
            }
        }
    }

    onShowPetCareLog(petId: any): void {
        this.petCareLogService.getLogs({
            petId: petId
        }).pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res) => {
                if (res.success) {
                    this.logs = res.data;
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
        this.visiblePetCareLog = true;
    }

    onShowDetailAdopt(adoptId: string, petId: string): void {
        this.detailAdopt = adoptId;
        this.petId = petId;
        this.visibleDetailAdopt = true;
        this.getAdopt(adoptId);
    }

    onShowUpdateInfo(infoKey: string, title: string): void {
        this.info.key = infoKey;
        this.info.userId = this.user.id;
        this.info.title = title;
        this.info.userInfo = this.user[infoKey] ? this.user[infoKey] : '';
        this.visibleUpdateInfo = true;
    }

    onHideDetailAdopt(): void {
        this.visibleDetailAdopt = false;
        this.detailAdopt = null;
        this.detailAdoptData = null;
        this.petId = null;
    }

    onConfirmCancel(event: any, adoptId: any): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn hủy đơn nhận nuôi này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.adoptService.cancelAdopt(adoptId)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getAdopts();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.cancelSuccess });
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
            },
            reject: () => {
            }
        });
    }

    onReceiveResult(result: boolean): void {
        if (result) {
            this.getUser();
            this.visibleUpdateInfo = false;
            this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateSuccess });
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    onHidePetCareLog(): void {
        this.logs = null;
    }

}
