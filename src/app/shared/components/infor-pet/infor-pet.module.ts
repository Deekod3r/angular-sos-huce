import { NgModule } from '@angular/core';
import { InforPetComponent } from './infor-pet.component';
import { SharedModule } from '../../shared.module';
import { BadgeModule } from 'primeng/badge';



@NgModule({
    declarations: [
        InforPetComponent
    ],
    imports: [
        SharedModule,
        BadgeModule
    ],
    exports: [
        InforPetComponent
    ]
})
export class InforPetModule { }
