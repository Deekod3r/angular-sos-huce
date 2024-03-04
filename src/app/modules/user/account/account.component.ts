import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TabView, TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { Subject, takeUntil } from 'rxjs';
import { petStatusKey } from 'src/app/common/constant';
import { title, message, messageAdopt } from 'src/app/common/message';
import { responseCodeCommon, responseCodeAuth } from 'src/app/common/response';
import { AdoptService } from 'src/app/services/adopt.service';
import { AuthService } from 'src/app/services/auth.service';
import { PetService } from 'src/app/services/pet.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [SharedModule, TabViewModule, TableModule, TagModule, DialogModule, BadgeModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  @ViewChild("tabView") tabView!: TabView;

  user: any;
  pets: any[] = [];
  adopts: any[] = [];
  detailAdopt: any;
  detailAdoptData: any;
  visibleDetailAdopt: boolean = false;

  constructor(public adoptService: AdoptService, public petService: PetService, 
    private userService: UserService, private authService: AuthService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  private subscribes$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.getUser();
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
        this.user.countRefund = response.data.statistic.countRefund;
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
}
