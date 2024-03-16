import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card-event',
    templateUrl: './card-event.component.html',
    styleUrls: ['./card-event.component.css']
})
export class CardEventComponent {
    @Input() event: any;
    @Input() visibleDetail: boolean = false;
}
