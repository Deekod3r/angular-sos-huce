import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PaginatorModule} from 'primeng/paginator';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {AdoptionModule} from './adoption.module';
import {Subject, takeUntil} from 'rxjs';
import {AdoptService} from 'src/app/services/adopt.service';
import {PetService} from 'src/app/services/pet.service';
import {ACTION, ADOPT, PET} from 'src/app/common/constant';
import {convertDateTimeFormat, filteredSearch} from 'src/app/shared/utils/data.util';
import {message, messageAdopt, title} from 'src/app/common/message';
import {CONFIG} from 'src/app/common/config';
import {UserService} from 'src/app/services/user.service';

@Component({
    selector: 'app-adoption',
    standalone: true,
    imports: [AdoptionModule, TableModule, TagModule, TieredMenuModule,
        PaginatorModule, ConfirmDialogModule, PaginatorModule],
    templateUrl: './adoption.component.html',
    styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit, OnDestroy {

    adopts: any[] = [];
    users: any[] = [];
    pets: any[] = [];
    dataReject = {
        id: '',
        message: '',
        event: Event,
    };
    dataComplete = {
        id: '',
        fee: null,
        event: Event,
    };
    idAdoptionUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    visibleRejectModal: boolean = false;
    visibleCompleteModal: boolean = false;
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = ADOPT.SEARCH.LIMIT_DEFAULT;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
        status: '',
        code: '',
        fromDate: '',
        fromDateTime: '',
        toDate: '',
        toDateTime: '',
        registeredBy: '',
        petAdopt: ''
    }
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public adoptService: AdoptService, public petService: PetService, private userService: UserService,
                private messageService: MessageService, private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.getAdopts();
        this.getUsers();
        this.getPets();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdopts(): void {
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        this.key.fromDate = this.key.fromDateTime ? convertDateTimeFormat(this.key.fromDateTime, true) : this.key.fromDateTime;
        this.key.toDate = this.key.toDateTime ? convertDateTimeFormat(this.key.toDateTime, false) : this.key.toDateTime;
        let search = {
            limit: this.limit,
            page: this.currentPage,
            status: this.key.status ? this.key.status : '',
            code: this.key.code ? this.key.code.trim() : '',
            fromDate: this.key.fromDate ? this.key.fromDate : '',
            toDate: this.key.toDate ? this.key.toDate : '',
            registeredBy: this.key.registeredBy ? this.key.registeredBy : '',
            petAdopt: this.key.petAdopt ? this.key.petAdopt : ''
        }
        this.adoptService.getAdopts(filteredSearch(search))
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        let data = res.data;
                        this.adopts = data.adopts;
                        this.currentPage = data.currentPage;
                        this.first = (this.currentPage - 1) * this.limit;
                        this.totalPages = data.totalPages;
                        this.totalElements = data.totalElements;
                        if (this.adopts.length == 0) {
                            this.messageService.add({severity: 'info', summary: title.info, detail: message.noData});
                        } else {
                            this.adopts.forEach(adopt => {
                                adopt.menuItems = this.getMenuItems(adopt);
                            })
                        }
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


    getMenuItems(adopt: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Trạng thái',
                icon: 'fa fa-signal',
                visible: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS,
                items: [
                    {
                        label: 'Đã tiếp nhận',
                        icon: 'fa fa-check',
                        visible: adopt.status === ADOPT.STATUS_KEY.WAITING,
                        command: (event: any) => {
                            this.onUpdateStatus({id: adopt.id, status: ADOPT.STATUS_KEY.IN_PROGRESS}, adopt.id);
                        }
                    },
                    {
                        label: 'Từ chối',
                        icon: 'fa fa-ban',
                        visible: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS,
                        command: (event: any) => {
                            this.dataReject.id = adopt.id;
                            this.dataReject.event = event;
                            this.visibleRejectModal = true;
                        }
                    },
                    {
                        label: 'Hủy',
                        icon: 'fa fa-times',
                        visible: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS,
                        command: (event: any) => {
                            this.onConfirmUpdate(event, {id: adopt.id, status: ADOPT.STATUS_KEY.CANCEL, action: 'hủy'});
                        }
                    },
                    {
                        label: 'Hoàn thành',
                        icon: 'fa fa-check-circle',
                        visible: adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS,
                        command: (event: any) => {
                            this.dataComplete.id = adopt.id;
                            this.dataComplete.event = event;
                            this.visibleCompleteModal = true;
                            //this.onConfirmUpdate(event, { id: adopt.id, status: ADOPT.STATUS_KEY.COMPLETE, action: 'hoàn thành' });
                        }
                    }
                ]
            },
            {
                separator: true,
                visible: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS
            },
            {
                label: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS ? 'Chỉnh sửa' : 'Xem chi tiết',
                icon: adopt.status === ADOPT.STATUS_KEY.WAITING || adopt.status === ADOPT.STATUS_KEY.IN_PROGRESS ? 'fa fa-edit' : 'fa fa-photo',
                command: () => {
                    this.onShowUpdateModal(adopt.id);
                }
            },
            {
                separator: true,
                visible: adopt.status !== ADOPT.STATUS_KEY.COMPLETE
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                visible: adopt.status !== ADOPT.STATUS_KEY.COMPLETE,
                command: (event: any) => {
                    this.onConfirmDelete(event, adopt.id);
                }
            }
        ];
    }

    getUsers(): void {
        this.userService.getUsers({
            fullData: true,
            isActivated: true,
            role: CONFIG.ROLE.USER
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.users = res.data.users;
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

    getPets(): void {
        this.petService.getPets({
            status: PET.STATUS_KEY.WAITING,
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
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: title.success,
                    detail: messageAdopt.createSuccess
                });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: title.success,
                    detail: messageAdopt.updateSuccess
                });
            }
            this.getAdopts();
        } else {
            this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
        }
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idAdoptionUpdate = id;
        this.visibleUpdateModal = true;
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.limit = ADOPT.SEARCH.LIMIT_DEFAULT;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            status: '',
            code: '',
            fromDate: '',
            fromDateTime: '',
            toDate: '',
            toDateTime: '',
            registeredBy: '',
            petAdopt: ''
        };
        this.getAdopts();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getAdopts();
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getAdopts();
    }

    onUpdateStatus(form: any, id: string): void {
        this.adoptService.updateStatusAdopt(form, id)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.messageService.add({
                            severity: 'success',
                            summary: title.success,
                            detail: messageAdopt.updateStatusSuccess
                        });
                        this.getAdopts();
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

    onConfirmUpdate(event: any, data: any): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn ' + data.action + ' đơn nhận nuôi này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.adoptService.updateStatusAdopt({
                    id: data.id,
                    status: data.status,
                    message: data.message ? data.message.trim() : '',
                    fee: data.fee != null && data.fee != '' ? data.fee : ''
                }, data.id)
                    .pipe(takeUntil(this.subscribes$)).subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.onSearch();
                            this.messageService.add({
                                severity: 'success',
                                summary: title.success,
                                detail: messageAdopt.updateStatusSuccess
                            });
                        }
                    },
                    error: (res) => {
                        if (res.error) {
                            this.messageService.add({
                                severity: 'error',
                                summary: title.error,
                                detail: res.error.message
                            });
                        } else {
                            this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                        }
                    }
                });
            },
            reject: () => {
            }
        });
    }

    onReject(): void {
        if (!this.dataReject.message) {
            this.messageService.add({severity: 'error', summary: title.error, detail: messageAdopt.rejectReason});
            return;
        }
        this.visibleRejectModal = false;
        this.onConfirmUpdate(this.dataReject.event, {
            id: this.dataReject.id,
            status: ADOPT.STATUS_KEY.REJECT,
            action: 'từ chối',
            message: this.dataReject.message.trim()
        });
    }

    onComplete(): void {
        if (this.dataComplete.fee == null || this.dataComplete.fee == '') {
            this.messageService.add({severity: 'error', summary: title.error, detail: messageAdopt.fee});
            return;
        }
        this.visibleCompleteModal = false;
        this.onConfirmUpdate(this.dataComplete.event, {
            id: this.dataComplete.id,
            status: ADOPT.STATUS_KEY.COMPLETE,
            action: 'hoàn thành',
            fee: this.dataComplete.fee
        });
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá đơn nhận nuôi này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.adoptService.deleteAdopt(id)
                    .pipe(takeUntil(this.subscribes$))
                    .subscribe({
                        next: (res) => {
                            if (res.success) {
                                this.getAdopts();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: title.success,
                                    detail: messageAdopt.deleteSuccess
                                });
                            }
                        },
                        error: (res) => {
                            if (res.error) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: res.error.message
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: message.error
                                });
                            }
                        }
                    });
            },
            reject: () => {
            }
        });
    }

}
