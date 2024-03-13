import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PetService } from 'src/app/services/pet.service';
import { TagModule } from 'primeng/tag';
import { petSearch, petStatusKey, typeAction } from 'src/app/common/constant';
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
  providers: [ConfirmationService, MessageService],
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})

export class PetComponent implements OnInit {

  @ViewChild("table") table!: Table;

  pets: any[] = [];
  idPetUpdate!: string;
  visibleCreateModal: boolean = false;
  visibleUpdateModal: boolean = false;
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;
  limit = petSearch.limitDefault;
  first!: number;
  key = {
    limit: this.limit,
    page: this.currentPage,
    code: '',
    name: '',
    status: null,
    type: null,
    gender: null,
    age: null,
    color: '',
    breed: '',
    diet: null,
    vaccine: null,
    sterilization: null,
    rabies: null,
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
    this.petService.getPets(this.key)
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
        label: pet.status === petStatusKey.adopted || pet.status === petStatusKey.dead ? 'Xem chi tiết' : 'Chỉnh sửa',
        icon: pet.status === petStatusKey.adopted || pet.status === petStatusKey.dead ? 'fa fa-photo' : 'fa fa-edit',
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
    this.limit = petSearch.limitDefault;
    this.first = 0;
    this.key = {
      limit: this.limit,
      page: this.currentPage,
      code: '',
      name: '',
      status: null,
      type: null,
      gender: null,
      age: null,
      color: '',
      breed: '',
      diet: null,
      vaccine: null,
      sterilization: null,
      rabies: null,
      adoptedBy: ''
    };
    this.getPets();
  }

  onPageChange(event: any) {
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

  confirmDelete(event: any, pet: any) {
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
        this.messageService.add({ severity: 'error', summary: title.cancel, detail: message.cancelDelete, life: 3000 });
      }
    });
  }
}
