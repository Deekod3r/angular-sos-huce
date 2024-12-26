import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedModule} from 'src/app/shared/shared.module';
import {FieldsetModule} from 'primeng/fieldset';
import {CardPetModule} from 'src/app/shared/components/card-pet/card-pet.module';
import {PetService} from 'src/app/services/pet.service';
import {DropdownModule} from 'primeng/dropdown';
import {Subject, takeUntil} from 'rxjs';
import {PaginatorModule} from 'primeng/paginator';
import {PET} from 'src/app/common/constant';
import {message, title} from 'src/app/common/message';
import {MessageService} from 'primeng/api';
import {filteredSearch} from 'src/app/shared/utils/data.util';

@Component({
    selector: 'app-adopt',
    standalone: true,
    imports: [SharedModule, FieldsetModule,
        CardPetModule, DropdownModule, PaginatorModule],
    templateUrl: './adopt-all.component.html',
    styleUrls: ['./adopt-all.component.css']
})
export class AdoptAllComponent implements OnInit, OnDestroy {

    pets: any[] = [];
    currentPage = 1;
    totalPages = 0;
    totalElements = 0;
    limit = PET.SEARCH.LIMIT_DEFAULT_CLIENT;
    first!: number;
    btnActive = null;
    key = {
        limit: this.limit,
        page: this.currentPage,
        code: '',
        name: '',
        status: '',
        type: '',
        gender: '',
        age: ''
    };
    private subscribes$: Subject<void> = new Subject<void>();

    constructor(public petService: PetService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.getPets();
    }

    ngOnDestroy(): void {
        this.subscribes$.next();
        this.subscribes$.complete();
    }

    getPets(): void {
        this.key.page = this.currentPage;
        let search = {
            limit: this.key.limit,
            page: this.key.page,
            code: this.key.code ? this.key.code.trim() : '',
            name: this.key.name ? this.key.name.trim() : '',
            status: this.key.status ? this.key.status : '',
            type: this.key.type ? this.key.type : '',
            age: this.key.age ? this.key.age : '',
            gender: this.key.gender ? this.key.gender : ''
        }
        this.petService.getPets(filteredSearch(search))
            .pipe(takeUntil(this.subscribes$))
            .subscribe({
                next: (res) => {
                    if (res.success) {
                        let data = res.data;
                        this.currentPage = data.currentPage;
                        this.first = (this.currentPage - 1) * this.limit;
                        this.totalPages = data.totalPages;
                        this.totalElements = data.totalElements;
                        this.pets = data.pets;
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

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.first = event.first;
        this.getPets();
    }

    onSearch(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getPets();
    }

    onRefresh(): void {
        this.currentPage = 1;
        this.first = 0;
        this.key = {
            limit: this.limit,
            page: this.currentPage,
            code: '',
            name: '',
            status: '',
            type: '',
            gender: '',
            age: ''
        };
        this.getPets();
        this.btnActive = null;
    }


    onChangeType(type: any): void {
        this.currentPage = 1;
        this.first = 0;
        this.key.type = type;
        this.getPets();
        this.btnActive = type;
    }

}
