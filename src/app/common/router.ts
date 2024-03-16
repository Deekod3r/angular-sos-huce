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
import { AccountComponent } from '../modules/user/account/account.component';
import { AdoptionComponent } from '../modules/admin/adoption/adoption.component';
import { SponsorComponent } from '../modules/user/donate/sponsor/sponsor.component';
import { NewsComponent } from '../modules/user/blog/news/news.component';
import { PetCareLogComponent } from '../modules/admin/pet-care-log/pet-care-log.component';
import { DonationComponent } from '../modules/admin/donation/donation.component';
import { LivingCostComponent } from '../modules/admin/living-cost/living-cost.component';
import { BankComponent } from '../modules/admin/bank/bank.component';
import { NewsMedeiaComponent } from '../modules/admin/news-media/news-media.component';
import { NewsCategoryComponent } from '../modules/admin/news-category/news-category.component';
import { UsersComponent } from '../modules/admin/users/users.component';
import { GalleriaComponent } from '../modules/admin/galleria/galleria.component';
import { ConfigComponent } from '../modules/admin/config/config.component';
import { AdminsComponent } from '../modules/admin/admins/admins.component';

export let ROUTES_ROOT: Routes = [
    {
        path: CONFIG.KEY.ROOT_PAGE,
        component: UserComponent,
        canActivate: [PermissionGuard],
        data: { expectedRole: ["GUEST", "USER"] },
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
    { path: 'tin-tuc/:id', component: NewsComponent},
    { path: 'ung-ho', component: DonateComponent },
    { path: 'danh-sach-ung-ho', component: SponsorComponent },
    { path: 'gioi-thieu', component: IntroComponent },
    { path: 'lien-he', component: ContactComponent },
    { 
        path: 'tai-khoan',
        canActivate: [PermissionGuard],
        data: { expectedRole: ["USER"] },
        component: AccountComponent 
    }
];

export let ROUTES_ADMIN: Routes = [
    { path: 'trang-chu', component: DashboardComponent },
    { path: 'thu-cung', component: PetComponent },
    { path: 'don-nhan-nuoi', component: AdoptionComponent },
    { path: 'kiem-tra-sau-nhan-nuoi', component: PetCareLogComponent},
    { path: 'ung-ho', component: DonationComponent },
    { path: 'chi-tieu', component: LivingCostComponent },
    { path: 'tai-khoan-ung-ho', component: BankComponent },
    { path: 'tin-tuc', component: NewsMedeiaComponent },
    { path: 'danh-muc-tin-tuc', component: NewsCategoryComponent },
    { path: 'nguoi-dung', component: UsersComponent },
    { path: 'quan-tri-vien', component: AdminsComponent },
    { path: 'galleria', component: GalleriaComponent },
    { path: 'cau-hinh', component: ConfigComponent },
    { path: '', redirectTo: 'trang-chu', pathMatch: 'full'}
];
