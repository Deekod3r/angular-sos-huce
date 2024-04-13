import { NgModule } from '@angular/core';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordModule } from 'primeng/password';
import { StatisticAdoptModule } from 'src/app/shared/components/statistic-adopt/statistic-adopt.module';

@NgModule({
    declarations: [
        UpdateInfoComponent
    ],
    imports: [
        SharedModule,
        PasswordModule,
        StatisticAdoptModule
    ],
    exports: [
        UpdateInfoComponent,
        SharedModule,
        StatisticAdoptModule
    ]
})
export class AccountModule { }
