import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {FieldsetModule} from 'primeng/fieldset';
import {PaginatorModule} from 'primeng/paginator';
import {Subject, takeUntil} from 'rxjs';
import {NEWS} from 'src/app/common/constant';
import {message, title} from 'src/app/common/message';
import {NewsService} from 'src/app/services/news.service';
import {CardEventModule} from 'src/app/shared/components/card-event/card-event.module';
import {CardNewsModule} from 'src/app/shared/components/card-news/card-news.module';
import {SharedModule} from 'src/app/shared/shared.module';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [SharedModule, CardNewsModule, CardEventModule, FieldsetModule, PaginatorModule],
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {

    categories!: any[];
    news!: any[];
    category: string = '';
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = NEWS.SEARCH.LIMIT_DEFAULT_CLIENT;
    first!: number;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private newsService: NewsService, private messageService: MessageService) {
    }

    ngOnInit() {
        this.getNews();
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
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNews() {
        this.newsService.getNews({
            categoryId: this.category,
            limit: this.limit,
            page: this.currentPage
        })
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.totalPages = res.data.totalPages;
                        this.totalElements = res.data.totalElements;
                        this.currentPage = res.data.currentPage;
                        this.first = (this.currentPage - 1) * this.limit;
                        this.news = res.data.news;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    onSearch(category: string): void {
        this.currentPage = 1;
        this.first = 0;
        this.category = category;
        this.getNews();
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.first = event.first;
        this.getNews();
    }

}
