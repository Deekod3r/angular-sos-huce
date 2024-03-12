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
import { adoptSearch, adoptStatusKey, petStatusKey, typeAction } from 'src/app/common/constant';
import { convertDateTimeFormat } from 'src/app/shared/utils/data.util';
import { title, message, messageAdopt } from 'src/app/common/message';
import { CONFIG } from 'src/app/common/config';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-adoption',
  standalone: true,
  imports: [TableModule, TagModule, TieredMenuModule, PaginatorModule, ConfirmDialogModule, AdoptionModule, PaginatorModule, InputTextareaModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css']
})
export class AdoptionComponent implements OnInit {

  adopts: any[] = [];
  users: any[] = [];
  pets: any[] = [];
  dataReject = {
    id: '',
    message: '',
    status: adoptStatusKey.reject,
    event: Event,
  };
  idAdoptionUpdate!: string;
  visibleCreateModal: boolean = false;
  visibleUpdateModal: boolean = false;
  visibleDeleteModal: boolean = false;
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;
  limit = adoptSearch.limitDefault;
  first!: number;
  key = {
    limit: this.limit,
    page: this.currentPage,
    status: null,
    code: '',
    fromDate: null,
    fromDateTime: null,
    toDate: null,
    toDateTime: null,
    registeredBy: '',
    petAdopt: ''
  }

  constructor(public adoptService: AdoptService, public petService: PetService, private userService: UserService, private authService: AuthService,
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  private subscribes$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.first = (this.currentPage - 1) * this.limit;
    this.getAdopts();
    this.getUsers();
    this.getPets();
  }

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  getAdopts() {
    this.key.limit = this.limit;
    this.key.page = this.currentPage;
    this.key.fromDate = this.key.fromDateTime ? convertDateTimeFormat(this.key.fromDateTime, true) : this.key.fromDateTime;
    this.key.toDate = this.key.toDateTime ? convertDateTimeFormat(this.key.toDateTime, false) : this.key.toDateTime;
    let search = {
      limit: this.limit,
      page: this.currentPage,
      status: this.key.status,
      code: this.key.code,
      fromDate: this.key.fromDate,
      toDate: this.key.toDate,
      registeredBy: this.key.registeredBy,
      petAdopt: this.key.petAdopt
    }
    this.adoptService.getAdopts(search)
    .pipe(takeUntil(this.subscribes$))
    .subscribe((res: any) => {
      if (res.success) {
        let data = res.data;
        this.currentPage = data.page;
        this.first = (this.currentPage - 1) * this.limit;
        this.totalPages = data.totalPages;
        this.totalRecords = data.total;
        this.adopts = data.adopts;
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
        label: 'Trạng thái',
        icon: 'fa fa-signal',
        visible: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress,
        items: [
          {
            label: 'Đã tiếp nhận',
            icon: 'fa fa-check',
            visible: adopt.status === adoptStatusKey.waiting,
            command: (event: any) => {
              this.updateStatusAdopt({ id: adopt.id , status: adoptStatusKey.inProgress }, adopt.id);
            }
          },
          {
            label: 'Từ chối',
            icon: 'fa fa-ban',
            visible: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress,
            command: (event: any) => {
              this.dataReject.id = adopt.id;
              this.dataReject.event = event;
              this.visibleDeleteModal = true;
            }
          },
          {
            label: 'Hủy',
            icon: 'fa fa-times',
            visible: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress,
            command: (event: any) => {
              this.confirmUpdateStatus(event, { id: adopt.id, status: adoptStatusKey.cancel, action: 'hủy', message: null });
            }
          },
          {
            label: 'Hoàn thành',
            icon: 'fa fa-check-circle',
            visible: adopt.status === adoptStatusKey.inProgress,
            command: (event: any) => {
              this.confirmUpdateStatus(event, { id: adopt.id, status: adoptStatusKey.complete, action: 'hoàn thành', message: null });
            }
          }
        ]
      },
      {
          separator: true,
          visible: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress
      },
      {
        label: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress ? 'Chỉnh sửa' : 'Xem chi tiết',
        icon: adopt.status === adoptStatusKey.waiting || adopt.status === adoptStatusKey.inProgress ? 'fa fa-edit' : 'fa fa-photo',
        command: () => {
          this.showUpdateModal(adopt.id);
        }
      },
      {
          separator: true,
          visible: adopt.status !== adoptStatusKey.complete
      },
      {
        label: 'Xoá',
        icon: 'fa fa-trash',
        visible: adopt.status !== adoptStatusKey.complete,
        command: (event: any) => {
          this.confirmDelete(event, adopt.id);
        }
      }
    ];
  }

  getUsers(): void {
    this.userService.getUsers({
      isActivated: true,
      role: CONFIG.ROLE.USER,
      roleRequest: this.authService.getRole()
    })
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res.success) {
        this.users = res.data.users;
      }
    });
  }

  getPets(): void {
    this.petService.getPets(
      {
        status: petStatusKey.waiting
      }
    )
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res.success) {
        this.pets = res.data.pets;
      }
    });
  }
  
  receiveResult(result: boolean, type: number): void {
    if (result) {
      if (type === typeAction.create) {
        this.visibleCreateModal = false;
        this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.createSuccess });
      } else if (type === typeAction.update) {
        this.visibleUpdateModal = false;
        this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.updateSuccess });
      }
      this.getAdopts();
    } else {
      this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
    }
  }
  
  showCreateModal() {
    this.visibleCreateModal = true;
  }

  showUpdateModal(id: string) {
    this.idAdoptionUpdate = id;
    this.visibleUpdateModal = true;
  }

  refresh(): void {
    this.currentPage = 1;
    this.limit = adoptSearch.limitDefault;
    this.first = 0;
    this.key = {
      limit: this.limit,
      page: this.currentPage,
      status: null,
      code: '',
      fromDate: null,
      fromDateTime: null,
      toDate: null,
      toDateTime: null,
      registeredBy: '',
      petAdopt: ''
    };
    this.getAdopts();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.limit = event.rows;
    this.first = event.first;
    this.getAdopts();
  }

  search(): void {
    this.currentPage = 1;
    this.first = 0;
    this.getAdopts();
  }
  
  updateStatusAdopt(form: any, id: string): void {
    this.adoptService.updateStatusAdopt(form, id)
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res.success) {
        this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.updateStatusSuccess });
        this.getAdopts();
      } else {
        this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
      }
    });
  }

  confirmUpdateStatus(event: any, data: any) {
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
        this.adoptService.updateStatusAdopt({id: data.id, status: data.status, message: data.message ? data.message : null }, data.id)
        .pipe(takeUntil(this.subscribes$)).subscribe({
          next: (res) => {
            if (res.success) {
              this.getAdopts();
              this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.updateStatusSuccess });
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
        this.messageService.add({ severity: 'error', summary: title.cancel, detail: messageAdopt.cancelUpdateStatus, life: 3000 });
      }
    });
  }

  rejectAdopt() {
    if (!this.dataReject.message) {
      this.messageService.add({ severity: 'error', summary: title.error, detail: messageAdopt.rejectReason, life: 3000 });
      return;
    }
    this.visibleDeleteModal = false; 
    this.confirmUpdateStatus(this.dataReject.event, { id: this.dataReject.id, status: adoptStatusKey.reject, action: 'từ chối', message: this.dataReject.message });
  }

  confirmDelete(event: any, id: string) {
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
        this.adoptService.deleteSoftAdopt(id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
          if (res.success) {
            this.getAdopts();
            this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.deleteSuccess });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: title.cancel, detail: message.cancelDelete, life: 3000 });
      }
    });
  }

}