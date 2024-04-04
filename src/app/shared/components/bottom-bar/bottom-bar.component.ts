import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SYSTEM } from 'src/app/common/constant';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'app-bottom-bar',
    templateUrl: './bottom-bar.component.html',
    styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit, OnDestroy  {
    
    contacts!: any;
    introductions!: any;
    socials!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private configService: ConfigService) { }

    ngOnInit(): void {
        this.getConfigs();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getConfigs(): void {
        this.configService.contacts.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.contacts = data;
        });
        this.configService.introductions.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.introductions = data;
        });
        this.configService.socials.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.socials = data;
        });
    }

}
