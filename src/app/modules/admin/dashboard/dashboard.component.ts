import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

}
