import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { message, messageUser, title } from 'src/app/common/message';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [SharedModule, TableModule, DropdownModule, ConfirmDialogModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

    users: any[] = [];
    userCount: number = 0;
    search = {
        name: '',
        phoneNumber: '',
        email: '',
        isActivated: ''
    }

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getUsers();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getUsers(): void {
        this.userService.getUsers({
            role: CONFIG.ROLE.USER,
            name: this.search.name.trim(),
            phoneNumber: this.search.phoneNumber.trim(),
            email: this.search.email.trim(),
            isActivated: this.search.isActivated != null ? this.search.isActivated : ''
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.users = res.data.users;
            }
        });
    }

    refresh(): void {
        this.search = {
            name: '',
            phoneNumber: '',
            email: '',
            isActivated: ''
        }
        this.getUsers();
    }

    iconStatus(isActivated: boolean): string {
        return isActivated ? 'fa fa-lock-open' : 'fa fa-lock';
    }

    incrementUserCount(): void {
        this.userCount++;
    }

    confirmUpdateStatus(event: any, user: any): void {
        let object = '';
        if (user.isActivated) {
            object = 'khóa tài khoản';
        } else {
            object = 'mở khóa tài khoản';
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn ' + object + ' người dùng này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.userService.updateUser(user.id, {
                    id: user.id,
                    status: !user.isActivated,
                    role: user.role
                }, 'status').pipe(takeUntil(this.subscribes$)).subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getUsers();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateSuccess });
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
