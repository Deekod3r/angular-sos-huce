import { Component, OnDestroy, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';
import { PetService } from 'src/app/services/pet.service';
import { CardPetModule } from 'src/app/shared/components/card-pet/card-pet.module';
import { CarouselModule } from 'primeng/carousel';
import { CardNewsModule } from 'src/app/shared/components/card-news/card-news.module';
import { NewsService } from 'src/app/services/news.service';
import { Subject, takeUntil } from 'rxjs';
import { galleriaConfig, petConfig, systemConfig } from 'src/app/common/constant';
import { GalleriaService } from 'src/app/services/galleria.service';
import { ConfigService } from 'src/app/services/config.service';

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
export class HomeComponent implements OnInit, OnDestroy {

    gallerias!: any[];
    pets!: any[];
    news!: any[];
    statisticCases: any;
    introductions!: any;

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
        private newsService: NewsService,
        private galleriaService: GalleriaService,
        private configService: ConfigService
    ) {}

    ngOnInit() {
        this.subscribeAndGetData();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    subscribeAndGetData() {

        this.galleriaService.getGallerias({
            status: galleriaConfig.statusKey.active
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if (res.success) {
                this.gallerias = res.data;
            }
        });

        this.configService.getConfigs(systemConfig.ORD_INTRODUCTION)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.introductions = res.data.values;
            }
        });

        let petSearch = {
            limit: petConfig.search.limitDefault,
            page: 1,
            status: petConfig.statusKey.waiting,
        };
        this.petService
        .getPets(petSearch)
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if(res.success) {
                this.pets = res.data.pets;
            }
        });

        this.newsService
        .getNews({
            status: 1
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if(res.success) {
                this.news = res.data;
            }
        });
        this.petService
        .getStatisticCases()
        .pipe(takeUntil(this.subscribes$))
        .subscribe((res: any) => {
            if(res.success) {
                this.statisticCases = res.data;
            }
        });
    }
}
