import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {Table, TableModule} from 'primeng/table';
import {Subject, takeUntil} from 'rxjs';
import {CONFIG} from 'src/app/common/config';
import {message, messageUser, title} from 'src/app/common/message';
import {UserService} from 'src/app/services/user.service';
import {SharedModule} from 'src/app/shared/shared.module';
import {filteredSearch} from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [SharedModule, TableModule, DropdownModule],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

    @ViewChild("table") table!: Table;
    users: any[] = [];
    key = {
        name: '',
        phoneNumber: '',
        email: '',
        isActivated: ''
    }

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.getUsers();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getUsers(): void {
        let search = {
            fullData: true,
            role: CONFIG.ROLE.USER,
            name: this.key.name.trim(),
            phoneNumber: this.key.phoneNumber.trim(),
            email: this.key.email.trim(),
            isActivated: this.key.isActivated != null ? this.key.isActivated : ''
        }
        this.userService.getUsers(filteredSearch(search))
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.table.reset();
                        this.users = res.data.users;
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

    onRefresh(): void {
        this.key = {
            name: '',
            phoneNumber: '',
            email: '',
            isActivated: ''
        }
        this.getUsers();
    }

    getIconStatus(isActivated: boolean): string {
        return isActivated ? 'fa fa-lock-open' : 'fa fa-lock';
    }

    onConfirmUpdateStatus(event: any, user: any): void {
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
                }, 'status')
                    .pipe(takeUntil(this.subscribes$))
                    .subscribe({
                        next: (res) => {
                            if (res.success) {
                                this.getUsers();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: title.success,
                                    detail: messageUser.updateSuccess
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
