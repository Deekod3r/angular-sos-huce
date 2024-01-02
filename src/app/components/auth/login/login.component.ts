import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  loginError: boolean = false;
  loginMsg: Message[] = [];
  isSubmitted: boolean = false;


  constructor(private headerService: HeaderService, private authService: AuthService) { }

  ngOnInit() {
    this.headerService.hide();
    this.loginForm = new FormGroup({
      'studentCode': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnDestroy() {
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorLogin('Vui lòng nhập đầy đủ thông tin')
      return;
    }
    this.isSubmitted = true;
    this.authService.login(this.loginForm).pipe(
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
