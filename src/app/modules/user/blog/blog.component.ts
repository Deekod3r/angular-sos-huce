import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { Subject, takeUntil } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { CardEventModule } from 'src/app/shared/components/card-event/card-event.module';
import { CardNewsModule } from 'src/app/shared/components/card-news/card-news.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [SharedModule, CardNewsModule, CardEventModule, FieldsetModule],
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, OnDestroy {

    newsCategory!: any[];
    news!: any[];
    category: string = '';
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private newsService: NewsService) { }

    ngOnInit() {
        this.getNews();
        this.newsService.getNewsCategories()
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if (res.success) {
                this.newsCategory = res.data;
            }
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNews() {
        this.newsService.getNews({
            categoryId: this.category
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if (res.success) {
                this.news = res.data;
            }
        });
    }

    setCategory(category: string): void {
        this.category = category;
        this.getNews();
    }

}
