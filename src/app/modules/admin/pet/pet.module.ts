import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetCreateComponent } from './pet-create/pet-create.component';
import { PetUpdateComponent } from './pet-update/pet-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    PetCreateComponent,
    PetUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    DialogModule,
    InputTextareaModule,
    DropdownModule,
    AutoCompleteModule,
    ImageModule,
    CalendarModule
  ],
  exports: [
    PetCreateComponent,
    PetUpdateComponent,    
    SharedModule,
    DialogModule,
  ]
})
export class PetModule { }
