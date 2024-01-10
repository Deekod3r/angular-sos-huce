import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnDestroy() {
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.notify('Vui lòng nhập đầy đủ thông tin', 'error', 'Lỗi')
      return;
    }
    this.isSubmitted = true;
    this.userService.register(this.registerForm).pipe(
      finalize(() => {
        this.isSubmitted = false;
      })
    )
    .subscribe({
      next: (response) => {
        if (response) {
          this.notify('Vui lòng tiếp tục xác nhận tài khoản', 'success', 'Thành công');
          this.registerForm.reset();
          setTimeout(() => {
            window.location.href = '/auth/verify/' + response;
          },2000);
        }
      },
      error: (error) => {
        if (error.status === 409) {
          this.notify('Tài khoản đã tồn tại', 'error', 'Lỗi');
        } else {
          this.notify('Đăng ký thất bại, vui lòng thử lại sau', 'error', 'Lỗi');
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
