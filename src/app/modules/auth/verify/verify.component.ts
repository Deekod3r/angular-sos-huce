import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-verify',
  imports: [SharedModule, ProgressBarModule],
  standalone: true,
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  
  verifyForm!: FormGroup;
  verifyNotify: boolean = false;
  verifyMsg: Message[] = [];
  isSubmitted: boolean = false;
  id: string = '';

  private readonly subscribes$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.verifyForm = new FormGroup({
      'code': new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy() {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  onVerify() {
    if (this.verifyForm.invalid) {
      this.notify('Vui lòng nhập đầy đủ thông tin', 'error', 'Lỗi')
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
      next: (response) => {
        if (response.success) {
          this.notify('Xác thực thành công', 'success', 'Thành công');
          this.verifyForm.reset();
          setTimeout(() => {
            window.location.href = '/auth/login';
          },3000);
        } else {
          this.notify('Xác thực thất bại, vui lòng thử lại sau', 'error', 'Lỗi');
        }
      },
      error: (error) => {
        console.log(error);
        this.notify('Xác thực thất bại, vui lòng thử lại sau', 'error', 'Lỗi');
      }
    });
  }

  notify(msg: string, type: string, title: string): void {
    this.verifyNotify = true;
    this.verifyMsg = [
      { severity: type, summary: title, detail: msg }
    ];
    setTimeout(() => {
      this.verifyNotify = false;
      this.verifyMsg = [];
    }, 5000);
  }

}
