import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';
import { Subject, takeUntil } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { GalleriaService } from 'src/app/services/galleria.service';
import { title, message, messageGalleria } from 'src/app/common/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-galleria',
    standalone: true,
    imports: [SharedModule, ConfirmDialogModule, AccordionModule, 
        ImageModule, FileUploadModule, DialogModule, InputTextareaModule, 
        DropdownModule, InputNumberModule],
    templateUrl: './galleria.component.html',
    styleUrls: ['./galleria.component.css']
})
export class GalleriaComponent implements OnInit, OnDestroy{

    formAdd!: FormGroup;
    formUpdate!: FormGroup;
    idUpdate!: string;
    activeIndex!: number;
    galleiras: any[] = [];
    visibleUpdateImageModal: boolean = false;
    visibleUpdateModal: boolean = false;
    isAdd: boolean = false;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public galleriaService: GalleriaService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getGallerias();
        this.formAdd = new FormGroup({
            title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
            image: new FormControl('', [Validators.required]),
            link: new FormControl('', [Validators.required]),
        });
        this.formUpdate = new FormGroup({
            id: new FormControl('', Validators.required),
            title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
            index: new FormControl('', [Validators.required, Validators.min(0)]),
            status: new FormControl('', [Validators.required]),
            link: new FormControl('', [Validators.required]),
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getGallerias(): void {
        this.galleriaService.getGallerias({})
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                this.galleiras = res.data;
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

    getGalleria(): void {
        this.galleriaService.getGalleria(this.idUpdate)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                this.formUpdate.patchValue({
                    id: res.data.id,
                    title: res.data.title,
                    description: res.data.description,
                    index: res.data.index,
                    status: res.data.status,
                    link: res.data.link
                });
                this.visibleUpdateModal = true;
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

    onCreateGalleria(): void {
        if (!this.isAdd) {
            this.isAdd = true;
            return;
        }
        if (this.formAdd.invalid) {
            this.formAdd.markAllAsTouched();
            return;
        }
        const formData = new FormData();
        formData.append('title', this.formAdd.value.title.trim());
        formData.append('description', this.formAdd.value.description.trim());
        formData.append('image', this.formAdd.value.image);
        formData.append('link', this.formAdd.value.link.trim());
        this.galleriaService.createGalleria(formData)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageGalleria.createSuccess });
                    this.isAdd = false;
                    this.formAdd.reset();
                    this.getGallerias();
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

    onUpdateGalleria(event: any): void {
        if (!this.formUpdate.dirty) {
            this.messageService.add({ severity: 'info', summary: title.info, detail: message.noChange });
            return;
        }
        if (this.formUpdate.invalid) {
            this.formUpdate.markAllAsTouched();
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
                    title: this.formUpdate.value.title.trim(),
                    description: this.formUpdate.value.description.trim(),
                    index: this.formUpdate.value.index,
                    status: this.formUpdate.value.status,
                    link: this.formUpdate.value.link.trim()
                };
                this.galleriaService.updateGalleria(body, this.idUpdate)
                    .pipe(takeUntil(this.subscribes$))
                    .subscribe({
                        next: (res) => {
                            if (res.success) {
                                this.messageService.add({ severity: 'success', summary: title.success, detail: messageGalleria.updateSuccess });
                                this.formUpdate.reset();
                                this.visibleUpdateModal = false;
                                this.getGallerias();
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

    onHideFormAdd(): void {
        this.isAdd = false;
        this.formAdd.reset();
    }

    onShowUpdateModal(id: string): void {
        this.idUpdate = id;
        this.getGalleria();
    }

    onHideFormUpdate(): void {
        this.visibleUpdateModal = false;
        this.formUpdate.reset();
    }

    onShowUpdateImageModal(id: string): void {
        this.idUpdate = id;
        this.visibleUpdateImageModal = true;
    }

    onUploadImage(event: any): void {
        const image = event.files[0];
        let formData = new FormData();
        formData.append('id', this.idUpdate);
        formData.append('image', image);
        this.galleriaService.updateImageGalleria(formData, this.idUpdate)
        .pipe(takeUntil(this.subscribes$)).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.getGallerias();
                    this.visibleUpdateImageModal = false;
                    this.visibleUpdateModal = false;
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageGalleria.updateSuccess });
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

    onImagePicked(event: any): void {
        if (event && event.files && event.files.length > 0) {
            this.formAdd.controls['image'].markAsDirty();
            const file = event.files[0];
            this.formAdd.patchValue({ image: file });
        }
    }

    onRemoveImage(): void {
        this.formAdd.patchValue({ image: null });
    }

    onConfirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá galleria này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.galleriaService.deleteGalleria(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getGallerias();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageGalleria.deleteSuccess });
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
