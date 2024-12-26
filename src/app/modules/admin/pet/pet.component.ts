import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {PetService} from 'src/app/services/pet.service';
import {TagModule} from 'primeng/tag';
import {ACTION, PET} from 'src/app/common/constant';
import {MenuItem} from 'primeng/api/menuitem';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PetModule} from './pet.module';
import {Subject, takeUntil} from 'rxjs';
import {PaginatorModule} from 'primeng/paginator';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {message, messagePet, title} from 'src/app/common/message';
import {convertDateFormat, filteredSearch} from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-pet',
    standalone: true,
    imports: [PetModule, TableModule, TagModule, TieredMenuModule, PaginatorModule, ConfirmDialogModule],
    templateUrl: './pet.component.html',
    styleUrls: ['./pet.component.css']
})

export class PetComponent implements OnInit, OnDestroy {

    @ViewChild("table") table!: Table;

    pets: any[] = [];
    idPetUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = PET.SEARCH.LIMIT_DEFAULT;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
        code: '',
        name: '',
        status: '',
        type: '',
        gender: '',
        age: '',
        intakeDateFrom: '',
        intakeDateTo: '',
        diet: '',
        vaccine: '',
        sterilization: '',
        rabies: '',
        adoptedBy: ''
    };

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.getPets();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getPets(): void {
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            code: this.key.code ? this.key.code.trim() : '',
            name: this.key.name ? this.key.name.trim() : '',
            status: this.key.status ? this.key.status : '',
            type: this.key.type ? this.key.type : '',
            gender: this.key.gender ? this.key.gender : '',
            age: this.key.age ? this.key.age : '',
            intakeDateFrom: this.key.intakeDateFrom ? convertDateFormat(this.key.intakeDateFrom) : '',
            intakeDateTo: this.key.intakeDateTo ? convertDateFormat(this.key.intakeDateTo) : '',
            diet: this.key.diet ? this.key.diet : '',
            vaccine: this.key.vaccine ? this.key.vaccine : '',
            sterilization: this.key.sterilization ? this.key.sterilization : '',
            rabies: this.key.rabies ? this.key.rabies : '',
            adoptedBy: this.key.adoptedBy ? this.key.adoptedBy : ''
        }
        this.petService.getPets(filteredSearch(search))
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        let data = res.data;
                        this.currentPage = data.currentPage;
                        this.first = (this.currentPage - 1) * this.limit;
                        this.totalPages = data.totalPages;
                        this.totalElements = data.totalElements;
                        this.pets = data.pets;
                        if (this.pets.length == 0) {
                            this.messageService.add({severity: 'info', summary: title.info, detail: message.noData});
                        } else {
                            this.pets.forEach(pet => {
                                pet.menuItems = this.getMenuItems(pet);
                            });
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

    getMenuItems(pet: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: pet.status === PET.STATUS_KEY.ADOPTED || pet.status === PET.STATUS_KEY.DEAD ? 'Xem chi tiết' : 'Chỉnh sửa',
                icon: pet.status === PET.STATUS_KEY.ADOPTED || pet.status === PET.STATUS_KEY.DEAD ? 'fa fa-photo' : 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(pet.id);
                }
            },
            {
                separator: true,
                visible: pet.status !== PET.STATUS_KEY.ADOPTED
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                visible: pet.status !== PET.STATUS_KEY.ADOPTED,
                command: (event: any) => {
                    this.onConfirmDelete(event, pet);
                }
            },
        ];
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idPetUpdate = id;
        this.visibleUpdateModal = true;
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: title.success,
                    detail: messagePet.createSuccess
                });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({
                    severity: 'success',
                    summary: title.success,
                    detail: messagePet.updateSuccess
                });
            }
            this.getPets();
        } else {
            this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
        }
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.limit = PET.SEARCH.LIMIT_DEFAULT;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            code: '',
            name: '',
            status: '',
            type: '',
            gender: '',
            age: '',
            intakeDateFrom: '',
            intakeDateTo: '',
            diet: '',
            vaccine: '',
            sterilization: '',
            rabies: '',
            adoptedBy: ''
        };
        this.getPets();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getPets();
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getPets();
    }

    onConfirmDelete(event: any, pet: any): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Khi xóa thú cưng, tất cả thông tin chi phí sinh hoạt, khám chữa bệnh và đơn nhận nuôi liên quan cũng sẽ bị xóa. <br/> Bạn chắc chắn muốn xoá thú cưng này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.petService.deletePet(pet.id)
                    .pipe(takeUntil(this.subscribes$))
                    .subscribe({
                        next: (res) => {
                            if (res.success) {
                                this.onSearch();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: title.success,
                                    detail: messagePet.deleteSuccess
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
