import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreatmentCreateComponent } from './treatment-create/treatment-create.component';
import { TreatmentUpdateComponent } from './treatment-update/treatment-update.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';


@NgModule({
    declarations: [
        TreatmentCreateComponent,
        TreatmentUpdateComponent
    ],
    imports: [
        SharedModule,
        FileUploadModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        InputNumberModule,
        ImageModule,
        DialogModule,
        TableModule
    ],
    exports: [
        TreatmentCreateComponent,
        TreatmentUpdateComponent,
        DialogModule,
        SharedModule,
        DropdownModule,
        InputTextareaModule,
        InputNumberModule,
        CalendarModule,
        TableModule
    ]
})
export class TreatmentModule { }
