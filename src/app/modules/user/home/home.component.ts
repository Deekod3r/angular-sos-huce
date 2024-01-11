import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GalleriaModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: any[] | undefined;

  responsiveOptions: any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];

  constructor() {}

  ngOnInit() {
    this.images = [
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
        description: 'Description for Image 1',
        title: 'Title 1'
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
        description: 'Description for Image 2',
        title: 'Title 2'
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
        description: 'Description for Image 3',
        title: 'Title 3'
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
        description: 'Description for Image 4',
        title: 'Title 4'
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
        description: 'Description for Image 5',
        title: 'Title 5'
      },
      {
        itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg',
        description: 'Description for Image 6',
        title: 'Title 6'
      }
    ];
  }

}