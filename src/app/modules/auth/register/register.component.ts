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
import { message, messageRegister, title } from 'src/app/common/message';

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

  private readonly subscribes$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(9), Validators.maxLength(20)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/), noWhitespaceValidator()]),
      'email': new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100)]),
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
      next: (response) => {
        if (response) {
          this.notify('Vui lòng tiếp tục xác nhận tài khoản', 'success', title.success);
          this.registerForm.reset();
          setTimeout(() => {
            window.location.href = '/auth/verify/' + response;
          }, 2000);
        }
      },
      error: (error) => {
        console.log(error);
        if (error.status === 409) {
          this.notify(messageRegister.exist, 'error', title.error);
        } else {
          this.notify(messageRegister.fail, 'error', title.error);
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
    }, 5000);
  }
}
