import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {FieldsetModule} from 'primeng/fieldset';
import {CardPetModule} from 'src/app/shared/components/card-pet/card-pet.module';
import {PetService} from 'src/app/services/pet.service';
import {DropdownModule} from 'primeng/dropdown';
import {Subject, takeUntil} from 'rxjs';
import {PaginatorModule} from 'primeng/paginator';
import {PET} from 'src/app/common/constant';
import {CarouselModule} from 'primeng/carousel';
import {ActivatedRoute} from '@angular/router';
import {BadgeModule} from 'primeng/badge';
import {ImageModule} from 'primeng/image';
import {DialogModule} from 'primeng/dialog';
import {LocationService} from 'src/app/services/location.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';
import {noWhitespaceValidator} from 'src/app/shared/utils/string.util';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmationService, MessageService} from 'primeng/api';
import {message, messageAdopt, title} from 'src/app/common/message';
import {AdoptService} from 'src/app/services/adopt.service';
import {TreatmentPetModule} from 'src/app/shared/components/treatment-pet/treatment-pet.module';
import {AdoptProcessModule} from 'src/app/shared/components/adopt-process/adopt-process.module';

@Component({
    selector: 'app-adopt',
    standalone: true,
    imports: [SharedModule, FieldsetModule, CardPetModule,
        DropdownModule, PaginatorModule, CarouselModule, AdoptProcessModule,
        BadgeModule, ImageModule, DialogModule, CheckboxModule, TreatmentPetModule],
    templateUrl: './adopt-pet.component.html',
    styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent implements OnInit, OnDestroy {

    visibleCreateModal: boolean = false;
    alertRequiredLogin: boolean = false;
    id!: string;
    pet: any;
    pets: any[] = [];
    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    treatments: any;
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
                private locationService: LocationService, public authService: AuthService, private elementRef: ElementRef,
                private messageService: MessageService, private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.formAdopt = new FormGroup({
            province: new FormControl(null, Validators.required),
            district: new FormControl(null, Validators.required),
            ward: new FormControl(null, Validators.required),
            address: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            reason: new FormControl('', [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            confirm: new FormControl(false, Validators.requiredTrue)
        });
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
        this.petService.getPetById(this.id)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.pet = res.data;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    getPets(): void {
        let petSearchKey = {
            limit: PET.SEARCH.LIMIT_DEFAULT,
            page: 1,
            status: PET.STATUS_KEY.WAITING.toString()
        };
        this.petService.getPets(petSearchKey)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        this.pets = res.data.pets;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    onShowCreateModal(): void {
        if (this.authService.isAuthenticated()) {
            this.visibleCreateModal = true;
            if (this.provinces.length == 0 || this.provinces == null) {
                this.getProvinces();
            }
            if (!this.userInfo) {
                this.userInfo = this.authService.getCurrentUser();
            }
        } else {
            this.alertRequiredLogin = true;
        }
    }

    getProvinces(): void {
        this.locationService.getProvinces()
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.provinces = res;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    getDistricts(): void {
        this.locationService.getDistricts(this.formAdopt.value.province)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.districts = res;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    getWards(): void {
        this.locationService.getWards(this.formAdopt.value.district)
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.wards = res;
                    }
                },
                error: (res) => {
                    if (res.error) {
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

    onRegisterAdopt(event: any): void {
        if (!this.formAdopt.valid) {
            this.formAdopt.markAllAsTouched();
            const firstInvalidControl = this.findFirstInvalidControl();
            if (firstInvalidControl) {
                firstInvalidControl.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            return;
        }
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Bạn chắc chắn đã đọc đầy đủ các điều khoản, lưu ý và thông tin của thú cưng chứ?',
            header: 'XÁC NHẬN',
            icon: 'fa fa-solid fa-triangle-exclamation',
            acceptLabel: 'Có',
            rejectLabel: 'Hủy',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                let body = {
                    petId: this.id,
                    provinceId: this.formAdopt.value.province,
                    districtId: this.formAdopt.value.district,
                    wardId: this.formAdopt.value.ward,
                    address: this.formAdopt.value.address.trim(),
                    reason: this.formAdopt.value.reason.trim(),
                    registeredBy: this.userInfo.id
                };
                this.adoptService.createAdopt(body)
                    .pipe(takeUntil(this.subscribes$))
                    .subscribe({
                        next: (res) => {
                            if (res.success) {
                                this.visibleCreateModal = false;
                                this.formAdopt.reset();
                                this.messageService.add({
                                    severity: 'success',
                                    summary: title.success,
                                    detail: messageAdopt.createSuccess,
                                    life: 5000
                                });
                            }
                        },
                        error: (res) => {
                            if (res.error) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: res.error.message
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: title.error,
                                    detail: message.error
                                });
                            }
                        }
                    });
            },
            reject: () => {
            }
        });
    }

    findFirstInvalidControl(): any {
        const invalidControls = Object.keys(this.formAdopt.controls).filter(controlName => this.formAdopt.controls[controlName].invalid);
        if (invalidControls.length > 0) {
            const firstInvalidControlName = invalidControls[0];
            const firstInvalidControl = this.elementRef.nativeElement.querySelector(`[formControlName="${firstInvalidControlName}"]`);
            if (firstInvalidControl) {
                return firstInvalidControl;
            }
        }
        return null;
    }

}
