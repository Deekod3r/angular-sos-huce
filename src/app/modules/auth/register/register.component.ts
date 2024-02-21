import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { message, messageRegister, messageVerify, title } from 'src/app/common/message';
import { AuthService } from 'src/app/services/auth.service';
import { responseCodeCommon, responseCodeAuth } from 'src/app/common/response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, ProgressBarModule, DropdownModule, DividerModule, PasswordModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  registerNotify: boolean = false;
  registerMsg: Message[] = [];
  isSubmitted: boolean = false;
  step: number = 1;
  verifyForm!: FormGroup;
  id: string = '';

  private readonly subscribes$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(9), Validators.maxLength(20)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/), noWhitespaceValidator()]),
      'email': new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
    });
    this.verifyForm = new FormGroup({
      'code': new FormControl('', [Validators.required, noWhitespaceValidator()])
    });
  }

  ngOnDestroy() {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.notify(message.requiredInfo, 'error', title.error);
      return;
    }
    this.isSubmitted = true;

    this.userService.register(this.registerForm).pipe(
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
          let error = res.error.error;
          if (error.code == responseCodeCommon.invalid) {
            this.notify(message.invalidInput, 'error', title.error);
          } else if (error.code == responseCodeCommon.existed) {
            this.notify(messageRegister.exist, 'error', title.error);
          }
        } else {
          this.notify(message.error, 'error', title.error);
        }
      }
    });
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      this.notify(message.requiredInfo, 'error', title.error)
      return;
    }
    this.isSubmitted = true;
    this.authService.verify(this.id, this.verifyForm.controls['code'].value).pipe(
      takeUntil(this.subscribes$),
      finalize(() => {
        this.isSubmitted = false;
      })
    )
    .subscribe({
      next: (res) => {
        if (res.success) {
          this.notify(messageVerify.success, 'success', title.success);
          this.verifyForm.reset();
          setTimeout(() => {
            window.location.href = '/dang-nhap';
          }, 2000);
        }
      },
      error: (res) => {
        if (res.error) {
          let error = res.error.error;
          if (error.code == responseCodeCommon.invalid) {
            this.notify(message.invalidInput, 'error', title.error);
          } else if (error.code == responseCodeAuth.codeExpired) {
            this.notify(messageRegister.codeExpired, 'error', title.error);
          } else if (error.code == responseCodeAuth.codeIncorrect) {
            this.notify(messageRegister.codeNotMatch, 'error', title.error);
          } else {
            this.notify(message.error, 'error', title.error);
          }
        } else {
          this.notify(message.error, 'error', title.error);
        }
      }
    });
  }

  notify(msg: string, type: string, title: string): void {
    this.registerNotify = true;
    this.registerMsg = [
      { severity: type, summary: title, detail: msg }
    ];
    setTimeout(() => {
      this.registerNotify = false;
      this.registerMsg = [];
    }, 3000);
  }
  
}
