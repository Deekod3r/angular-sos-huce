import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { systemConfig } from 'src/app/common/constant';
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
        this.configService.getConfigs(systemConfig.ORG_INFO_CONTACT)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.contacts = res.data.values;
            }
        });
        this.configService.getConfigs(systemConfig.ORD_INTRODUCTION)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.introductions = res.data.values;
            }
        });
        this.configService.getConfigs(systemConfig.ORG_INFO_SOCIAL)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.socials = res.data.values;
            }
        });
    }

}
