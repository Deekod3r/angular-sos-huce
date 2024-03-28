import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PetService } from 'src/app/services/pet.service';
import { TagModule } from 'primeng/tag';
import { petConfig, typeAction } from 'src/app/common/constant';
import { MenuItem } from 'primeng/api/menuitem';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PetModule } from './pet.module';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { message, messagePet, title } from 'src/app/common/message';

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
    totalRecords = 0;
    limit = petConfig.search.limitDefault;
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
        color: '',
        breed: '',
        diet: '',
        vaccine: '',
        sterilization: '',
        rabies: '',
        adoptedBy: ''
    };

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.first = (this.currentPage - 1) * this.limit;
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
            color: this.key.color ? this.key.color.trim() : '',
            breed: this.key.breed ? this.key.breed.trim() : '',
            diet: this.key.diet ? this.key.diet : '',
            vaccine: this.key.vaccine ? this.key.vaccine : '',
            sterilization: this.key.sterilization ? this.key.sterilization : '',
            rabies: this.key.rabies ? this.key.rabies : '',
            adoptedBy: this.key.adoptedBy ? this.key.adoptedBy : ''
        }
        this.petService.getPets(search)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                let data = res.data;
                this.currentPage = data.page;
                this.first = (this.currentPage - 1) * this.limit;
                this.totalPages = data.totalPages;
                this.totalRecords = data.total;
                this.pets = data.pets;
                this.pets.forEach(pet => {
                    pet.menuItems = this.getMenuItems(pet);
                })
            }
        });
    }

    getMenuItems(pet: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: pet.status === petConfig.statusKey.adopted || pet.status === petConfig.statusKey.dead ? 'Xem chi tiết' : 'Chỉnh sửa',
                icon: pet.status === petConfig.statusKey.adopted || pet.status === petConfig.statusKey.dead ? 'fa fa-photo' : 'fa fa-edit',
                command: () => {
                    this.showUpdateModal(pet.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.confirmDelete(event, pet);
                }
            },
        ];
    }

    showCreateModal(): void {
        this.visibleCreateModal = true;
    }

    showUpdateModal(id: string): void {
        this.idPetUpdate = id;
        this.visibleUpdateModal = true;
    }

    receiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === typeAction.create) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messagePet.createSuccess });
            } else if (type === typeAction.update) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messagePet.updateSuccess });
            }
            this.getPets();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    refresh(): void {
        this.currentPage = 1;
        this.limit = petConfig.search.limitDefault;
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
            color: '',
            breed: '',
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

    search(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getPets();
    }

    confirmDelete(event: any, pet: any): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá thú cưng này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.petService.deleteSoftPet(pet.id).pipe(takeUntil(this.subscribes$)).subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getPets();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messagePet.deleteSuccess });
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
