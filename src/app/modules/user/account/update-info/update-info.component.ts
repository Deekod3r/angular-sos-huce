import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { REGEX } from 'src/app/common/constant';
import { title, message, messageUser } from 'src/app/common/message';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { passwordMatchValidator } from 'src/app/shared/utils/data.util';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-update-info',
    templateUrl: './update-info.component.html',
    styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit, OnDestroy {

    @Input() infoKey: any;
    @Input() userId: any;
    @Input() userInfo: any;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    formName!: FormGroup;
    formPhone!: FormGroup;
    formEmail!: FormGroup;
    formEmailConfirm!: FormGroup;
    onConfirmEmail: boolean = false;
    formPassword!: FormGroup;
    REGEX_PASSWORD = REGEX.PASSWORD

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private authService: AuthService, private messageService: MessageService) { }

    ngOnInit(): void {
        if (this.infoKey === 'name') {
            this.formName = new FormGroup({
                'currentPassword': new FormControl('', [Validators.required]),
                'name': new FormControl(this.userInfo, [Validators.required, 
                    Validators.pattern(REGEX.CHARACTER), 
                    noWhitespaceValidator(), Validators.minLength(2) , Validators.maxLength(100)]),
            });
        }
        if (this.infoKey === 'phoneNumber') {
            this.formPhone = new FormGroup({
                'currentPassword': new FormControl('', [Validators.required]),
                'phoneNumber': new FormControl(this.userInfo, [Validators.required, Validators.pattern(REGEX.DIGIT), Validators.minLength(10), Validators.maxLength(15)]),
            });
        }
        if (this.infoKey === 'email') {
            this.formEmail = new FormGroup({
                'currentPassword': new FormControl('', [Validators.required]),
                'email': new FormControl(this.userInfo, [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]),
            });
            this.formEmailConfirm = new FormGroup({
                'id': new FormControl('', [Validators.required]),
                'code': new FormControl('', [Validators.required, Validators.maxLength(6)]),
            });
        }
        if (this.infoKey === 'password') {
            this.formPassword = new FormGroup({
                'currentPassword': new FormControl('', [Validators.required]),
                'password': new FormControl('', [Validators.required, Validators.pattern(REGEX.PASSWORD)]),
                'confirmPassword': new FormControl('', [Validators.required, Validators.pattern(REGEX.PASSWORD)])
            }, { validators: passwordMatchValidator });
        }
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onUpdateName(): void {
        if (this.formName.invalid) {
            this.formName.markAllAsTouched();
            return;
        }
        const body = {
            id: this.userId,
            currentPassword: this.formName.value.currentPassword,
            name: this.formName.value.name.trim()
        }
        this.userService.updateUser(this.userId, body, 'name')
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.result = true;
                    this.resultAction.emit(this.result);
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
            }
        });
    }

    onUpdatePhone(): void {
        if (this.formPhone.invalid) {
            this.formPhone.markAllAsTouched();
            return;
        }
        const body = {
            id: this.userId,
            currentPassword: this.formPhone.value.currentPassword,
            phoneNumber: this.formPhone.value.phoneNumber.trim()
        }
        this.userService.updateUser(this.userId, body, 'phone')
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.result = true;
                    this.resultAction.emit(this.result);
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
            }
        });
    }

    onUpdateEmail(): void {
        if (this.formEmail.invalid) {
            this.formEmail.markAllAsTouched();
            return;
        }
        const body = {
            id: this.userId,
            currentPassword: this.formEmail.value.currentPassword,
            email: this.formEmail.value.email.trim()
        }
        this.userService.updateUser(this.userId, body, 'email')
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.onConfirmEmail = true;
                    this.formEmailConfirm.controls['id'].setValue(res.data.id);
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
            }
        });
    }

    onVerifyUpdateEmail(): void {
        if (this.formEmailConfirm.invalid) {
            this.formEmailConfirm.markAllAsTouched();
            return;
        }
        let data = {
            id: this.formEmailConfirm.value.id,
            code: this.formEmailConfirm.value.code.trim()
        }
        this.userService.verifyUpdateEmail(data)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    setTimeout(() => {
                        this.authService.logout();
                        window.location.reload();
                    }, 2000);
                    this.messageService.add({severity:'success', summary: title.success, detail: messageUser.updateEmailSuccess});
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
            }
        });
    }

    onUpdatePassword(): void {
        if (this.formPassword.invalid) {
            this.formPassword.markAllAsTouched();
            return;
        }
        const body = {
            id: this.userId,
            currentPassword: this.formPassword.value.currentPassword,
            newPassword: this.formPassword.value.password,
            confirmPassword: this.formPassword.value.confirmPassword
        }
        this.userService.updateUser(this.userId, body, 'password')
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.formPassword.reset();
                    setTimeout(() => {
                        this.authService.logout();
                        window.location.reload();
                    }, 2000);
                    this.messageService.add({severity:'success', summary: title.success, detail: messageUser.updateSuccess + ". Vui lòng đăng nhập lại!"});
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
            }
        });
    }

}


