import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CONFIG } from 'src/app/common/config';
import { petConfig } from 'src/app/common/constant';
import { title, message } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { PetService } from 'src/app/services/pet.service';
import { UserService } from 'src/app/services/user.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-adoption-create',
    templateUrl: './adoption-create.component.html',
    styleUrls: ['./adoption-create.component.css']
})
export class AdoptionCreateComponent implements OnInit, OnDestroy {

    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;

    formAdopt!: FormGroup;
    users: any[] = [];
    pets: any[] = [];
    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private adoptService: AdoptService,    
        private locationService: LocationService, private messageService: MessageService, private userService: UserService) { }

    ngOnInit(): void {
        this.formAdopt = new FormGroup({
            province: new FormControl(null, Validators.required),
            district: new FormControl(null, Validators.required),
            ward: new FormControl(null, Validators.required),
            address: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            reason: new FormControl(null, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
            petAdopt: new FormControl(null, Validators.required),
            registeredBy: new FormControl(null, Validators.required),
        });
        this.getUsers();
        this.getPets();
        this.getProvinces();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }
    
    getUsers(): void {
        this.userService.getUsers({
            isActivated: true,
            role: CONFIG.ROLE.USER
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.users = res.data.users;
            }
        });
    }

    getPets(): void {
        this.petService.getPets(
            {
                status: petConfig.statusKey.waiting
            }
        )
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.pets = res.data.pets;
            }
        });
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
        if (!this.formAdopt.valid) {
            this.formAdopt.markAllAsTouched();
            return;
        }
        let body = {
            provinceId: this.formAdopt.value.province, 
            districtId: this.formAdopt.value.district,
            wardId: this.formAdopt.value.ward,
            address: this.formAdopt.value.address.trim(),
            reason: this.formAdopt.value.reason.trim(),
            petId: this.formAdopt.value.petAdopt.id,
            registeredBy: this.formAdopt.value.registeredBy.id
        };
        this.adoptService.createAdopt(body)
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.formAdopt.reset();
                    this.result = true;
                    this.resultAction.emit(this.result); 
                }
            },
            error: (res) => {
                if (res.error) {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
                } else {
                    this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
                }
            }
        });
    }
    
}
