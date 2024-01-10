import { Component, OnInit } from '@angular/core';
import { PrimeIcons, MenuItem } from 'primeng/api';
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
        icon: 'ti ti-home',
        routerLink: '/home'
      },
      {
        label: 'Tin tức',
        icon: 'ti ti-news',
        
      },
      {
        label: 'Phân tích đánh giá',
        icon: 'ti ti-chart-line',
        
      },
      {
        label: 'Giới thiệu',
        icon: 'ti ti-world-star',
      },
      {
        label: 'Hỗ trợ',
        icon: 'ti ti-help-circle',
      }
    ];

    this.userTools = [
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
        label: 'Đăng nhập', 
        icon: 'ti ti-circle-key-filled',
        command: () => { window.location.href = '/auth/login' } 
      },
      {
        separator: true
      },
      { 
        label: 'Đăng ký', 
        icon: 'ti ti-registered',
        command: () => { window.location.href = '/auth/register' } 
      },
      {
        separator: true
      },
      { 
        label: 'Đăng tin',
        icon: 'ti ti-wallpaper', 
        command: () => { window.location.href = '/auth/login' } 
      }
    ];

    this.isLoggedIn = localStorage.getItem(CONFIG.KEY.IS_LOGGED_IN) == this.encryptService.encrypt(CONFIG.KEY.IS_LOGGED_IN_VALUE);

    this.userInfo = JSON.parse(this.encryptService.decrypt(localStorage.getItem(CONFIG.KEY.TOKEN)) || '{}');
  }
}

