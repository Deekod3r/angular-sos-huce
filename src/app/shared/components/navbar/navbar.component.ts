import { Component, OnInit } from '@angular/core';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items!: MenuItem[];
  itemsPerson!: MenuItem[];
  studentInfo!: any;
  isLoggedIn: boolean = false;
  userOptions!: any[];


  constructor(public headerService: HeaderService, private authService: AuthService) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Việc làm',
        icon: PrimeIcons.BRIEFCASE,
        items: [
          {
            label: 'Mới nhất',
            // icon: PrimeIcons.MEGAPHONE
          },
          {
            separator: true
          },
          {
            label: 'Chuyên ngành',
            // icon: PrimeIcons.PLUS,
            items: [
              {
                label: 'Xây dựng dân dụng',
                // icon: PrimeIcons.BOOKMARK_FILL
              },
              {
                separator: true
              },
              {
                label: 'Công nghệ thông tin',
                // icon: PrimeIcons.BOOKMARK_FILL
              }
            ]
          }
        ]
      },
      {
        label: 'Hồ sơ & CV',
        icon: PrimeIcons.ID_CARD,
        items: [
          {
            label: 'Mẫu CV',
            // icon: PrimeIcons.PALETTE
          },
          {
            separator: true
          },
          {
            label: 'Tư vấn CV',
            // icon: PrimeIcons.PHONE
          },
          {
            separator: true
          },
          {
            label: 'CV cá nhân',
            // icon: PrimeIcons.USER
          }
        ]
      },
      {
        label: 'Công ty',
        icon: PrimeIcons.BUILDING,
        items: [
          {
            label: 'Danh sách công ty',
            // icon: PrimeIcons.BARS
          },
          {
            separator: true
          },
          {
            label: 'Top công ty',
            // icon: PrimeIcons.STAR
          }
        ]
      },
      {
        label: 'Công cụ',
        icon: PrimeIcons.WRENCH,
        items: [
          {
            label: 'Tính thuế TNCN',
            // icon: PrimeIcons.DOLLAR
          },
          {
            separator: true
          },
          {
            label: 'Tính lãi',
            // icon: PrimeIcons.MONEY_BILL
          },
          {
            separator: true
          },
          {
            label: 'Test DISC',
            // icon: PrimeIcons.CHECK_SQUARE
          },
        ]
      }
    ];

    this.itemsPerson = [
      {
        label: 'Tài khoản',
        // icon: 'pi pi-fw pi-file'
      },
      {
        separator: true
      },
      {
        label: 'CV đã nộp',
        // icon: 'pi pi-fw pi-user',
      },
      {
        separator: true
      },
      {
        label: 'Đăng xuất',
        icon: PrimeIcons.POWER_OFF,
        command: () => {
          this.authService.logout();
          window.location.reload();
        }
      }
    ];

    this.userOptions = [
      { label: 'Đăng nhập', command: () => { window.location.href = '/login' } },
      { label: 'Đăng ký', command: () => { window.location.href = '/register' } }
    ];

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    this.studentInfo = JSON.parse(localStorage.getItem('studentInfo') || '{}');
  }
}

