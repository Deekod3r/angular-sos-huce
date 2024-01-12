import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GalleriaModule, SharedModule, FieldsetModule],
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
        itemImageSrc: '../../../assets/medias/carousel/carousel-1.jpg',
        thumbnailImageSrc: '../../../assets/medias/carousel/carousel-1.jpg',
        description: 'Description for Image 1 trường đại học xây dựng hà nội 12345 kashdka aldalksdj akdhaskdas',
        title: 'Title 1'
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-2.jpg',
        thumbnailImageSrc: '../../../assets/medias/carousel/carousel-2.jpg',
        description: 'Description for Image 2',
        title: 'Title 2'
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-3.jpg',
        thumbnailImageSrc: '../../../assets/medias/carousel/carousel-3.jpg',
        description: 'Description for Image 3',
        title: 'Title 3'
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-4.jpg',
        thumbnailImageSrc: '../../../assets/medias/carousel/carousel-4.jpg',
        description: 'Description for Image 4',
        title: 'Title 4'
      },
      {
        itemImageSrc: '../../../assets/medias/carousel/carousel-5.jpg',
        thumbnailImageSrc: '../../../assets/medias/carousel/carousel-5.jpg',
        description: 'Description for Image 5',
        title: 'Title 5'
      }
    ];
  }

}