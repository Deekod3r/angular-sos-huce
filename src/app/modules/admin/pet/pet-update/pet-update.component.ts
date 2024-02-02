import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { petType, petAge, petGender, petMoreInfor, petStatus, petBreed, petColor } from 'src/app/common/constant';
import { message, messagePet, title } from 'src/app/common/message';
import { PetService } from 'src/app/services/pet.service';
import { noWhitespaceValidator } from 'src/app/shared/utils/string.util';

@Component({
  selector: 'app-pet-update',
  templateUrl: './pet-update.component.html',
  providers: [MessageService],
  styleUrls: ['./pet-update.component.css']
})
export class PetUpdateComponent {

  @Input() idPet!: string;
  @Output() resultAction = new EventEmitter<boolean>();

  visibleUpdateImageModal: boolean = false;
  pet!: any;
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
    this.getPet();
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

  getPet() {
    this.petService.getPetById(this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
      next: (res) => {
        if (res) {
          this.pet = res;
          this.initForm();
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  initForm() {
    this.form.patchValue({
      petName: this.pet.name,
      petType: this.pet.type,
      petBreed: {
        label: this.pet.breed
      },
      petColor: {
        label: this.pet.color
      },
      petAge: this.pet.age,
      petGender: this.pet.gender,
      petWeight: this.pet.weight,
      petStatus: this.pet.status,
      petVaccin: this.pet.vaccin,
      petRabies: this.pet.rabies,
      petSterilization: this.pet.sterilization,
      petDiet: this.pet.diet,
      petToilet: this.pet.toilet,
      petFriendlyToHuman: this.pet.friendlyToHuman,
      petFriendlyToCats: this.pet.friendlyToCats,
      petFriendlyToDogs: this.pet.friendlyToDogs,
      petDescription: this.pet.description,
      petNote: this.pet.note,
    });
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
  
  onSavePet() {
    this.petService.updatePet(this.form.value, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
      next: (res) => {
        if (res) {
          this.form.reset();
          this.result = true;
          this.resultAction.emit(this.result);    
        }
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({severity:'error', summary: title.error, detail: message.error});
      }
    });
  }
  
  showUpdateImageModal() {
    this.visibleUpdateImageModal = true;
  }

  upload(event: any) {
    const image = event.files[0];
    this.petService.updatePetImage(image, this.idPet).pipe(takeUntil(this.subscribes$)).subscribe({
      next: (res: any) => {
        if (res) {
          this.visibleUpdateImageModal = false;
          this.getPet();
          this.messageService.add({severity:'success', summary: title.success, detail: messagePet.updateImageSuccess});
        } else {
          this.messageService.add({severity:'error', summary: title.error, detail: message.error});
        }
      },
      error: (error: any) => {
        console.log(error);
        this.messageService.add({severity:'error', summary: title.error, detail: message.error});
      }
    });
  }
  
}
