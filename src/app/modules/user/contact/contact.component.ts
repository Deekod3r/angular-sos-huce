import { Component } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabViewModule } from 'primeng/tabview';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [SharedModule, InputTextareaModule, TabViewModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {

}
