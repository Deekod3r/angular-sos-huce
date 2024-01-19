import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableModule } from 'primeng/table';
import { PetService } from 'src/app/services/pet.service';
import { TagModule } from 'primeng/tag';
import { petStatus } from 'src/app/common/constant';
import { MenuItem } from 'primeng/api/menuitem';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { PetCreateComponent } from './pet-create/pet-create.component';

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [SharedModule, TableModule, TagModule, ConfirmPopupModule, TieredMenuModule, DialogModule, PetCreateComponent],
  providers: [ConfirmationService, MessageService],
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements OnInit{

  pets: any[] = [];
  visibleCreateModal: boolean = false;
  visibleUpdateModal: boolean = false;

  constructor(private petSerivce: PetService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getPets();
  }

  getPets(): void {
    this.petSerivce.getPets().subscribe(pets => {
      this.pets = pets
      this.pets.forEach(pet => {
        pet.menuItems = this.getMenuItems(pet);
      })
    });
  }

  getSeverityStatus(status: number): string {
    switch (status) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'primary';
      default:
        return 'primary';
    }
  }

  getStatus(status: keyof typeof petStatus): string | undefined {
    return petStatus[status];
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

}
