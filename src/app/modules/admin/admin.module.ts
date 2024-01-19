import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PetCreateComponent } from './pet/pet-create/pet-create.component';
import { PetUpdateComponent } from './pet/pet-update/pet-update.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ],
  exports: [
  ]
})
export class AdminModule { }
