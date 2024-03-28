import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';
import { ImageModule } from 'primeng/image';
import { Subject, takeUntil } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { GalleriaService } from 'src/app/services/galleria.service';
import { title, message } from 'src/app/common/message';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-galleria',
    standalone: true,
    imports: [SharedModule, ConfirmDialogModule, AccordionModule, ImageModule, FileUploadModule, DialogModule],
    templateUrl: './galleria.component.html',
    styleUrls: ['./galleria.component.css']
})
export class GalleriaComponent implements OnInit, OnDestroy{

    activeIndex!: number;
    galleiras: any[] = [];
    visibleUpdateImageModal: boolean = false;
    visibleUpdateModal: boolean = false;
    visibleCreateModal: boolean = false;

    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public galleriaService: GalleriaService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getGallerias();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getGallerias(): void {
        this.galleriaService.getGallerias({})
        .pipe(takeUntil(this.subscribes$))
        .subscribe({
            next: (res) => {
                this.galleiras = res.data;
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

    showCreateModal(): void {
        this.visibleCreateModal = true;
    }

    showUpdateModal(): void {
        this.visibleUpdateModal = true;
    }

    showUpdateImageModal(): void {
        this.visibleUpdateImageModal = true;
    }

    upload(event: any): void {
        const image = event.files[0];
        // this.petService.updatePetImage(image, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
        //     next: (res: any) => {
        //         if (res.success) {
        //             this.visibleUpdateImageModal = false;
        //             this.result = true;
        //             this.resultAction.emit(this.result);        
        //         }
        //     },
        //     error: (res) => {
        //         if (res.error) {
        //             this.messageService.add({ severity: 'error', summary: title.error, detail: res.error.message });
        //         } else {
        //             this.messageService.add({ severity: 'error', summary: title.error, detail: message.error });
        //         }
        //     }
        // });
    }

}
