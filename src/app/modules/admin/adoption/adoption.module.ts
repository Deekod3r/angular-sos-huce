import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { AdoptionCreateComponent } from './adoption-create/adoption-create.component';
import { AdoptionUpdateComponent } from './adoption-update/adoption-update.component';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber';

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
    ImageModule,
    CalendarModule,
    BadgeModule,
    InputNumberModule
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
