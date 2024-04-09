import { Component, OnDestroy, OnInit } from '@angular/core';
import { DonationModule } from './donation.module';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DonationService } from 'src/app/services/donation.service';
import { DONATION, ACTION } from 'src/app/common/constant';
import { title, message, messageDonation } from 'src/app/common/message';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { convertDateFormat, filteredSearch } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-donation',
    standalone: true,
    imports: [DonationModule, TableModule, PaginatorModule, TieredMenuModule],
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit, OnDestroy {

    donates!: any;
    idDonationUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = DONATION.SEARCH.LIMIT_DEFAULT;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
        remitter: '',
        payee: '',
        fromDate: '',
        toDate: '',
    }

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public donationService: DonationService, private messageService: MessageService, 
        private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getDonations();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getDonations(): void {
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            remitter: this.key.remitter ? this.key.remitter.trim() : '',
            payee: this.key.payee ? this.key.payee.trim() : '',
            fromDate: this.key.fromDate ? convertDateFormat(this.key.fromDate) : '',
            toDate: this.key.toDate ? convertDateFormat(this.key.toDate) : ''
        }
        this.donationService.getDonations(filteredSearch(search))
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.donates = res.data.donates;
                    this.totalPages = res.data.totalPages;
                    this.totalElements = res.data.totalElements;
                    this.currentPage = res.data.currentPage;
                    this.first = (this.currentPage - 1) * this.limit;
                    if (this.donates.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    } else {
                        this.donates.forEach((item: any) => {
                            item.menuItems = this.getMenuItems(item);
                        });
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

    getMenuItems(donate: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(donate.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, donate.id);
                }
            },
        ];
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getDonations();
    }

    onRefresh(): void {
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            remitter: '',
            payee: '',
            fromDate: '',
            toDate: '',
        }
        this.getDonations();
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idDonationUpdate = id;
        this.visibleUpdateModal = true;
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageDonation.createSuccess });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageDonation.updateSuccess });
            }
            this.getDonations();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getDonations();
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá thông tin ủng hộ này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.donationService.deleteDonation(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getDonations();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageDonation.deleteSuccess });
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
