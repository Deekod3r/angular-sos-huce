import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessagesModule} from 'primeng/messages';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {CardFooterModule} from './components/card-footer/card-footer.module';
import {ToastModule} from 'primeng/toast';

@NgModule({
    declarations: [],
    imports: [
        RouterLink
    ],
    exports: [
        ReactiveFormsModule,
        MessagesModule,
        PanelModule,
        CommonModule,
        InputTextModule,
        ButtonModule,
        RouterLink,
        DividerModule,
        CardModule,
        CardFooterModule,
        ToastModule,
        FormsModule
    ]
})
export class SharedModule {
}
