import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { Subject, takeUntil } from 'rxjs';
import { SYSTEM } from './common/constant';

@Component({
    selector: 'app-root',
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private authService: AuthService, private configService: ConfigService) {}

    ngOnInit(): void {
        if(!this.authService.isRemember) {
            //this.authService.logout();
        }
        this.configService.getConfigs(SYSTEM.ORG_INFO_CONTACT)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.contacts.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.ORG_INFO_SOCIAL)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.socials.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.ORD_INTRODUCTION)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.introductions.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.ADOPT_PROCESS)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.adoptProcess.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.ADOPT_CONDITON)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.adoptConditions.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.DONATE)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.donates.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.VOLUNTEER_CONDITION)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.volunteerConditions.next(res.data.values);
            }
        });
        this.configService.getConfigs(SYSTEM.VOLUNTEER_INTRODUCTION)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.configService.volunteerIntroduction.next(res.data.values);
            }
        });

    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

}