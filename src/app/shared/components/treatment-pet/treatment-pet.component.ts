import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { title, message } from 'src/app/common/message';
import { TreatmentService } from 'src/app/services/treatment.service';

@Component({
    selector: 'app-treatment-pet',
    templateUrl: './treatment-pet.component.html',
    styleUrls: ['./treatment-pet.component.css']
})
export class TreatmentPetComponent implements OnInit, OnDestroy {

    @Input() idPet: any;
    @Input() status = '';
    @Input() visiblePrice = false;
    treatments!: any;
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public treatmentService: TreatmentService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getTreatments();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['idPet'] && !changes['idPet'].firstChange) {
            this.getTreatments();
        }
    }    

    getTreatments(): void {
        this.treatmentService.getTreatments({
            fullData: true,
            petId: this.idPet, 
            status: this.status
        })
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                if (res.success) {
                    this.treatments = res.data.treatments;
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
