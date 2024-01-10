import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel'
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';

import { AppComponent } from './app.component';
import { NavbarComponent } from './themes/user/navbar/navbar.component';
import { FooterComponent } from './themes/user/footer/footer.component';
import { NavbarAuthComponent } from './themes/auth/navbar-auth/navbar-auth.component';
import { AuthComponent } from './themes/auth/auth.component';
import { UserComponent } from './themes/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    NavbarAuthComponent,
    AuthComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    AvatarModule,
    MenubarModule,
    TieredMenuModule,
    DropdownModule,
    MenuModule
  ],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
