import { Component, OnDestroy, OnInit } from '@angular/core';
import { TreatmentModule } from './treatment.module';
import { TreatmentService } from 'src/app/services/treatment.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { PetService } from 'src/app/services/pet.service';
import { title, message, messageTreatment } from 'src/app/common/message';
import { ACTION, PET, TREATMENT } from 'src/app/common/constant';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { filteredSearch } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-treatment',
    standalone: true,
    imports: [TreatmentModule, TieredMenuModule, TagModule, PaginatorModule],
    templateUrl: './treatment.component.html',
    styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit, OnDestroy {

    daysOfTreatmentOptions = [
        {
            label: 'Dưới 1 tuần',
            value: 7
        },
        {
            label: 'Dưới 2 tuần',
            value: 14
        },
        {
            label: 'Dưới 1 tháng',
            value: 30
        }
    ]
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = TREATMENT.SEARCH.LIMIT_DEFAULT;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
        petId: '',
        type: '',
        daysOfTreatment: '',
    }
    pets: any[] = [];
    petsModified: any[] = [];
    treatments: any[] = [];
    idTreatmentUpdate: any;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public treatmentService: TreatmentService, private petService: PetService, 
        private messageService: MessageService, private confirmationService: ConfirmationService) { }
    
    ngOnInit(): void {
        this.getTreatments();
        this.getPets();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getPets():void {
        this.petService.getPets({
            fullData: true
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.pets = res.data.pets;
                    this.petsModified = this.pets.map(pet => {
                        return {
                            label: pet.code + ' - ' + pet.name,
                            value: pet.id,
                            status: pet.status
                        }
                    }).filter(pet => pet.status !== PET.STATUS_KEY.DEAD && pet.status !== PET.STATUS_KEY.ADOPTED);
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

    getTreatments():void {
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            petId: this.key.petId,
            type: this.key.type,
            daysOfTreatment: this.key.daysOfTreatment,
        }
        this.treatmentService.getTreatments(filteredSearch(search))
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.treatments = res.data.treatments;
                    this.totalPages = res.data.totalPages;
                    this.totalElements = res.data.totalElements;
                    this.currentPage = res.data.currentPage;
                    this.first = (this.currentPage - 1) * this.limit;
                    if (this.treatments.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    } else {
                        this.treatments.forEach(treatment => {
                            treatment.menuItems = this.getMenuItems(treatment);
                        })
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

    getMenuItems(treatment: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(treatment.id);
                }
            },
            {
                    separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, treatment.id);
                }
            },
        ];
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: any): void {
        this.idTreatmentUpdate = id;
        this.visibleUpdateModal = true;
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            petId: '',
            type: '',
            daysOfTreatment: '',
        }
        this.getTreatments();
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getTreatments();
    
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getTreatments();
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageTreatment.createSuccess, life: 5000 });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageTreatment.updateSuccess, life: 5000 });
            }
            this.getTreatments();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá thông tin điều trị này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.treatmentService.deleteTreatment(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.onSearch();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageTreatment.deleteSuccess, life: 5000 });
                        } else {
                            this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
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
            reject: () => {}
        });
    }

}
