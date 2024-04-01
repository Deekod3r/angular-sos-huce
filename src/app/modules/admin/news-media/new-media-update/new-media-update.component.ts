import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
    result: boolean = false;
    form!: FormGroup;
    news!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private newsService: NewsService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl(null, Validators.required),
            title: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
            content: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
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
                    this.form.patchValue({ id: this.news.id });
                    this.form.patchValue({ title: this.news.title });
                    this.form.patchValue({ content: this.news.content });
                    this.form.patchValue({ status: this.news.status });
                    this.form.patchValue({ categoryId: this.news.categoryId });
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

    updateNews(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const formData = new FormData();
        formData.append('title', this.form.value.title);
        formData.append('content', this.form.value.content);
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
    }

    onImagePicked(event: any): void {
        if (event && event.files && event.files.length > 0) {
            this.form.controls['image'].markAsDirty();
            const file = event.files[0];
            this.form.patchValue({ image: file });
        }
    }

    removeImage(): void {
        this.form.patchValue({ image: null });
    } 
    
}
