import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { BadgeModule } from 'primeng/badge';
import { InputNumberModule } from 'primeng/inputnumber';
import { NewMediaCreateComponent } from './new-media-create/new-media-create.component';
import { NewMediaUpdateComponent } from './new-media-update/new-media-update.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [
        NewMediaCreateComponent,
        NewMediaUpdateComponent
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
        EditorModule,
        FileUploadModule
    ],
    exports: [
        SharedModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputTextareaModule,
        NewMediaCreateComponent,
        NewMediaUpdateComponent,
        ConfirmDialogModule
    ]
})
export class NewsMediaModule { }
