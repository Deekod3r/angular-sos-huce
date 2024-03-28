import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    providers: [MessageService, ConfirmationService],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        if(!this.authService.isRemember) {
            //this.authService.logout();
        }
    }

}