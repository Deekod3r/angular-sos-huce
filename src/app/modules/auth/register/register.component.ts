import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { message, messageUser, title } from 'src/app/common/message';
import { REGEX } from 'src/app/common/constant';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [SharedModule, ProgressBarModule, DropdownModule, PasswordModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

    registerForm!: FormGroup;
    verifyForm!: FormGroup;
    isSubmitted: boolean = false;
    step: number = 1;
    id: string = '';

    private readonly subscribes$: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(REGEX.DIGIT), Validators.minLength(10), Validators.maxLength(15)]),
            'password': new FormControl('', [Validators.required, Validators.pattern(REGEX.PASSWORD)]),
            'name': new FormControl('', [Validators.required, Validators.pattern(REGEX.CHARACTER), 
                                        noWhitespaceValidator(), Validators.minLength(2), Validators.maxLength(100)]),
            'email': new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)])
        });
        this.verifyForm = new FormGroup({
            'code': new FormControl('', [Validators.required, noWhitespaceValidator()])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onRegister(): void {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        let body = {
            phoneNumber: this.registerForm.value.phoneNumber.trim(),
            password: this.registerForm.value.password,
            name: this.registerForm.value.name.trim(),
            email: this.registerForm.value.email.trim()
        }
        this.isSubmitted = true;
        this.userService.register(body).pipe(
            takeUntil(this.subscribes$),
            finalize(() => {
                this.isSubmitted = false;
            })
        )
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.step = 2;
                    this.id = res.data.id;
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

    onVerify(): void {
        if (this.verifyForm.invalid) {
            this.verifyForm.markAllAsTouched();
            return;
        }
        let data = {
            id: this.id,
            code: this.verifyForm.value.code.trim()
        }
        this.isSubmitted = true;
        this.userService.verifyRegister(data).pipe(
            takeUntil(this.subscribes$),
            finalize(() => {
                this.isSubmitted = false;
            })
        )
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.messageService.add({severity:'success', summary: title.success, detail: messageUser.verifySuccess});
                    this.verifyForm.reset();
                    setTimeout(() => {
                        window.location.href = '/dang-nhap';
                    }, 2000);
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
