import { Component, OnDestroy, OnInit } from '@angular/core';
import { PetCareLogModule } from './pet-care-log.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PetCareLogService } from 'src/app/services/pet-care-log.service';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { convertDateFormat, filteredSearch } from 'src/app/shared/utils/data.util';
import { AdoptService } from 'src/app/services/adopt.service';
import { ADOPT, ACTION } from 'src/app/common/constant';
import { title, message, messageLog } from 'src/app/common/message';

@Component({
    selector: 'app-pet-care-log',
    standalone: true,
    imports: [PetCareLogModule, ConfirmDialogModule, TableModule, TieredMenuModule],
    templateUrl: './pet-care-log.component.html',
    styleUrls: ['./pet-care-log.component.css']
})
export class PetCareLogComponent implements OnInit, OnDestroy {

    logs: any[] = [];
    adopts: any[] = [];
    key = {
        adoptId: '',
        fromDate: '',
        toDate: ''
    }
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    idLogUpdate!: string;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private petCateLogService: PetCareLogService, private adoptService: AdoptService, 
        private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getLogs();
        this.getAdopts();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getLogs(): void {
        let search = {
            adoptId: this.key.adoptId,
            fromDate: this.key.fromDate ? convertDateFormat(this.key.fromDate) : '',
            toDate: this.key.toDate ? convertDateFormat(this.key.toDate) : ''
        }
        this.petCateLogService.getLogs(filteredSearch(search))
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.logs = res.data;
                    if(this.logs.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    } else {
                        this.logs.forEach(log => {
                            log.menuItems = this.getMenuItems(log);
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

    getAdopts(): void {
        this.adoptService.getAdopts({ status: ADOPT.STATUS_KEY.COMPLETE })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.adopts = res.data.adopts;
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
            adoptId: '',
            fromDate: '',
            toDate: ''
        }
        this.getLogs();
    }

    getMenuItems(log: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(log.id);
                }
            },
            {
                    separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, log.id);
                }
            },
        ];
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageLog.createSuccess });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageLog.updateSuccess });
            }
            this.getLogs();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idLogUpdate = id;
        this.visibleUpdateModal = true;
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá lịch sử này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.petCateLogService.deleteLog(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getLogs();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageLog.deleteSuccess });
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

}
