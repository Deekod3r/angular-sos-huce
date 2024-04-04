import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { NewsService } from 'src/app/services/news.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-new-media-update',
    templateUrl: './new-media-update.component.html',
    styleUrls: ['./new-media-update.component.css']
})
export class NewMediaUpdateComponent implements OnInit, OnDestroy {

    @Input() idNews!: string;
    @Input() categories: any[] = [];
    @Output() resultAction = new EventEmitter<boolean>();
    visibleUpdateImageModal: boolean = false;
    result: boolean = false;
    form!: FormGroup;
    news!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public newsService: NewsService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl(null, Validators.required),
            title: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            content: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
            description: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            status: new FormControl(null, Validators.required),
            categoryId: new FormControl(null, Validators.required),
        });
        this.getNews();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNews(): void {
        this.newsService.getNewsById(this.idNews)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.news = res.data;
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
            id: this.news.id,
            title: this.news.title,
            content: this.news.content,
            description: this.news.description,
            status: this.news.status,
            categoryId: this.news.categoryId,
        });
    }

    onSaveNews(event: any): void {
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
                const formData = new FormData();
                formData.append('title', this.form.value.title.trim());
                formData.append('content', this.form.value.content.trim());
                formData.append('description', this.form.value.description.trim());
                formData.append('categoryId', this.form.value.categoryId);
                formData.append('status', this.form.value.status);
                formData.append('id', this.form.value.id);
                this.newsService.updateNews(formData, this.idNews)
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
            reject: () => {
            }
        });
    }

    onUploadImage(event: any): void {
        const image = event.files[0];
        let formData = new FormData();
        formData.append('image', image);
        formData.append('id', this.idNews);
        this.newsService.updateImageNews(formData, this.idNews)
            .pipe(takeUntil(this.subscribes$)).subscribe({
                next: (res) => {
                    if (res.success) {
                        this.visibleUpdateImageModal = false;
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

    onShowUpdateImageModal(): void {
        this.visibleUpdateImageModal = true;
    }

}
