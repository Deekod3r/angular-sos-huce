import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-pet-create',
  standalone: true,
  imports: [SharedModule, FileUploadModule, DialogModule],
  templateUrl: './pet-create.component.html',
  styleUrls: ['./pet-create.component.css']
})
export class PetCreateComponent {

  @Output() resultAction = new EventEmitter<boolean>();
  result: boolean = false;
  form!: FormGroup;
  visibleImageModal: boolean = false;

  constructor() { }

  showImageModal(): void {
    this.visibleImageModal = true;
  }
  
}
