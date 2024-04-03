import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { message, messageUser, title } from 'src/app/common/message';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { passwordMatchValidator } from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [SharedModule, ConfirmDialogModule, PasswordModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

    forgotForm!: FormGroup;
    verifyForm!: FormGroup;
    resetPasswordForm!: FormGroup;
    id!: string;
    step: number = 1;
    email!: string;

    private readonly subscribes$: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.forgotForm = new FormGroup({
            'account': new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
        this.verifyForm = new FormGroup({
            'code': new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
        this.resetPasswordForm = new FormGroup({
            'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/), Validators.maxLength(100)]),
            'confirmPassword': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/), Validators.maxLength(100)])
        }, { validators: passwordMatchValidator });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onCheckExist(): void {
        if (this.forgotForm.invalid) {
            this.forgotForm.markAllAsTouched();
            return;
        }
        this.userService.checkExist(this.forgotForm.controls['account'].value.trim())
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    if (res.data != "NOT_FOUND") {
                        this.email = res.data;
                        this.confirmationService.confirm({
                            message: 'Tạo mã xác thực và gửi tới '+ this.email + '?',
                            header: 'ĐẶT LẠI MẬT KHẨU',
                            icon: 'fa fa-solid fa-triangle-exclamation',
                            acceptLabel: 'Đồng ý',
                            rejectLabel: 'Hủy',
                            acceptIcon: "none",
                            rejectIcon: "none",
                            rejectButtonStyleClass: "p-button-text",
                            accept: () => {
                                this.userService.forgotPassword(this.email).pipe(takeUntil(this.subscribes$)).subscribe({
                                    next: (resForgot: any) => {
                                        if (resForgot.success) {
                                            this.id = resForgot.data.id;
                                            this.step = 2;
                                        }
                                    },
                                    error: (resForgot) => {
                                        if (resForgot.error) {
                                            this.messageService.add({ severity: 'error', summary: title.error, detail: resForgot.error.message });
                                        } else {
                                            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                                        }
                                    }
                                });
                            },
                            reject: () => {
                            }
                        });
                    } else {
                        this.messageService.add({ severity: 'error', summary: title.error, detail: messageUser.notFound });
                    }
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

    onVerify(): void {
        if (this.verifyForm.invalid) {
            this.verifyForm.markAllAsTouched();
            return;
        }
        let data = {
            id: this.id,
            code: this.verifyForm.controls['code'].value.trim()
        };
        this.userService.verifyForgotPassword(data)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.step = 3;
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

    onResetPassword(): void {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }
        let body = {
            id: this.id,
            code: this.verifyForm.controls['code'].value.trim(),
            email: this.email,
            newPassword: this.resetPasswordForm.controls['password'].value
        }
        this.userService.resetPassword(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.resetPasswordForm.reset();
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageUser.updatePasswordSuccess });
                    setTimeout(() => {
                        window.location.href = '/dang-nhap';
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

}

