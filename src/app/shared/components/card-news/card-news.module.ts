import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';

import {CardNewsComponent} from './card-news.component';
import {RouterModule} from '@angular/router';
import {DividerModule} from 'primeng/divider';

@NgModule({
    declarations: [
        CardNewsComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule,
        DividerModule
    ],
    exports: [
        CardNewsComponent
    ]
})
export class CardNewsModule {
}
