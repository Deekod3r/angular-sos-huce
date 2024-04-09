import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChipModule } from 'primeng/chip';
import { title, message, messageBank } from 'src/app/common/message';
import { TableModule } from 'primeng/table';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from 'src/app/services/auth.service';
import { CONFIG } from 'src/app/common/config';

@Component({
    selector: 'app-bank',
    standalone: true,
    imports: [SharedModule, ChipModule, TableModule, TieredMenuModule, DialogModule, ConfirmDialogModule],
    templateUrl: './bank.component.html',
    styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit, OnDestroy {

    isManager: boolean = false;
    isAdd: boolean = false;
    banks!: any;
    formAdd!: FormGroup;
    formUpdate!: FormGroup;
    visibleUpdateModal: boolean = false;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private bankService: BankService, private messageService: MessageService, 
        private confirmationService: ConfirmationService, private authService: AuthService) { }

    ngOnInit(): void {
        this.getBanks();
        this.formAdd = new FormGroup({
            name: new FormControl({ value: '', disabled: !this.isAdd }, [Validators.required, Validators.maxLength(100)]),
            accountNumber: new FormControl({ value: '', disabled: !this.isAdd }, [Validators.required, Validators.maxLength(100)]),
            owner: new FormControl({ value: '', disabled: !this.isAdd }, [Validators.required, Validators.maxLength(100)]),
            logo: new FormControl({ value: '', disabled: !this.isAdd }, [Validators.required, Validators.maxLength(100)])
        });
        this.formUpdate = new FormGroup({
            id: new FormControl('', Validators.required),
            name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            accountNumber: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            owner: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            logo: new FormControl('', [Validators.required, Validators.maxLength(100)])
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getBanks(): void {
        this.bankService.getBanks()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.banks = res.data;
                    if (this.authService.getRole() == CONFIG.ROLE.MANAGER) {
                        this.isManager = true;
                        this.banks.forEach((bank: any) => {
                            bank.menuItems = this.getMenuItems(bank);
                        })
                    }
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

    onCreateBank(): void {
        if (!this.isAdd) {
            this.isAdd = true;
            this.formAdd.enable();
            return;
        }
        if (!this.isManager) {
            return;
        }
        if (this.formAdd.invalid) {
            this.formAdd.markAllAsTouched();
            return;
        }
        let body = {
            name: this.formAdd.value.name.trim(),
            accountNumber: this.formAdd.value.accountNumber.trim(),
            owner: this.formAdd.value.owner.trim(),
            logo: this.formAdd.value.logo.trim()
        }
        this.bankService.createBank(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.getBanks();
                    this.formAdd.reset();
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageBank.createSuccess });
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

    getMenuItems(bank: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(bank.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, bank.id);
                }
            },
        ];
    }

    onHideFormAdd(): void {
        this.isAdd = false;
        this.formAdd.reset();
    }

    onShowUpdateModal(id: string): void {
        if (!this.isManager) {
            return;
        }
        this.bankService.getBankById(id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    let bankUpdate = res.data;
                    this.formUpdate.setValue({
                        id: bankUpdate.id,
                        name: bankUpdate.name,
                        accountNumber: bankUpdate.accountNumber,
                        owner: bankUpdate.owner,
                        logo: bankUpdate.logo
                    });
                    this.visibleUpdateModal = true;
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
    
    onUpdateBank(event: any): void {
        if (!this.isManager) {
            return;
        }
        if (this.formUpdate.invalid) {
            this.formUpdate.markAllAsTouched();
            return;
        }
        if (!this.formUpdate.dirty) {
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
                    id: this.formUpdate.value.id,
                    name: this.formUpdate.value.name.trim(),
                    accountNumber: this.formUpdate.value.accountNumber.trim(),
                    owner: this.formUpdate.value.owner.trim(),
                    logo: this.formUpdate.value.logo.trim()
                }
                this.bankService.updateBank(body, this.formUpdate.value.id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getBanks();
                            this.formUpdate.reset();
                            this.visibleUpdateModal = false;
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageBank.updateSuccess });
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
            reject: () => {
            }
        });
    }

    onConfirmDelete(event: any, id: string): void {
        if (!this.isManager) {
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá nguồn nhận hỗ trợ này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.bankService.deleteBank(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getBanks();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageBank.deleteSuccess });
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
            reject: () => {
            }
        });
    }

}
