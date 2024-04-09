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
import { LivingCostCreateComponent } from './living-cost-create/living-cost-create.component';
import { LivingCostUpdateComponent } from './living-cost-update/living-cost-update.component';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [
        LivingCostCreateComponent,
        LivingCostUpdateComponent
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
        FileUploadModule,
        TableModule
    ],
    exports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputTextareaModule,
        LivingCostCreateComponent,
        LivingCostUpdateComponent,
        TableModule,
        ImageModule
    ]
})
export class LivingCostModule { }
