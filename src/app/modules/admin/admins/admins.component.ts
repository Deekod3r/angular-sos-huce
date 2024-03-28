import { Component, OnDestroy, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { UserService } from 'src/app/services/user.service';
import { AdminsModule } from './admins.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { message, messageUser, title } from 'src/app/common/message';
import { typeAction } from 'src/app/common/constant';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-admins',
    standalone: true,
    imports: [AdminsModule, TableModule, DropdownModule, ConfirmDialogModule],
    templateUrl: './admins.component.html',
    styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit, OnDestroy {
    
    admins: any[] = [];
    adminCount: number = 0;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    idAdminUpdate: string = '';
    search = {
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
        this.userService.getUsers({
            role: CONFIG.ROLE.ADMIN,
            name: this.search.name.trim(),
            phoneNumber: this.search.phoneNumber.trim(),
            email: this.search.email.trim(),
            isActivated: this.search.isActivated != null ? this.search.isActivated : ''
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.admins = res.data.users;
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

    showCreateModal(): void {
        this.visibleCreateModal = true;
    }

    showUpdateModal(id: string): void {
        this.idAdminUpdate = id;
        this.visibleUpdateModal = true;
    }

    receiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === typeAction.create) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.crateAccountAdminSuccess });
            } else if (type === typeAction.update) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateAccountAdminSuccess });
            }
            this.getUsers();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }

    incrementAdminCount(): void {
        this.adminCount++;
    }

}
