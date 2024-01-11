import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './adopt.component.html',
  styleUrls: ['./adopt.component.css']
})
export class AdoptComponent {

}
