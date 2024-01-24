import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PetService } from 'src/app/services/pet.service';
import { TagModule } from 'primeng/tag';
import { petSearch, typeAction } from 'src/app/common/constant';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PetModule } from './pet.module';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';

interface petSearchKey {
  limit: number,
  page: number,
  code: string,
  name: string,
  status: number | null,
  type: number | null,
  gender: number | null,
  age: number | null,
  color: string,
  breed: string
}

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [TableModule, TagModule, ConfirmPopupModule, TieredMenuModule, PetModule, PaginatorModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})

export class PetComponent implements OnInit {

  @ViewChild("table") table!: Table;

  pets: any[] = [];
  visibleCreateModal: boolean = false;
  visibleUpdateModal: boolean = false;
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;
  limit = petSearch.limitDefault;
  first!: number;
  key: petSearchKey = {
    limit: this.limit,
    page: this.currentPage,
    code: '',
    name: '',
    status: null,
    type: null,
    gender: null,
    age: null,
    color: '',
    breed: ''
  };

  
  private subscribes$: Subject<void> = new Subject<void>();

  constructor(public petService: PetService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.first =  (this.currentPage - 1)* this.limit;
    this.getPets();
  }

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  getPets(): void {
    this.key.limit = this.limit;
    this.key.page = this.currentPage;
    this.petService.getPets(this.key).pipe(takeUntil(this.subscribes$)).subscribe(data => {
      this.currentPage = data.page;
      this.first =  (this.currentPage - 1)* this.limit;
      this.totalPages = data.totalPages;
      this.totalRecords = data.total;
      this.pets = data.pets;
      this.pets.forEach(pet => {
        pet.menuItems = this.getMenuItems(pet);
      })
    });
  }


  getMenuItems(pet: any): MenuItem[] {
    return [
      {
        visible: false
      },
      {
        label: 'Chỉnh sửa',
        icon: 'fa fa-edit',
        command: () => {
          this.showUpdateModal();
        }
      },
      {
        label: 'Xoá',
        icon: 'fa fa-trash',
        command: () => {
        }
      },
      {
        label: 'Xem chi tiết',
        icon: 'fa fa-photo',
        command: () => {
          //this.view(provider);
        }
      }
    ];
  }

  showCreateModal(): void {
    this.visibleCreateModal = true;
  }

  showUpdateModal(): void {
    this.visibleUpdateModal = true;
  }

  receiveResult(result: boolean, type: number): void {
    if (result) {
      if (type === typeAction.create) {
        this.visibleCreateModal = false;
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Tạo mới thành công!' });
      } else if (type === typeAction.update) {
        this.visibleUpdateModal = false;
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thành công!' });
      }
      this.getPets();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Vui lòng thử lại sau' });
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
      breed: ''
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
}
