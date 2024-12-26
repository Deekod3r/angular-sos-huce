import { NgModule } from '@angular/core';
import { InfoPetComponent } from './info-pet.component';
import { SharedModule } from '../../shared.module';
import { BadgeModule } from 'primeng/badge';



@NgModule({
    declarations: [
        InfoPetComponent
    ],
    imports: [
        SharedModule,
        BadgeModule
    ],
    exports: [
        InfoPetComponent
    ]
})
export class InforPetModule { }
