import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { Subject, takeUntil } from 'rxjs';
import { SYSTEM } from './common/constant';
import { WebsocketService } from './services/web-socket.service';
import { messageUser, title } from './common/message';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private authService: AuthService, private configService: ConfigService, 
        private websocketService: WebsocketService, private messageService: MessageService, private route: Router) {}

    ngOnInit(): void {
        if (!this.authService.isRemember) {
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

        this.websocketService.getMessages()
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (message) => {
                const data = message.body;
                const parts: string[] = data.split(' - ');
                if (parts[0] == "LOGIN") {
                    const id = parts[1];
                    if (id === this.authService.getCurrentUser().id) {
                        this.messageService.add({ severity: 'info', summary: title.info, detail: messageUser.loginInOtherDevice, life: 5000 });
                        this.authService.logout();
                        this.route.navigate(['/dang-nhap']);
                    }
                }
            },
            error: (error) => {
            }
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

}