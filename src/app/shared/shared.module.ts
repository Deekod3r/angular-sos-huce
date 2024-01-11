import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagesModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    RouterLink
  ],
  exports: [
    ReactiveFormsModule,
    MessagesModule,
    PanelModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    RouterLink
  ]
})
export class SharedModule { }
