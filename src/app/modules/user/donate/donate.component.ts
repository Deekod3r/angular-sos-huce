import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [SharedModule, FieldsetModule],
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent {

}
