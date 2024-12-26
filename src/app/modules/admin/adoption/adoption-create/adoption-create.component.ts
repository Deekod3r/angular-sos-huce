import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Subject, takeUntil} from 'rxjs';
import {message, title} from 'src/app/common/message';
import {AdoptService} from 'src/app/services/adopt.service';
import {LocationService} from 'src/app/services/location.service';
import {PetService} from 'src/app/services/pet.service';
import {noWhitespaceValidator} from 'src/app/shared/utils/string.util';

@Component({
    selector: 'app-adoption-create',
    templateUrl: './adoption-create.component.html',
    styleUrls: ['./adoption-create.component.css']
})
export class AdoptionCreateComponent implements OnInit, OnDestroy {

    @Input() pets: any[] = [];
    @Input() users: any[] = [];
    @Output() resultAction = new EventEmitter<boolean>();
    result: boolean = false;

    formAdopt!: FormGroup;
    provinces: any[] = [];
    districts: any[] = [];
    wards: any[] = [];

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private adoptService: AdoptService,
                private locationService: LocationService, private messageService: MessageService) {
    }

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
        this.getProvinces();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
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

    onSaveAdopt(): void {
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
                        this.messageService.add({severity: 'error', summary: title.error, detail: res.error.message});
                    } else {
                        this.messageService.add({severity: 'error', summary: title.error, detail: message.error});
                    }
                }
            });
    }

}
