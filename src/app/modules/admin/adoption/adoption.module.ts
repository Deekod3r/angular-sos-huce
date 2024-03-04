import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    InputTextareaModule,
    DropdownModule,
    AutoCompleteModule,
    ImageModule
  ],
  exports: [
    SharedModule,
    DialogModule,
  ]
})
export class AdoptionModule { }
