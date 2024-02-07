import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { message, messageForgot, title } from 'src/app/common/message';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { responseCodeAuth, responseCodeCommon } from 'src/app/common/response';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
};

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule, ConfirmDialogModule, PasswordModule],
  providers: [ConfirmationService],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

  forgotForm!: FormGroup;
  verifyForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  notifyForgotPassword: boolean = false;
  msg: Message[] = [];
  id!: string;
  step: number = 1;
  email!: string;

  private readonly subscribes$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.forgotForm = new FormGroup({
      'account': new FormControl('', [Validators.required, noWhitespaceValidator()])
    });
    this.verifyForm = new FormGroup({
      'code': new FormControl('', [Validators.required, noWhitespaceValidator()])
    });
    this.resetPasswordForm = new FormGroup({
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
      'confirmPassword': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)])
    }, { validators: passwordMatchValidator });
  }

  ngOnDestroy() {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  onCheckExist() {
    if (this.forgotForm.invalid) {
      this.notify(message.requiredInfo, 'error', title.error);
      return;
    }

    this.userService.checkExist(this.forgotForm.controls['account'].value).pipe(
      takeUntil(this.subscribes$)
    )
    .subscribe({
      next: (res: any) => {
        if (res.success) {
          if (res.data != "NOT_FOUND") {
            this.email = res.data;
            this.confirmationService.confirm({
              message: 'Tạo mã xác thực và gửi tới '+  this.email + '?',
              header: 'ĐẶT LẠI MẬT KHẨU',
              icon: 'fa fa-solid fa-triangle-exclamation',
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
                    if (res.error) {
                      let error = res.error.error;
                      if (error.code == responseCodeCommon.notFound) {
                        this.notify(messageForgot.notMatch, 'error', title.error);
                      } else if (error.code == responseCodeCommon.invalid) {
                        this.notify(message.invalidInput, 'error', title.error);
                      }
                    } else {
                      this.notify(message.error, 'error', title.error);
                    }
                  }
                });
              },
              reject: () => {
              }
            });
          } else {
            this.notify(messageForgot.notMatch, 'error', title.error);
          }
        }
      },
      error: (res) => {
        if (res.error) {
          this.notify(message.invalidInput, 'error', title.error);
        } else {
          this.notify(message.error, 'error', title.error);
        }
      }
    });
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      this.notify(message.requiredInfo, 'error', title.error);
      return;
    }

    this.userService.verifyForgotPassword(this.id, this.verifyForm.controls['code'].value)
    .pipe(takeUntil(this.subscribes$))
    .subscribe({
      next: (res: any) => {
        if (res.success) {
          this.step = 3;
        }
      },
      error: (res: any) => {
        if (res.error) {
          let error = res.error.error;
          if (error.code == responseCodeCommon.invalid) {
            this.notify(message.invalidInput, 'error', title.error);
          } else if (error.code == responseCodeAuth.codeExpired) {
            this.notify(messageForgot.codeExpired, 'error', title.error);
          } else if (error.code == responseCodeAuth.codeIncorrect) {
            this.notify(messageForgot.codeNotMatch, 'error', title.error);
          }
        } else {
          this.notify(message.error, 'error', title.error);
        }
      }
    });
  }

  onResetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.notify(message.requiredInfo, 'error', title.error);
      return;
    }

    this.userService.resetPassword(this.id, 
      this.verifyForm.controls['code'].value,
      this.email,
      this.resetPasswordForm.controls['password'].value)
      .pipe(takeUntil(this.subscribes$))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.resetPasswordForm.reset();
            this.notify(messageForgot.success, 'success', title.success);
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 2000);
          }
        },
        error: (res: any) => {
          if (res.error) {
            let error = res.error.error;
            if (error.code == responseCodeCommon.invalid) {
              this.notify(message.invalidInput, 'error', title.error);
            } else if (error.code == responseCodeAuth.codeExpired) {
              this.notify(messageForgot.codeExpired, 'error', title.error);
            } else if (error.code == responseCodeAuth.codeIncorrect) {
              this.notify(messageForgot.codeNotMatch, 'error', title.error);
            }
          } else {
            this.notify(message.error, 'error', title.error);
          }
        }
      });
  }

  notify(msg: string, type: string, title: string): void {
    this.notifyForgotPassword = true;
    this.msg = [
      { severity: type, summary: title, detail: msg }
    ];
    setTimeout(() => {
      this.notifyForgotPassword = false;
      this.msg = [];
    }, 3000);
  }

}
