import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete/autocomplete.interface';
import { Subject, takeUntil } from 'rxjs';
import { petBreed, petColor, petType, petAge, petGender, petMoreInfor, petStatus, moreInfor } from 'src/app/common/constant';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';


@Component({
  selector: 'app-pet-create',
  templateUrl: './pet-create.component.html',
  providers: [MessageService],
  styleUrls: ['./pet-create.component.css']
})
export class PetCreateComponent implements OnInit {

  @Output() resultAction = new EventEmitter<boolean>();
  result: boolean = false;
  form!: FormGroup;
  types: any[] = [];
  age: any[] = [];
  gender: any[] = [];
  status: any[] = [];
  moreInfor: any[] = [];
  filteredBreeds: any[] = [];
  filteredColors: any[] = [];

  private subscribes$: Subject<void> = new Subject<void>();

  constructor(private petService: PetService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      petImage: new FormControl(null, Validators.required),
      petName: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
      petType: new FormControl(null, Validators.required),
      petBreed: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
      petColor: new FormControl(null, [Validators.required, noWhitespaceValidator()]),
      petAge: new FormControl(null, Validators.required),
      petGender: new FormControl(null, Validators.required),
      petWeight: new FormControl(0),
      petStatus: new FormControl(null, Validators.required),
      petVaccin: new FormControl(null),
      petRabies: new FormControl(null),
      petSterilization: new FormControl(null),
      petDiet: new FormControl(null),
      petToilet: new FormControl(null),
      petFriendlyToHuman: new FormControl(null),
      petFriendlyToCats: new FormControl(null),
      petFriendlyToDogs: new FormControl(null),
      petDescription: new FormControl('', [Validators.maxLength(1000), Validators.required, noWhitespaceValidator()]),
      petNote: new FormControl('', Validators.maxLength(500)),
    });
    this.types = petType;
    this.age = petAge;
    this.gender = petGender;
    this.moreInfor = petMoreInfor;
    this.status = petStatus;
  }

  ngOnDestroy(): void {
    this.subscribes$.next();
    this.subscribes$.complete();
  }

  filterBreed(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.trim();

    for (let i = 0; i < (petBreed as any[]).length; i++) {
      let breed = (petBreed as any[])[i];
      if (breed && breed.label && breed.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        filtered.push(breed);
      }
    }
    this.filteredBreeds = filtered;
  }

  filterColor(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query.trim();

    for (let i = 0; i < (petColor as any[]).length; i++) {
      let color = (petColor as any[])[i];
      if (color && color.label && color.label.toLowerCase().indexOf(query.toLowerCase()) != -1) {
        filtered.push(color);
      }
    }
    this.filteredColors = filtered;
  }

  onImagePicked(event: any) {
    if (event && event.files && event.files.length > 0) {
      this.form.controls['petImage'].markAsDirty();
      const file = event.files[0];
      this.form.patchValue({ petImage: file });
    }
  }
  
  onSavePet() {
    this.petService.createPet(this.form.value).pipe(takeUntil(this.subscribes$)).subscribe({
      next: (res) => {
        if (res) {
          this.form.reset();
          this.result = true;
          this.resultAction.emit(this.result);    
        }
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi. Vui lòng thử lại sau'});
      }
    });
  }

  removePetImage() {
    this.form.patchValue({ petImage: null });
  }
  
}
