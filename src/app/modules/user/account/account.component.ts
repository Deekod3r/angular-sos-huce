import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabView, TabViewModule } from 'primeng/tabview';
import { Subject, takeUntil } from 'rxjs';
import { adoptStatusKey, petStatusKey } from 'src/app/common/constant';
import { title, message, messageAdopt, messageUser } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { AuthService } from 'src/app/services/auth.service';
import { PetService } from 'src/app/services/pet.service';
import { UserService } from 'src/app/services/user.service';
import { AccountModule } from './account.module';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountModule, TabViewModule, TableModule, TagModule, DialogModule, BadgeModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @ViewChild("tabView") tabView!: TabView;

  user: any;
  info = {
    key: '',
    title: '',
    userId: '',
    userInfo: ''
  }
  pets: any[] = [];
  adopts: any[] = [];
  detailAdopt: any;
  detailAdoptData: any;
  visibleDetailAdopt: boolean = false;
  visibleUpdateInfo: boolean = false;
  adoptStatus: any;

  constructor(public adoptService: AdoptService, public petService: PetService, 
    private userService: UserService, private authService: AuthService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  private subscribes$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.getUser();
    this.adoptStatus = adoptStatusKey;
  }

  getUser() {
    this.userService.getUserById(this.authService.getInfoUser().id)
    .pipe(takeUntil(this.subscribes$))
    .subscribe((response: any) => {
      if (response.success) {
        this.user = response.data.user;
        this.user.countWaiting = response.data.statistic.countWaiting;
        this.user.countInProgress = response.data.statistic.countInProgress;
        this.user.countCancel = response.data.statistic.countCancel;
        this.user.countReject = response.data.statistic.countReject;
        this.user.countComplete = response.data.statistic.countComplete;
        this.user.total = response.data.statistic.total;
      }
    });
  }

  getAdopts() {
    this.adoptService.getAdoptsByUser()
    .pipe(takeUntil(this.subscribes$))
    .subscribe((response: any) => {
      if (response.success) {
        this.adopts = response.data;
      }
    });
  }

  getAdopt(adoptId: string) {
    this.adoptService.getAdoptById(adoptId)
    .pipe(takeUntil(this.subscribes$))
    .subscribe((response: any) => {
      if (response.success) {
        this.detailAdoptData = response.data;
      }
    });
  }

  getPets() {
    this.petService.getPets(
      {
        status: petStatusKey.adopted,
        adoptedBy: this.authService.getInfoUser().id
      }
    )
    .pipe(takeUntil(this.subscribes$))
    .subscribe((response: any) => {
      if (response.success) {
        this.pets = response.data.pets;
        console.log(this.pets)
      }
    });
  }

  changeTabView(event: any) {
    let indexTab = event.index;
    if (indexTab === 0) {
      this.getUser();
    } else if (indexTab === 1) {
      this.getAdopts();
    } else if (indexTab === 2) {
      this.getPets();
    }
  }

  showDetailAdopt(adoptId: any) {
    this.detailAdopt = adoptId;
    this.visibleDetailAdopt = true;
    this.getAdopt(adoptId);
  }

  showUpdateInfo(infoKey: string, title: string) {
    this.info.key = infoKey;
    this.info.userId = this.user.id;
    this.info.title = title;
    this.info.userInfo = this.user[infoKey] ? this.user[infoKey] : '';
    this.visibleUpdateInfo = true;
  }

  hideDetailAdopt() {
    this.visibleDetailAdopt = false;
    this.detailAdopt = null;
    this.detailAdoptData = null;
  }

  confirmCancel(event: any, adoptId: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn chắc chắn muốn hủy đơn nhận nuôi này chứ?',
      header: 'XÁC NHẬN',
      icon: 'fa fa-solid fa-triangle-exclamation',
      acceptLabel: 'Có',
      rejectLabel: 'Hủy',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.adoptService.cancelAdopt(adoptId).pipe(takeUntil(this.subscribes$)).subscribe({
          next: (res) => {
            if (res.success) {
              this.getAdopts();
              this.messageService.add({ severity: 'success', summary: title.success, detail: messageAdopt.cancelSuccess });
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
        this.messageService.add({ severity: 'error', summary: title.cancel, detail: messageAdopt.canelCancel, life: 3000 });
      }
    });
  }

  receiveResult(result: boolean) {
    if (result) {
      this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateSuccess });
      this.visibleUpdateInfo = false;
      this.getUser();
    } else {
      this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
    }
  }
}
