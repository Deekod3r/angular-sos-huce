import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
    selector: 'app-navbar-admin',
    templateUrl: './navbar-admin.component.html',
    styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService) { }

}

