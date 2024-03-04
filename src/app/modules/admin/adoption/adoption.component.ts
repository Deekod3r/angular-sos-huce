import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AdoptionModule } from './adoption.module';
import { Subject, takeUntil } from 'rxjs';
import { AdoptService } from 'src/app/services/adopt.service';
import { PetService } from 'src/app/services/pet.service';

@Component({
  selector: 'app-adoption',
  standalone: true,
  imports: [TableModule, TagModule, TieredMenuModule, PaginatorModule, ConfirmDialogModule, AdoptionModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {

  adopts: any[] = [];

  constructor(public adoptService: AdoptService, public petService: PetService) { }

  private subscribes$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.getAdopts();
  }

  getAdopts() {
    this.adoptService.getAdopts()
    .pipe(takeUntil(this.subscribes$))
    .subscribe((response: any) => {
      if (response.success) {
        this.adopts = response.data;
        this.adopts.forEach(adopt => {
          adopt.menuItems = this.getMenuItems(adopt);
        })
      }
    });
  }


  getMenuItems(adopt: any): MenuItem[] {
    return [
      {
        visible: false
      },
      {
        label: 'Chỉnh sửa',
        icon: 'fa fa-edit',
        command: () => {
          //this.showUpdateModal(pet.id);
        }
      },
      {
        label: 'Xoá',
        icon: 'fa fa-trash',
        command: (event: any) => {
          //this.confirmDelete(event, pet);
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
}
