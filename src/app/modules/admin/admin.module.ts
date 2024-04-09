import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackComponent } from './feedback/feedback.component';

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
