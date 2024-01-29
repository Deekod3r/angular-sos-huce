import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  templateUrl: './card-footer.component.html',
  styleUrls: ['./card-footer.component.css']
})
export class CardFooterComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() action!: string;
  @Input() actionLink!: string;
}
