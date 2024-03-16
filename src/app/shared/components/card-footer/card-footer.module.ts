import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { CardFooterComponent } from './card-footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        CardFooterComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule
    ],
    exports: [
        CardFooterComponent
    ]
})
export class CardFooterModule { }
