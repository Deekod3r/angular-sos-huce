import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Subject, takeUntil } from 'rxjs';
import { message, messageNewsCategory, title } from 'src/app/common/message';
import { NewsService } from 'src/app/services/news.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-news-category',
    standalone: true,
    imports: [SharedModule, ConfirmDialogModule, DialogModule, TableModule, TieredMenuModule, InputTextareaModule],
    templateUrl: './news-category.component.html',
    styleUrls: ['./news-category.component.css']
})
export class NewsCategoryComponent implements OnInit, OnDestroy {

    categories!: any;
    formAdd!: FormGroup;
    formUpdate!: FormGroup;
    visibleUpdateModal: boolean = false;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private newsService: NewsService, private messageService: MessageService, 
        private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getNewsCategories();
        this.formAdd = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
        this.formUpdate = new FormGroup({
            id: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNewsCategories(): void {
        this.newsService.getNewsCategories()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.categories = res.data;
                this.categories.forEach((category: any) => {
                    category.menuItems = this.getMenuItems(category);
                })
            }
        });
    }

    getMenuItems(category: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.showUpdateModal(category.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.confirmDelete(event, category.id);
                }
            },
        ];
    }

    createNewsCategory(): void {
        if(this.formAdd.invalid) {
            this.formAdd.markAllAsTouched();
            return;
        }
        let body = {
            name: this.formAdd.value.name.trim(),
            description: this.formAdd.value.description.trim()
        };
        this.newsService.createNewsCategory(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.getNewsCategories();
                    this.formAdd.reset();
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageNewsCategory.createSuccess });
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

    showUpdateModal(id: string): void {
        this.visibleUpdateModal = true;
        this.newsService.getNewsCategoryById(id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                let categoryUpdate = res.data;
                this.formUpdate.setValue({
                    id: categoryUpdate.id,
                    name: categoryUpdate.name,
                    description: categoryUpdate.description
                });
            }
        });
    }

    updateNewsCategory(): void {
        if(this.formUpdate.invalid) {
            this.formUpdate.markAllAsTouched();
            return;
        }
        let body = {
            id: this.formUpdate.value.id,
            name: this.formUpdate.value.name.trim(),
            description: this.formUpdate.value.description.trim()
        }
        this.newsService.updateNewsCategory(body, this.formUpdate.value.id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.getNewsCategories();
                    this.formUpdate.reset();
                    this.visibleUpdateModal = false;
                    this.messageService.add({ severity: 'success', summary: title.success, detail: messageNewsCategory.updateSuccess });
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

    confirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Khi xóa danh mục, các tin tức liên quan cũng sẽ bị xóa. </br> Bạn chắc chắn muốn xoá danh mục tin tức này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.newsService.deleteNewsCategory(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe(res => {
                    if (res.success) {
                        this.getNewsCategories();
                        this.messageService.add({ severity: 'success', summary: title.success, detail: messageNewsCategory.deleteSuccess });
                    }
                });
            },
            reject: () => {
            }
        });
    }

}
