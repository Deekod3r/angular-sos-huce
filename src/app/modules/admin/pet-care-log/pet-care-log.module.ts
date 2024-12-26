import {NgModule} from "@angular/core";
import {AutoCompleteModule} from "primeng/autocomplete";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SharedModule} from "src/app/shared/shared.module";
import {PetCareLogCreateComponent} from './pet-care-log-create/pet-care-log-create.component';
import {PetCareLogUpdateComponent} from './pet-care-log-update/pet-care-log-update.component';
import {StyleClassModule} from "primeng/styleclass";

@NgModule({
    declarations: [
        PetCareLogCreateComponent,
        PetCareLogUpdateComponent
    ],
    imports: [
        SharedModule,
        DialogModule,
        InputTextareaModule,
        DropdownModule,
        AutoCompleteModule,
        CalendarModule,
        StyleClassModule,
    ],
    exports: [
        SharedModule,
        DialogModule,
        InputTextareaModule,
        DropdownModule,
        AutoCompleteModule,
        CalendarModule,
        PetCareLogCreateComponent,
        PetCareLogUpdateComponent,
    ]
})
export class PetCareLogModule {
}
