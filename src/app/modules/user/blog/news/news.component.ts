import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NewsService } from 'src/app/services/news.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {

    id!: string;
    news!: any;
    private subscribes$: Subject<void> = new Subject<void>();
    constructor(public newService: NewsService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.subscribes$)).subscribe(params => {
            this.id = params['id'];
            this.getNews();
        });
    }
    
    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getNews() {
        this.newService.getNewsById(this.id)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.news = res.data;
            }
        });
    }

}
