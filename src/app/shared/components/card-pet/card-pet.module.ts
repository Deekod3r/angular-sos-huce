import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { CardPetComponent } from './card-pet.component';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [
    CardPetComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    DividerModule
  ],
  exports: [
    CardPetComponent
  ]
})
export class CardPetModule { }
