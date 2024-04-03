import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { NewsService } from 'src/app/services/news.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-new-media-create',
    templateUrl: './new-media-create.component.html',
    styleUrls: ['./new-media-create.component.css']
})
export class NewMediaCreateComponent implements OnInit, OnDestroy {

    @Input() categories: any[] = [];
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;
    form!: FormGroup;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private newsService: NewsService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(100)]),
            content: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
            categoryId: new FormControl(null, Validators.required),
            description: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
            image: new FormControl(null, Validators.required),
        });
    }
    
    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    onSaveNews(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const formData = new FormData();
        formData.append('title', this.form.value.title.trim());
        formData.append('content', this.form.value.content.trim());
        formData.append('description', this.form.value.description.trim());
        formData.append('categoryId', this.form.value.categoryId);
        formData.append('image', this.form.value.image);
        this.newsService.createNews(formData)
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

    onRemoveImage(): void {
        this.form.patchValue({ image: null });
    } 
    
}
