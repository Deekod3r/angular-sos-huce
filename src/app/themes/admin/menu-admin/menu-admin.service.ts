import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MenuChangeEvent} from '../config/menu-change-event';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    menuSource$ = this.menuSource.asObservable();
    private resetSource = new Subject();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }
}
