import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-intro',
    standalone: true,
    imports: [SharedModule, FieldsetModule],
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.css']
})
export class IntroComponent {

}
