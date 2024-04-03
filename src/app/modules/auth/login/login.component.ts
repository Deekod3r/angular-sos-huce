import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize, takeUntil } from 'rxjs/operators'; 
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Subject } from 'rxjs';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { message, messageUser, title } from 'src/app/common/message';
import { CheckboxModule } from 'primeng/checkbox';
import { CONFIG } from 'src/app/common/config';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [SharedModule, ProgressBarModule, CheckboxModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm!: FormGroup;
    isSubmitted: boolean = false;

    private readonly subscribes$: Subject<void> = new Subject<void>();

    constructor(private authService: AuthService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, noWhitespaceValidator()]),
            'password': new FormControl('', [Validators.required, noWhitespaceValidator()]),
            'remember': new FormControl(false)
        });
    }

    ngAfterViewInit(): void {
        if (sessionStorage.getItem(CONFIG.KEY.TOKEN_EXPIRED)) {
            this.messageService.add({severity:'error', summary: title.error, detail: messageUser.tokenExpired});
            sessionStorage.removeItem(CONFIG.KEY.TOKEN_EXPIRED);
        }
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onLogin(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        let body = {
            email: this.loginForm.controls['email'].value.trim(),
            password: this.loginForm.controls['password'].value,
            remember: this.loginForm.controls['remember'].value
        }
        this.isSubmitted = true;
        this.authService.login(body).pipe(
            takeUntil(this.subscribes$),
            finalize(() => {
                this.isSubmitted = false;
            })
        )
        .subscribe({
            next: (res) => {
                if (res.success) {
                    window.location.reload();            
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({severity:'error', summary: title.error, detail: res.error.message});
                } else {
                    this.messageService.add({severity:'error', summary: title.error, detail: message.error});
                }
                this.loginForm.controls['password'].setValue('');
            }
        });
    }

}
