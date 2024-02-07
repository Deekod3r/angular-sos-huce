import { Component } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SharedModule, InputTextareaModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

}
