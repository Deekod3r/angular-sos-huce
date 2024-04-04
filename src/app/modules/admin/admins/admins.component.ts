import { Component, OnDestroy, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { UserService } from 'src/app/services/user.service';
import { AdminsModule } from './admins.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { message, messageUser, title } from 'src/app/common/message';
import { ACTION } from 'src/app/common/constant';
import { MessageService } from 'primeng/api';
import { filteredSearch } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-admins',
    standalone: true,
    imports: [AdminsModule, TableModule, DropdownModule, ConfirmDialogModule],
    templateUrl: './admins.component.html',
    styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit, OnDestroy {
    
    admins: any[] = [];
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    idAdminUpdate: string = '';
    key = {
        name: '',
        phoneNumber: '',
        email: '',
        isActivated: ''
    }

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public userService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getUsers();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getUsers(): void {
        let search = {
            role: CONFIG.ROLE.ADMIN,
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
                    this.admins = res.data.users;
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

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idAdminUpdate = id;
        this.visibleUpdateModal = true;
    }

    onReceiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === ACTION.CREATE) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.crateAccountAdminSuccess });
            } else if (type === ACTION.UPDATE) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateAccountAdminSuccess });
            }
            this.getUsers();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

}
