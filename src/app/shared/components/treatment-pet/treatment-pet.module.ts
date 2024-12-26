import {NgModule} from '@angular/core';
import {TreatmentPetComponent} from './treatment-pet.component';
import {SharedModule} from '../../shared.module';
import {TableModule} from 'primeng/table';


@NgModule({
    declarations: [
        TreatmentPetComponent
    ],
    imports: [
        SharedModule,
        TableModule
    ],
    exports: [
        TreatmentPetComponent
    ]
})
export class TreatmentPetModule {
}
