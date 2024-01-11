import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    ReactiveFormsModule,
    MessagesModule,
    PanelModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    DividerModule
  ]
})
export class SharedModule { }
