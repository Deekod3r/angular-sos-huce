import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-card-news',
    templateUrl: './card-news.component.html',
    styleUrls: ['./card-news.component.css']
})
export class CardNewsComponent {
    @Input() news: any;
    @Input() visibleDetail: boolean = false;
}
