import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Subject, takeUntil } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { convertDateTimeFormat, filteredSearch } from 'src/app/shared/utils/data.util';
import { NewsMediaModule } from './news-media.module';
import { newsConfig, typeAction } from 'src/app/common/constant';
import { title, message, messageNews } from 'src/app/common/message';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [NewsMediaModule, TableModule, TieredMenuModule, TagModule, PaginatorModule],
    templateUrl: './news-media.component.html',
    styleUrls: ['./news-media.component.css']
})
export class NewsMedeiaComponent  implements OnInit, OnDestroy {

    news!: any;
    categories!: any;
    idNewsUpdate!: string;
    visibleCreateModal: boolean = false;
    visibleUpdateModal: boolean = false;
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = newsConfig.search.limitDefault;
    first!: number;
    key = {
        limit: this.limit,
        page: this.currentPage,
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
        this.key.limit = this.limit;
        this.key.page = this.currentPage;
        this.key.fromDate = this.key.fromDateTime ? convertDateTimeFormat(this.key.fromDateTime, true) : this.key.fromDateTime;
        this.key.toDate = this.key.toDateTime ? convertDateTimeFormat(this.key.toDateTime, false) : this.key.toDateTime;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            status: this.key.status != null ? this.key.status : '',
            title: this.key.title ? this.key.title.trim() : '',
            fromDate: this.key.fromDate ? this.key.fromDate : '',
            toDate: this.key.toDate ? this.key.toDate : '',
            categoryId: this.key.categoryId ? this.key.categoryId : ''
        }
        this.newsService.getNews(filteredSearch(search))
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.news = res.data.news;
                    this.totalPages = res.data.totalPages;
                    this.totalElements = res.data.totalElements;
                    this.currentPage = res.data.currentPage;
                    this.first = (this.currentPage - 1) * this.limit;
                    if(this.news.length == 0) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: message.noData });
                    } else {
                        this.news.forEach((item: any) => {
                            item.menuItems = this.getMenuItems(item);
                        });
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

    getNewsCategories(): void {
        this.newsService.getNewsCategories()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.categories = res.data;
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

    getMenuItems(news: any): MenuItem[] {
        return [
            {
                visible: false
            },
            {
                label: 'Chỉnh sửa',
                icon: 'fa fa-edit',
                command: () => {
                    this.onShowUpdateModal(news.id);
                }
            },
            {
                separator: true
            },
            {
                label: 'Xoá',
                icon: 'fa fa-trash',
                command: (event: any) => {
                    this.onConfirmDelete(event, news.id);
                }
            },
        ];
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getNews();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.limit = event.rows;
        this.first = event.first;
        this.getNews();
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.limit = newsConfig.search.limitDefault;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            status: '',
            title: '',
            fromDate: '',
            fromDateTime: '',
            toDate: '',
            toDateTime: '',
            categoryId: ''
        }
        this.getNews();
    }

    onShowCreateModal(): void {
        this.visibleCreateModal = true;
    }

    onShowUpdateModal(id: string): void {
        this.idNewsUpdate = id;
        this.visibleUpdateModal = true;
    }

    onReceiveResult(result: boolean, type: number): void {
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
    
    onConfirmDelete(event: any, id: string): void {
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
                .subscribe({
                    next: (res) => {
                        if (res.success) {
                            this.getNews();
                            this.messageService.add({ severity: 'success', summary: title.success, detail: messageNews.deleteSuccess });
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
