import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { UserService } from 'src/app/services/user.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-admin-update',
    templateUrl: './admin-update.component.html',
    styleUrls: ['./admin-update.component.css']
})
export class AdminUpdateComponent implements OnInit, OnDestroy  {

    @Input() idAdmin!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    
    form!: FormGroup;
    formPassword!: FormGroup;
    admin!: any;
    visibleUpdatePasswordModal: boolean = false;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    
    ngOnInit(): void {
        this.form = new FormGroup({
            'phoneNumber': new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(15)]),
            'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưỂỄỆẾỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪẹễệếỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ ]{2,}$/), noWhitespaceValidator(), Validators.maxLength(100)]),
            'email': new FormControl('', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)]),
            'status': new FormControl('', [Validators.required])
        });
        this.formPassword = new FormGroup({
            'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/)])
        });
        this.getAdmin();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdmin(): void {
        this.userService.getUserById(this.idAdmin)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.admin = res.data;
                    this.onInitForm();
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

    onInitForm(): void {
        this.form.patchValue({
            phoneNumber: this.admin.phoneNumber,
            name: this.admin.name,
            email: this.admin.email,
            status: this.admin.isActivated
        });
    }
  
    onSaveAccountAdmin(event: any): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.form.dirty) {
            this.messageService.add({ severity: 'info', summary: title.info, detail: message.noChange });
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn cập nhật thông tin chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                let body = {
                    id: this.idAdmin,
                    phoneNumber: this.form.value.phoneNumber.trim(),
                    name: this.form.value.name.trim(),
                    email: this.form.value.email.trim(),
                    status: this.form.value.status != null ? this.form.value.status : this.admin.isActivated
                }
                this.userService.updateAdmin(this.admin.id, body)
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
            },
            reject: () => {}
        });
    }

    onSavePassword(event: any): void {
        if (this.formPassword.invalid) {
            this.formPassword.markAllAsTouched();
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn cập nhật thông tin chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                let body = {
                    id: this.idAdmin,
                    password: this.formPassword.value.password
                }
                this.userService.updatePasswordAdmin(this.idAdmin, body)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.formPassword.reset();
                            this.visibleUpdatePasswordModal = false;
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
            },
            reject: () => {}
        });
    }

}
