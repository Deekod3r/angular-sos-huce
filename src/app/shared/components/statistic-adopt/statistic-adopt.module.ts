import {NgModule} from '@angular/core';
import {StatisticAdoptComponent} from './statistic-adopt.component';
import {SharedModule} from '../../shared.module';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {BadgeModule} from 'primeng/badge';


@NgModule({
    declarations: [
        StatisticAdoptComponent
    ],
    imports: [
        SharedModule,
        DialogModule,
        TableModule,
        BadgeModule
    ],
    exports: [
        StatisticAdoptComponent
    ]
})
export class StatisticAdoptModule {
}
