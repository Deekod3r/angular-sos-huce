import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel'
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ScrollTopModule } from 'primeng/scrolltop';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { NavbarComponent } from './themes/user/navbar/navbar.component';
import { NavbarAuthComponent } from './themes/auth/navbar-auth/navbar-auth.component';
import { AuthComponent } from './themes/auth/auth.component';
import { UserComponent } from './themes/user/user.component';
import { TopBarComponent } from './shared/components/top-bar/top-bar.component';
import { BottomBarComponent } from './shared/components/bottom-bar/bottom-bar.component';
import { AdminComponent } from './themes/admin/admin.component';
import { NavbarAdminComponent } from './themes/admin/navbar-admin/navbar-admin.component';
import { SidebarAdminComponent } from './themes/admin/sidebar-admin/sidebar-admin.component';
import { MenuAdminComponent } from './themes/admin/menu-admin/menu-admin.component';
import { MenuitemAdminComponent } from './themes/admin/menu-admin/menuitem-admin.component';
import { AccessDeninedComponent } from './modules/errors/access-denined/access-denined.component';
import { NotFoundComponent } from './modules/errors/not-found/not-found.component';
import { SpinnerInterceptor } from './shared/interceptors/spinner-interceptor';
import { AuthenticationInterceptor } from './shared/interceptors/auth-interceptor';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        NavbarAuthComponent,
        AuthComponent,
        UserComponent,
        TopBarComponent,
        BottomBarComponent,
        AdminComponent,
        NavbarAdminComponent,
        SidebarAdminComponent,
        MenuAdminComponent,
        MenuitemAdminComponent,
        AccessDeninedComponent,
        NotFoundComponent
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
        MenuModule,
        ScrollTopModule,
        PanelMenuModule,
        CommonModule,
        SidebarModule,
        RippleModule,
        FormsModule,
        NgxSpinnerModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SpinnerInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true,
        },
    ],    
    bootstrap: [AppComponent]
})
export class AppModule { }
