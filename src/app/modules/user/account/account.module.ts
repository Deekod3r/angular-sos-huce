import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
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
