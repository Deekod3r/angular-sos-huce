import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public static isVisible: boolean = false;

  constructor() { }

  public show(): void {
    HeaderService.isVisible = true;
  }

  public hide(): void {
    HeaderService.isVisible = false;
  }

  public toggle(): void {
    HeaderService.isVisible = !HeaderService.isVisible;
  }

  public isVisible(): boolean {
    return HeaderService.isVisible;
  }

}
