import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { finalize } from 'rxjs';
import { responseCode } from 'src/app/common/responseCode';
import { Faculty } from 'src/app/models/faculty.model';
import { FacultyService } from 'src/app/services/faculty.service';
import { HeaderService } from 'src/app/services/header.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  registerNotify: boolean = false;
  registerMsg: Message[] = [];
  isSubmitted: boolean = false;
  faculties: Faculty[] = [];
  faculty!: Faculty;

  constructor(private headerService: HeaderService, private studentService: StudentService, private facultyService: FacultyService) { }

  ngOnInit() {
    this.headerService.hide();
    this.getFaculties();
    this.registerForm = new FormGroup({
      'studentCode': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
      faculty: new FormControl<Faculty | null>(null, Validators.required),
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/)]),
      'email': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+\d+@huce\.edu\.vn$/)]),
    });
  }

  ngOnDestroy() {
  }

  getFaculties() {
    this.facultyService.getAllFaculty().subscribe({
      next: (faculties) => {
        this.faculties = faculties;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.notify('Vui lòng nhập đầy đủ thông tin', 'error', 'Lỗi')
      return;
    }
    this.isSubmitted = true;
    this.studentService.register(this.registerForm).pipe(
      finalize(() => {
        this.isSubmitted = false;
      })
    )
    .subscribe({
      next: (success) => {
        if (success) {
          this.notify('Đăng ký thành công', 'success', 'Thành công');
          this.registerForm.reset();
        }
      },
      error: (error) => {
        if (error.status === 409) {
          this.notify('Tài khoản sinh viên đã tồn tại', 'error', 'Lỗi');
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
