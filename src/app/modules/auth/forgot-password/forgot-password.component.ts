import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subject, takeUntil, finalize } from 'rxjs';
import { message, messageLogin, title } from 'src/app/common/message';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule, ProgressBarModule, DividerModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  loginError: boolean = false;
  loginMsg: Message[] = [];
  isSubmitted: boolean = false;

  private readonly subscribes$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, noWhitespaceValidator()]),
      'password': new FormControl('', [Validators.required, noWhitespaceValidator()])
    });
  }

  ngOnDestroy() {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorLogin(message.requiredInfo)
      return;
    }

    this.isSubmitted = true;

    this.authService.login(this.loginForm.value).pipe(
      takeUntil(this.subscribes$),
      finalize(() => {
        this.isSubmitted = false;
      })
    )
    .subscribe({
      next: (success) => {
        if (success) {
          window.location.reload();      
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status == 401) {
          this.errorLogin(messageLogin.notMatch);
        } else {
          this.errorLogin(messageLogin.error);
        }
        this.loginForm.controls['password'].setValue('');
      }
    });
  }

  errorLogin(msg: string): void {
    this.loginError = true;
    this.loginMsg = [
      { severity: 'error', summary: title.error, detail: msg }
    ];
    setTimeout(() => {
      this.loginError = false;
      this.loginMsg = [];
    }, 5000);
  }
}

