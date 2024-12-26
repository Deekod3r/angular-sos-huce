import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdoptProcessComponent} from './adopt-process.component';
import {FieldsetModule} from 'primeng/fieldset';
import {PanelModule} from 'primeng/panel';

@NgModule({
    declarations: [
        AdoptProcessComponent
    ],
    imports: [
        CommonModule,
        FieldsetModule,
        PanelModule
    ],
    exports: [
        AdoptProcessComponent
    ]
})
export class AdoptProcessModule {
}
