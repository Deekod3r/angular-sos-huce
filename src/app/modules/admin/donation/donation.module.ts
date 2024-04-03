import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber';
import { DonationCreateComponent } from './donation-create/donation-create.component';
import { DonationUpdateComponent } from './donation-update/donation-update.component';

@NgModule({
    declarations: [
        DonationCreateComponent,
        DonationUpdateComponent
    ],
    imports: [
        SharedModule,
        DialogModule,
        InputTextareaModule,
        DropdownModule,
        AutoCompleteModule,
        ImageModule,
        CalendarModule,
        BadgeModule,
        InputNumberModule,
    ],
    exports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputTextareaModule,
        DonationCreateComponent,
        DonationUpdateComponent,
    ]
})
export class DonationModule { }
