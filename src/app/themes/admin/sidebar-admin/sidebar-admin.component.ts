import {Component, ElementRef} from '@angular/core';
import {LayoutService} from 'src/app/services/layout.service';

@Component({
    selector: 'app-sidebar-admin',
    templateUrl: './sidebar-admin.component.html',
    styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent {

    constructor(public layoutService: LayoutService, public el: ElementRef) {
    }

}
