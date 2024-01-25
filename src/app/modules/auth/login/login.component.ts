import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize, first, takeUntil } from 'rxjs/operators'; 
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Subject } from 'rxjs';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, ProgressBarModule, DividerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

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
      this.errorLogin('Vui lòng nhập đầy đủ thông tin')
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
          this.errorLogin('Thông tin đăng nhập không chính xác');
        } else {
          this.errorLogin('Đã xảy ra lỗi. Vui lòng thử lại sau');
        }
        this.loginForm.controls['password'].setValue('');
      }
    });
  }

  errorLogin(msg: string): void {
    this.loginError = true;
    this.loginMsg = [
      { severity: 'error', summary: 'Lỗi', detail: msg }
    ];
    setTimeout(() => {
      this.loginError = false;
      this.loginMsg = [];
    }, 5000);
  }
}
