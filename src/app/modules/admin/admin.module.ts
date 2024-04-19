import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatisticExpenseComponent } from './statistic-expense/statistic-expense.component';

@NgModule({
    declarations: [
    ],
    imports: [
        AdminRoutingModule,
        SharedModule,
    ],
    exports: [
    ]
})
export class AdminModule { }
