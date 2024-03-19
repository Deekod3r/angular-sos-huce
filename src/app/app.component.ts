import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

}