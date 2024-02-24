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
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { LocationService } from 'src/app/services/location.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { message, messagePet, title } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { responseCodeCommon, responseCodeAuth } from 'src/app/common/response';

@Component({
  selector: 'app-adopt',
  standalone: true,
  providers: [MessageService],
  imports: [SharedModule, FieldsetModule, CardPetModule, DropdownModule, PaginatorModule, CarouselModule, BadgeModule, ImageModule, DialogModule, CheckboxModule],
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent implements OnInit {

  visibleCreateModal: boolean = false;
  id!: string;
  pet: any;
  pets: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  formAdopt!: FormGroup;
  userInfo!: any;
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


  constructor(public petService: PetService, private route: ActivatedRoute, private adoptService: AdoptService,  
    private locationService: LocationService, private authService: AuthService, private messageService: MessageService) { }

  ngOnInit() {
    this.formAdopt = new FormGroup({
      province: new FormControl(null, Validators.required),
      district: new FormControl(null, Validators.required),
      ward: new FormControl(null, Validators.required),
      address: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
      confirm: new FormControl(false, Validators.requiredTrue)
    });
    this.route.params.pipe(takeUntil(this.subscribes$)).subscribe(params => {
      this.id = params['id'];
      this.getPet();
      this.getPets();
    });
    this.getProvinces();
  }
  
  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  getPet(): void {
    this.petService.getPetById(this.id)
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res.success) {
        this.pet = res.data;
      }
    });
  }

  getPets(): void {
    let petSearchKey = {
      limit: petSearch.limitDefault,
      page: 1,
      status: petStatusKey.waiting.toString()
    };
    this.petService.getPets(petSearchKey)
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res.success) {
        this.pets = res.data.pets;
      }
    });
  }

  showCreateModal(): void {
    if (this.authService.isAuthenticated()) {
      this.visibleCreateModal = true;
      if(!this.userInfo) {
        this.userInfo = this.authService.getInfoUser();
      }
    } else {
      alert('Bạn cần đăng nhập để đăng ký nhận nuôi thú cưng');
      window.location.href = '/dang-nhap';
    }
  }

  getProvinces(): void {
    this.locationService.getPronvinces()
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res) {
        this.provinces = res;
      }
    });
  }

  getDistricts(): void {
    this.locationService.getDistricts(this.formAdopt.value.province)
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res) {
        this.districts = res;
      }
    });
  }

  getWards(): void {
    this.locationService.getWards(this.formAdopt.value.district)
    .pipe(takeUntil(this.subscribes$))
    .subscribe(res => {
      if (res) {
        this.wards = res;
      }
    });
  }

  onRegisterAdopt(): void {
    if (this.formAdopt.valid) {
      let adopt = {
        petId: this.id,
        province: this.formAdopt.value.province,
        district: this.formAdopt.value.district,
        ward: this.formAdopt.value.ward,
        address: this.formAdopt.value.address
      };
      this.adoptService.createAdopt(adopt)
      .pipe(takeUntil(this.subscribes$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.visibleCreateModal = false;
            this.formAdopt.reset();
            this.messageService.add({severity:'success', summary: title.success, detail: messagePet.createAdoptRegisterSuccess});
          }
        },
        error: (res) => {
          if (res.error) {
            let error = res.error.error;
            if (error.code == responseCodeCommon.invalid) {
              this.messageService.add({ severity: 'error', summary: title.error, detail: message.invalidInput });
            } else if (error.code == responseCodeAuth.permissionDenied){
              this.messageService.add({ severity: 'error', summary: title.error, detail: message.noPermission });
            } else {
              this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
          }
        }
      });
    }
  }
}
