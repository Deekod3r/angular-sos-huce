import { NgModule } from '@angular/core';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { TreatmentPetModule } from 'src/app/shared/components/treatment-pet/treatment-pet.module';

@NgModule({
    declarations: [
        PetCreateComponent,
        PetUpdateComponent
    ],
    imports: [
        SharedModule,
        FileUploadModule,
        DialogModule,
        InputTextareaModule,
        DropdownModule,
        AutoCompleteModule,
        ImageModule,
        CalendarModule,
        InputNumberModule,
        TreatmentPetModule
    ],
    exports: [
        PetCreateComponent,
        PetUpdateComponent,        
        SharedModule,
        DialogModule,
    ]
})
export class PetModule { }
