import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {

    config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-teal',
        scale: 14,
    };

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    };

    private configUpdate = new Subject<AppConfig>();
    configUpdate$ = this.configUpdate.asObservable();
    private overlayOpen = new Subject<any>();
    overlayOpen$ = this.overlayOpen.asObservable();

    onMenuToggle(): void {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
        } else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showProfileSidebar(): void {
        this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
        if (this.state.profileSidebarVisible) {
            this.overlayOpen.next(null);
        }
    }

    showConfigSidebar(): void {
        this.state.configSidebarVisible = true;
    }

    isOverlay(): boolean {
        return this.config.menuMode === 'overlay';
    }

    isDesktop(): boolean {
        return window.innerWidth > 991;
    }

    isMobile(): boolean {
        return !this.isDesktop();
    }

    onConfigUpdate(): void {
        this.configUpdate.next(this.config);
    }

}
