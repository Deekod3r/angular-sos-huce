import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {FieldsetModule} from 'primeng/fieldset';
import {Subject, takeUntil} from 'rxjs';
import {ConfigService} from 'src/app/services/config.service';

@Component({
    selector: 'app-intro',
    standalone: true,
    imports: [SharedModule, FieldsetModule],
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit, OnDestroy {

    introductions: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.configService.introductions.asObservable()
            .pipe(takeUntil(this.subscribes$))
            .subscribe(data => {
                this.introductions = data;
            });
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

}
