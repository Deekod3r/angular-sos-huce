import { Component, OnInit } from '@angular/core';
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
export class BlogComponent implements OnInit {

  newsCategory!: any[];
  news!: any[];
  private subscribes$: Subject<void> = new Subject<void>();

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsService.getNews().pipe(takeUntil(this.subscribes$)).subscribe((res: any) => {
      // if (res.success) {
      //   this.news = res.data;
      // }
      this.news = res;
    });
    this.newsService.getNewsCategory().pipe(takeUntil(this.subscribes$)).subscribe((res: any) => {
      // if (res.success) {
      //   this.newsCategory = res.data;
      // }
      this.newsCategory = res;
    });
  }

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

}
