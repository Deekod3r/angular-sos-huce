import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';

@Component({
    selector: 'app-adopt-process',
    templateUrl: './adopt-process.component.html',
    styleUrls: ['./adopt-process.component.css']
})
export class AdoptProcessComponent implements OnInit, OnDestroy {

    adoptConditions: any;
    adoptProcess: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private configService: ConfigService) { }

    ngOnInit(): void {
        this.configService.adoptConditions.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.adoptConditions = data;
        });
        this.configService.adoptProcess.asObservable()
        .pipe(takeUntil(this.subscribes$))
        .subscribe(data => {
            this.adoptProcess = data;
        });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }
}
