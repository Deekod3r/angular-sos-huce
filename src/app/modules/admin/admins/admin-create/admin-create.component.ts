import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Messages } from 'primeng/messages';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { UserService } from 'src/app/services/user.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-admin-create',
    templateUrl: './admin-create.component.html',
    styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit, OnDestroy  {
    
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;

    form!: FormGroup;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private userService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(15)]),
            'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)]),
            'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪẹễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/), noWhitespaceValidator(), Validators.maxLength(100)]),
            'email': new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)])
        });
    }
    
    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onSaveAccountAdmin(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        let body = {
            phoneNumber: this.form.value.phoneNumber.trim(),
            password: this.form.value.password,
            name: this.form.value.name.trim(),
            email: this.form.value.email.trim()
        }
        this.userService.createAdmin(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.form.reset();
                    this.result = true;
                    this.resultAction.emit(this.result); 
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                }
            }
        });
    }

}
