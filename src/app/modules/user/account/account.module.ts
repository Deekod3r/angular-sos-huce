import { NgModule } from '@angular/core';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordModule } from 'primeng/password';

@NgModule({
    declarations: [
        UpdateInfoComponent
    ],
    imports: [
        SharedModule,
        PasswordModule
    ],
    exports: [
        UpdateInfoComponent,
        SharedModule
    ]
})
export class AccountModule { }
