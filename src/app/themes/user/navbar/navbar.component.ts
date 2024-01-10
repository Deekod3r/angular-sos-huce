import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CONFIG } from 'src/app/common/config';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items!: MenuItem[];
  userTools!: MenuItem[];
  userInfo!: any;
  isLoggedIn: boolean = false;
  userOptions!: any[];


  constructor(private authService: AuthService, private encryptService: EncryptionService) { }

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
        
      },
      {
        label: 'Ủng hộ',
        icon: 'fa fa-hand-holding-heart',
        
      },
      {
        label: 'Tin tức',
        icon: 'fa fa-newspaper',
        
      },
      {
        label: 'Giới thiệu',
        icon: 'fa fa-bullhorn',
        
      },
      {
        label: 'Hỗ trợ',
        icon: 'fa fa-circle-question',
        
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
        icon: 'pi pi-power-off text-red-500',
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
      }
    ];

    this.isLoggedIn = localStorage.getItem(CONFIG.KEY.IS_LOGGED_IN) == this.encryptService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE);

    this.userInfo = JSON.parse(this.encryptService.decrypt(localStorage.getItem(CONFIG.KEY.TOKEN)) || '{}');

  }

  ngAfterViewInit() {
    const homeMenuItem = document.querySelector('.p-menuitem-link[href="/"]') as HTMLElement;
    if (homeMenuItem) {
      homeMenuItem.classList.add('bg-cyan-100', 'border-round');
    }
  }

  activeMenu(event:any) {
    let node = event.target;
    if (node.tagName === "LI" 
    || node.classList.contains("p-button-icon") || node.classList.contains("p-button")
    || node.classList.contains("p-avatar-icon") || node.classList.contains("p-avatar")) {
      return;
    } else {
      if (node.tagName === "A") {
        node;
      } else if (event.target.tagName === "SPAN") {
        node = node.parentNode;
      } else {
        return;
      }
      let menuitem = document.getElementsByClassName("p-menuitem-link");
      for (let i = 0; i < menuitem.length; i++) {
        menuitem[i].classList.remove("bg-cyan-100");
        menuitem[i].classList.remove("border-round");
      }
      node.classList.add("bg-cyan-100");
      node.classList.add("border-round");
    }
  }
}

