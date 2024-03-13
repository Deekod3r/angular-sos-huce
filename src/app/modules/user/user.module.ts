import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SponsorComponent } from './donate/sponsor/sponsor.component';
import { NewsComponent } from './blog/news/news.component';
import { UpdateInfoComponent } from './account/update-info/update-info.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
  ]
})
export class UserModule { }
