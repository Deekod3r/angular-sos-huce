import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Subject, takeUntil } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { convertDateTimeFormat } from 'src/app/shared/utils/data.util';
import { NewsMediaModule } from './news-media.module';
import { typeAction } from 'src/app/common/constant';
import { title, message, messageNews } from 'src/app/common/message';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [NewsMediaModule, TableModule, TieredMenuModule, TagModule],
    templateUrl: './news-media.component.html',
    styleUrls: ['./news-media.component.css']
})
export class NewsMedeiaComponent  implements OnInit, OnDestroy {

    news!: any;
    categories!: any;
    idNewsUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    key = {
        status: '',
        title: '',
        fromDate: '',
        fromDateTime: '',
        toDate: '',
        toDateTime: '',
        categoryId: ''
    }
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public newsService: NewsService, private messageService: MessageService, 
        private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.getNews();
        this.getNewsCategories();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNews(): void {
        this.key.fromDate = this.key.fromDateTime ? convertDateTimeFormat(this.key.fromDateTime, true) : this.key.fromDateTime;
        this.key.toDate = this.key.toDateTime ? convertDateTimeFormat(this.key.toDateTime, false) : this.key.toDateTime;
        let search = {
            status: this.key.status != null ? this.key.status : '',
            title: this.key.title ? this.key.title.trim() : '',
            fromDate: this.key.fromDate ? this.key.fromDate : '',
            toDate: this.key.toDate ? this.key.toDate : '',
            categoryId: this.key.categoryId ? this.key.categoryId : ''
        }
        this.newsService.getNews(search)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.news = res.data;
                this.news.forEach((item: any) => {
                    item.menuItems = this.getMenuItems(item);
                });
            }
        });
    }

    getNewsCategories(): void {
        this.newsService.getNewsCategories()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.categories = res.data;
            }
        });
    }

    getMenuItems(news: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.showUpdateModal(news.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.confirmDelete(event, news.id);
                }
            },
        ];
    }

    refresh(): void {}

    showCreateModal(): void {
        this.visibleCreateModal = true;
    }

    showUpdateModal(id: string): void {
        this.idNewsUpdate = id;
        this.visibleUpdateModal = true;
    }

    receiveResult(result: boolean, type: number): void {
        if (result) {
            if (type === typeAction.create) {
                this.visibleCreateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageNews.createSuccess });
            } else if (type === typeAction.update) {
                this.visibleUpdateModal = false;
                this.messageService.add({ severity: 'success', summary: title.success, detail: messageNews.updateSuccess });
            }
            this.getNews();
        } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        }
    }
    
    confirmDelete(event: any, id: string): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn muốn xoá tin tức này chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.newsService.deleteNews(id)
                .pipe(takeUntil(this.subscribes$))
                .subscribe(res => {
                    if (res.success) {
                        this.getNews();
                        this.messageService.add({ severity: 'success', summary: title.success, detail: messageNews.deleteSuccess });
                    }
                });
            },
            reject: () => {
            }
        });
    }

}
