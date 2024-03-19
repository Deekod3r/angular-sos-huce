import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsetModule } from 'primeng/fieldset';
import { CardPetModule } from 'src/app/shared/components/card-pet/card-pet.module';
import { PetService } from 'src/app/services/pet.service';
import { DropdownModule } from 'primeng/dropdown';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { petConfig } from 'src/app/common/constant';

@Component({
    selector: 'app-adopt',
    standalone: true,
    imports: [SharedModule, FieldsetModule, 
        CardPetModule, DropdownModule, PaginatorModule],
    templateUrl: './adopt-all.component.html',
    styleUrls: ['./adopt-all.component.css']
})
export class AdoptAllComponent implements OnInit {

    pets: any[] = [];
    currentPage = 1;
    totalPages = 0;
    totalRecords = 0;
    limit = petConfig.search.limitDefaultClient;
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

    constructor(public petService: PetService) { }

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
        this.petService.getPets(search)
        .pipe(takeUntil(this.subscribes$))
        .subscribe(res => {
            if (res.success) {
                let data = res.data;
                this.currentPage = data.page;
                this.first = (this.currentPage - 1) * this.limit;
                this.totalPages = data.totalPages;
                this.totalRecords = data.total;
                this.pets = data.pets;
            }
        });
    }

    onPageChange(event: any): void {
        this.currentPage = event.page + 1;
        this.first = event.first;
        this.getPets();
    }

    search(): void {
        this.currentPage = 1;
        this.first = 0;
        this.getPets();
    }

    refresh(): void {
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


    setType(type: any): void {
        this.key.type = type;
        this.getPets();
        this.btnActive = type;
    }

}
