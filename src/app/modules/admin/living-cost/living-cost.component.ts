import { Component, OnDestroy, OnInit } from '@angular/core';
import { LivingCostModule } from './living-cost.module';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { ACTION, LIVING_COST } from 'src/app/common/constant';
import { title, message, messageLivingCost } from 'src/app/common/message';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LivingCostService } from 'src/app/services/living-cost.service';
import { convertDateFormat, filteredSearch } from 'src/app/shared/utils/data.util';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-living-cost',
    standalone: true,
    imports: [LivingCostModule, PaginatorModule, TieredMenuModule, TagModule],
    templateUrl: './living-cost.component.html',
    styleUrls: ['./living-cost.component.css']
})
export class LivingCostComponent implements OnInit, OnDestroy {

    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = LIVING_COST.SEARCH.LIMIT_DEFAULT;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
        fromDate: '',
        toDate: '',
        category: ''
    }
    livingCosts: any[] = [];
    idLivingCostUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private messageService: MessageService, public livingCostService: LivingCostService, 
        private confirmationService: ConfirmationService) {}

    ngOnInit(): void {
        this.getLivingCosts();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getLivingCosts(): void {
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            fromDate: this.key.fromDate ? convertDateFormat(this.key.fromDate) : '',
            toDate: this.key.toDate ? convertDateFormat(this.key.toDate) : '',
            category: this.key.category
        }
        this.livingCostService.getLivingCosts(filteredSearch(search))
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.livingCosts = res.data.livingCosts;
                    this.totalPages = res.data.totalPages;
                    this.totalElements = res.data.totalElements;
                    this.currentPage = res.data.currentPage;
                    this.first = (this.currentPage - 1) * this.limit;
                    if (this.livingCosts.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    } else {
                        this.livingCosts.forEach(livingCost => {
                            livingCost.menuItems = this.getMenuItems(livingCost);
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

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getLivingCosts();
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idLivingCostUpdate = id;
        this.visibleUpdateModal = true;
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageLivingCost.createSuccess });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageLivingCost.updateSuccess });
            }
            this.getLivingCosts();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    getMenuItems(livingCost: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(livingCost.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, livingCost.id);
                }
            },
        ];
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.limit = LIVING_COST.SEARCH.LIMIT_DEFAULT;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            fromDate: '',
            toDate: '',
            category: ''
        }
        this.getLivingCosts();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getLivingCosts();
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá chi phí sinh hoạt này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.livingCostService.deleteLivingCost(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.onSearch();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageLivingCost.deleteSuccess });
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
