import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { AdoptionCreateComponent } from './adoption-create/adoption-create.component';
import { AdoptionUpdateComponent } from './adoption-update/adoption-update.component';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber';
import { TreatmentPetModule } from 'src/app/shared/components/treatment-pet/treatment-pet.module';

@NgModule({
    declarations: [
        AdoptionCreateComponent,
        AdoptionUpdateComponent
    ],
    imports: [
        SharedModule,
        DialogModule,
        InputTextareaModule,
        DropdownModule,
        AutoCompleteModule,
        CalendarModule,
        BadgeModule,
        InputNumberModule,
        TreatmentPetModule
    ],
    exports: [
        SharedModule,
        DialogModule,
        CalendarModule,
        AdoptionCreateComponent,
        AdoptionUpdateComponent,
        InputTextareaModule
    ]
})
export class AdoptionModule { }
