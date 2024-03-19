import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { adoptConfig } from 'src/app/common/constant';
import { title, message } from 'src/app/common/message';
import { AdoptService } from 'src/app/services/adopt.service';
import { LocationService } from 'src/app/services/location.service';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-adoption-update',
    templateUrl: './adoption-update.component.html',
    styleUrls: ['./adoption-update.component.css']
})
export class AdoptionUpdateComponent implements OnInit {

    @Input() idAdoption!: string;
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;

    adopt!: any;
    pet!: any;
    formAdopt!: FormGroup;
    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    adoptStatus = adoptConfig.statusKey
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, public adoptService: AdoptService,    
        private locationService: LocationService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getAdopt();
        this.getProvinces();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getAdopt(): void {
        this.adoptService.getAdoptById(this.idAdoption)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                this.adopt = res.data.adopt;
                this.pet = res.data.pet;
                this.formAdopt = new FormGroup({
                    province: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, Validators.required),
                    district: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, Validators.required),
                    ward: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, Validators.required),
                    fee: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, [Validators.required, Validators.min(0)]),
                    address: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
                    reason: new FormControl({value: null, disabled: this.isNotAvailableForUpdate()}, [Validators.required, noWhitespaceValidator(), Validators.maxLength(255)]),
                });
                this.initForm();
                this.getDistricts();
                this.getWards();
            }
        });
    }

    initForm(): void {
        this.formAdopt.patchValue({
            province: this.adopt.provinceId,
            district: this.adopt.districtId,
            ward: this.adopt.wardId,
            address: this.adopt.address,
            fee: this.adopt.fee,
            reason: this.adopt.reason
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

    isNotAvailableForUpdate(): boolean {
        return this.adopt.status === adoptConfig.statusKey.cancel || this.adopt.status === adoptConfig.statusKey.complete 
        || this.adopt.status === adoptConfig.statusKey.reject;
    }

    onSaveAdopt(): void {
        if (!this.formAdopt.valid) {
            this.formAdopt.markAllAsTouched();
            return;
        }
        let body = {
            id: this.adopt.id,
            provinceId: this.formAdopt.value.province, 
            districtId: this.formAdopt.value.district,
            wardId: this.formAdopt.value.ward,
            address: this.formAdopt.value.address.trim(),
            reason: this.formAdopt.value.reason.trim(),
            fee: this.formAdopt.value.fee,
        };
        this.adoptService.updateAdopt(body, this.idAdoption)
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


