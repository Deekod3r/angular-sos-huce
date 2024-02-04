import { Routes } from '@angular/router';
import { AuthComponent } from '../themes/auth/auth.component';
import { UserComponent } from '../themes/user/user.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminComponent } from '../themes/admin/admin.component';
import { PermissionGuard } from '../guards/permission.guard';
import { DashboardComponent } from '../modules/admin/dashboard/dashboard.component';
import { PetComponent } from '../modules/admin/pet/pet.component';
import { LoginComponent } from '../modules/auth/login/login.component';
import { RegisterComponent } from '../modules/auth/register/register.component';
import { VerifyComponent } from '../modules/auth/verify/verify.component';
import { AdoptComponent } from '../modules/user/adopt/adopt.component';
import { BlogComponent } from '../modules/user/blog/blog.component';
import { DonateComponent } from '../modules/user/donate/donate.component';
import { HomeComponent } from '../modules/user/home/home.component';
import { IntroComponent } from '../modules/user/intro/intro.component';
import { SupportComponent } from '../modules/user/support/support.component';
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
    path: 'auth',
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
      { path: 'access-denined', component: AccessDeninedComponent },
      { path: 'not-found', component: NotFoundComponent }
    ]
  },
  { path: '**', redirectTo: CONFIG.KEY.ROOT_PAGE, pathMatch: 'full' },
];

export let ROUTES_AUTH: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify/:id', component: VerifyComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent}
];

export let ROUTES_USER: Routes = [
  { path: '', component: HomeComponent },
  { path: 'adopt', component: AdoptComponent },
  { path: 'adopt/all', component: AdoptAllComponent },
  { path: 'adopt/:id', component: AdoptPetComponent},
  { path: 'blog', component: BlogComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'support', component: SupportComponent },
];

export let ROUTES_ADMIN: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pets', component: PetComponent },
];
