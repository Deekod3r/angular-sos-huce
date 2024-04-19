import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy  {
    
    contacts!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private configService: ConfigService) {}

    ngOnInit(): void {
        this.configService.contacts.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.contacts = data;
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

}
