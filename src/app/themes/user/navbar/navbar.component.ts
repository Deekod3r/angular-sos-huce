import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items!: MenuItem[];
  userTools!: MenuItem[];
  userInfo!: any;
  userOptions!: any[];
  currentRoute: string = '/';


  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Trang chủ',
        icon: 'fa fa-house',
        routerLink: '/',

      },
      {
        label: 'Nhận nuôi',
        icon: 'fa fa-paw',
        routerLink: '/adopt'

      },
      {
        label: 'Ủng hộ',
        icon: 'fa fa-hand-holding-heart',
        routerLink: '/donate'
      },
      {
        label: 'Tin tức',
        icon: 'fa fa-newspaper',
        routerLink: '/blog'
      },
      {
        label: 'Giới thiệu',
        icon: 'fa fa-bullhorn',
        routerLink: '/intro'
      },
      {
        label: 'Hỗ trợ',
        icon: 'fa fa-circle-question',
        routerLink: '/support'
      }
    ];

    this.userTools = [
      {
        visible: false
      },
      {
        label: 'Tài khoản',
        icon: 'ti ti-user-shield'
      },
      {
        separator: true
      },
      {
        label: 'Đổi mật khẩu',
        icon: 'ti ti-password',
      },
      {
        separator: true
      },
      {
        label: 'Đăng xuất',
        icon: 'fa fa-power-off text-red-500',
        command: () => {
          this.authService.logout();
          window.location.reload();
        }
      }
    ];

    this.userOptions = [
      {
        visible: false
      },
      {
        label: 'Đăng nhập',
        icon: 'fa-brands fa-keycdn',
        command: () => { window.location.href = '/auth/login' }
      },
      {
        separator: true
      },
      {
        label: 'Đăng ký',
        icon: 'fa-solid fa-registered',
        command: () => { window.location.href = '/auth/register' }
      },
      {
        separator: true
      },
      {
        label: 'Nhận nuôi',
        icon: 'fa-solid fa-heart-circle-plus',
        command: () => { window.location.href = '/auth/login' }
      },
      {
        separator: true
      },
      {
        label: 'Ủng hộ',
        icon: 'fa-solid fa-clover',
        command: () => { window.location.href = '/auth/login' }
      }
    ];

    this.userInfo = this.authService.getProfile();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.routerState.snapshot.url;
        this.activeMenu(this.currentRoute);
      }
    });

  }

  ngAfterViewInit() {
    this.activeMenu(this.router.url);
  }

  activeMenu(href: string) {
    if (href != '/') {
      if (href.startsWith('/adopt')) {
        href = '/adopt';
      }
      if (href.startsWith('/donate')) {
        href = '/donate';
      }
      if (href.startsWith('/blog')) {
        href = '/blog';
      }
      if (href.startsWith('/intro')) {
        href = '/intro';
      }
      if (href.startsWith('/support')) {
        href = '/support';
      }
    }
    let menuitem = document.getElementsByClassName("p-menuitem-link");
    for (let i = 0; i < menuitem.length; i++) {
      menuitem[i].classList.remove("bg-cyan-100");
      menuitem[i].classList.remove("border-round");
    }
    this.setActiveMenu(href);
  }

  setActiveMenu(href: string) {
    const menuItem = document.querySelector('.p-menuitem-link[href="' + href + '"]') as HTMLElement;
    if (menuItem) {
      menuItem.classList.add('bg-cyan-100', 'border-round');
    }
  }
}

