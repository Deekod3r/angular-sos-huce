import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';
import { CardPetModule } from 'src/app/shared/components/card-pet/card-pet.module';
import { PetService } from 'src/app/services/pet.service';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { petSearch, petStatusKey } from 'src/app/common/constant';
import { CarouselModule } from 'primeng/carousel';
import { ActivatedRoute } from '@angular/router';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [SharedModule, FieldsetModule, CardPetModule, DropdownModule, PaginatorModule, CarouselModule, BadgeModule],
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent implements OnInit {

  id!: string;
  pet: any;
  pets: any[] = [];
  responsiveOptions = [
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '991px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  private subscribes$: Subject<void> = new Subject<void>();


  constructor(public petService: PetService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.subscribes$)).subscribe(params => {
      this.id = params['id'];
      this.getPet();
      this.getPets();
    });
  }
  

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  getPet(): void {
    this.petService.getPetById(this.id).pipe(takeUntil(this.subscribes$)).subscribe(data => {
      console.log(data)
      this.pet = data;
    });
  }

  getPets(): void {
    let petSearchKey = {
      limit: petSearch.limitDefault,
      page: 1,
      status: petStatusKey.waiting.toString()
    };
    this.petService.getPets(petSearchKey).pipe(takeUntil(this.subscribes$)).subscribe(data => {
      this.pets = data.pets;
    });
  }

  getBadgeSeverity(info: number) {
    switch (info) {
      case 0:
        return 'danger';
      case 1:
        return 'success';
      case 2:
        return 'warning';
      case 3:
        return 'info';
      default:
        return 'info';
    }
  }

  getBadgeValue(info: number) {
    switch (info) {
      case 0:
        return '✗';
      case 1:
        return '✓';
      case 2:
        return '?';
      default:
        return '?';
    }
  }

}
