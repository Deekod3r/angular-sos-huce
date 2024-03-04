import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';
import { PetService } from 'src/app/services/pet.service';
import { CardPetModule } from 'src/app/shared/components/card-pet/card-pet.module';
import { CarouselModule } from 'primeng/carousel';
import { CardNewsModule } from 'src/app/shared/components/card-news/card-news.module';
import { NewsService } from 'src/app/services/news.service';
import { Subject, takeUntil } from 'rxjs';
import { petSearch, petStatusKey } from 'src/app/common/constant';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GalleriaModule,
    SharedModule,
    FieldsetModule,
    CardPetModule,
    CarouselModule,
    CardNewsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images: any[] | undefined;
  pets!: any[];
  news!: any[];
  statisticCases: any;

  private subscribes$: Subject<void> = new Subject<void>();

  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    public petService: PetService,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.images = [
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-1.jpg',
        description: 'Description for Image 1',
        title: 'Title 1',
        url: 'https://www.google.com',
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-2.jpg',
        description: 'Description for Image 2',
        title: 'Title 2',
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-3.jpg',
        description: 'Description for Image 3',
        title: 'Title 3',
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-4.jpg',
        description: 'Description for Image 4',
        title: 'Title 4',
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-5.jpg',
        description: 'Description for Image 5',
        title: 'Title 5',
      },
    ];
    this.subscribeAndGetData();
  }

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  subscribeAndGetData() {
    let petSearchKey = {
      limit: petSearch.limitDefault,
      page: 1,
      status: petStatusKey.waiting.toString(),
    };
    this.petService
      .getPets(petSearchKey)
      .pipe(takeUntil(this.subscribes$))
      .subscribe((res: any) => {
        if (res.success) {
          this.pets = res.data.pets;
        }
      });

    this.newsService
      .getNews()
      .pipe(takeUntil(this.subscribes$))
      .subscribe((news: any) => {
        this.news = news;
      });

    this.petService
      .getStatisticCases()
      .pipe(takeUntil(this.subscribes$))
      .subscribe((statisticCases: any) => {
        this.statisticCases = statisticCases;
      });
  }
}
