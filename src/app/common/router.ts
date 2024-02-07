import { Routes } from '@angular/router';
import { AuthComponent } from '../themes/auth/auth.component';
import { UserComponent } from '../themes/user/user.component';
import { AdminComponent } from '../themes/admin/admin.component';
import { PermissionGuard } from '../guards/permission.guard';
import { DashboardComponent } from '../modules/admin/dashboard/dashboard.component';
import { PetComponent } from '../modules/admin/pet/pet.component';
import { LoginComponent } from '../modules/auth/login/login.component';
import { RegisterComponent } from '../modules/auth/register/register.component';
import { AdoptComponent } from '../modules/user/adopt/adopt.component';
import { BlogComponent } from '../modules/user/blog/blog.component';
import { DonateComponent } from '../modules/user/donate/donate.component';
import { HomeComponent } from '../modules/user/home/home.component';
import { IntroComponent } from '../modules/user/intro/intro.component';
import { ContactComponent } from '../modules/user/contact/contact.component';
import { AccessDeninedComponent } from '../modules/errors/access-denined/access-denined.component';
import { NotFoundComponent } from '../modules/errors/not-found/not-found.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { CONFIG } from './config';
import { AdoptAllComponent } from '../modules/user/adopt/adopt-all/adopt-all.component';
import { AdoptPetComponent } from '../modules/user/adopt/adopt-pet/adopt-pet.component';
import { ForgotPasswordComponent } from '../modules/auth/forgot-password/forgot-password.component';

export let ROUTES_ROOT: Routes = [
  {
    path: CONFIG.KEY.ROOT_PAGE,
    component: UserComponent,
    canActivate: [PermissionGuard],
    data: { expectedRole: ["USER"] },
    loadChildren: () => import('../modules/user/user.module').then((m) => m.UserModule)
  },
  {
    path: CONFIG.KEY.ROOT_PAGE,
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    loadChildren: () => import('../modules/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [PermissionGuard],
    data: { expectedRole: ["ADMIN", "MANAGER"] },
    loadChildren: () => import('../modules/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'error',
    children: [
      { path: '403', component: AccessDeninedComponent },
      { path: '404', component: NotFoundComponent }
    ]
  },
  { path: '**', redirectTo: CONFIG.KEY.ROOT_PAGE, pathMatch: 'full' },
];

export let ROUTES_AUTH: Routes = [
  { path: 'dang-nhap', component: LoginComponent },
  { path: 'dang-ky', component: RegisterComponent },
  { path: 'quen-mat-khau', component: ForgotPasswordComponent}
];

export let ROUTES_USER: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cuu-tro', component: AdoptComponent },
  { path: 'cuu-tro/tat-ca', component: AdoptAllComponent },
  { path: 'cuu-tro/:id', component: AdoptPetComponent},
  { path: 'tin-tuc', component: BlogComponent },
  { path: 'ung-ho', component: DonateComponent },
  { path: 'gioi-thieu', component: IntroComponent },
  { path: 'lien-he', component: ContactComponent },
];

export let ROUTES_ADMIN: Routes = [
  { path: 'trang-chu', component: DashboardComponent },
  { path: 'thu-cung', component: PetComponent },
];
