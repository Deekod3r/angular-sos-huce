import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { Subject, takeUntil } from 'rxjs';
import { message, messageUser, title } from 'src/app/common/message';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-change-password-manager',
    standalone: true,
    imports: [SharedModule, DialogModule, PasswordModule],
    templateUrl: './change-password-manager.component.html',
    styleUrls: ['./change-password-manager.component.css']
})
export class ChangePasswordManagerComponent implements OnInit, OnDestroy {

    formPassword!: FormGroup;
    visibleModal: boolean = true;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private messageService: MessageService, private authService: AuthService, private route: Router) { }

    ngOnInit(): void {
        this.formPassword = new FormGroup({
            'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onUpdatePassword(): void {
        if (this.formPassword.invalid) {
            this.formPassword.markAllAsTouched();
            return;
        }
        const body = {
            id: this.authService.getCurrentUser().id,
            password: this.formPassword.value.password
        }
        this.userService.updatePasswordAdmin(body.id, body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.formPassword.reset();
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updateSuccess });
                    setTimeout(() => {
                        this.authService.logout();
                        window.location.reload();
                    }, 2000);
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

    hideDialog(): void {
        this.route.navigate(['/admin/trang-chu']);
    }

}
