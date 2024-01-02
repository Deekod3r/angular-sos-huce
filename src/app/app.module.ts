import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/students/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { InfoComponent } from './components/students/info/info.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RegisterComponent } from './components/auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InfoComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    CardModule,
    AvatarModule,
    MessagesModule,
    ToastModule,
    TabViewModule,
    MenubarModule,
    ProgressBarModule,
    HttpClientModule,
    TieredMenuModule,
    InputNumberModule,
    DropdownModule,
    MenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
