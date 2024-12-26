import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {CardEventComponent} from './card-event.component';

@NgModule({
    declarations: [
        CardEventComponent,
    ],
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule,
        DividerModule
    ],
    exports: [
        CardEventComponent
    ]
})
export class CardEventModule {
}
