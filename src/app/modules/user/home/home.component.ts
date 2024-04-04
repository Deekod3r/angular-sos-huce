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
import { PET } from 'src/app/common/constant';
import { GalleriaService } from 'src/app/services/galleria.service';
import { ConfigService } from 'src/app/services/config.service';
import { title, message } from 'src/app/common/message';
import { MessageService } from 'primeng/api';

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
        private configService: ConfigService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.subscribeAndGetData();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    subscribeAndGetData() {
        this.galleriaService.getGallerias({})
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.gallerias = res.data;
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

        this.configService.introductions.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.introductions = data;
        });

        this.petService.getStatisticCases()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if(res.success) {
                    this.statisticCases = res.data;
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

        this.petService.getPets({
            limit: PET.SEARCH.LIMIT_DEFAULT,
            page: 1,
            status: PET.STATUS_KEY.WAITING
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if(res.success) {
                    this.pets = res.data.pets;
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

        this.newsService.getNews({
            limit: 5,
            page: 1
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if(res.success) {
                    this.news = res.data.news;
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
}
