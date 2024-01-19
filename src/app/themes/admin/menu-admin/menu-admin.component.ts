import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
    selector: 'app-menu-admin',
    templateUrl: './menu-admin.component.html',
    styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Trang chủ',
                items: [
                    { label: 'Dashboard', icon: 'fa fa-fw fa-home', routerLink: ['/admin/dashboard'] }
                ]
            },
            {
                label: 'Quản lý',
                items: [
                    {
                        label: 'Thú cưng',
                        icon: 'fa fa-fw fa-paw',
                        items: [
                            {
                                label: 'Danh sách',
                                icon: 'fa fa-fw fa-list',
                                routerLink: ['/admin/pets']
                            },
                            {
                                label: 'Đơn nhận nuôi',
                                icon: 'fa fa-fw fa-brands fa-wpforms',
                            }
                        ]
                    },
                    {
                        label: 'Ủng hộ', icon: 'fa fa-fw fa-solid fa-hand-holding-heart',
                        items: [
                            {
                                label: 'Danh sách',
                                icon: 'fa fa-fw fa-list',
                                routerLink: ['/admin/donates']
                            },
                            {
                                label: 'Chi tiêu',
                                icon: 'fa fa-fw fa-solid fa-dollar-sign',
                            }

                        ]
                    },
                    { label: 'Tin tức', icon: 'fa fa-fw fa-solid fa-newspaper' },
                    { label: 'Sự kiện', icon: 'fa fa-fw fa-solid fa-calendar-check' },
                    {
                        label: 'Người dùng', icon: 'fa fa-fw fa-solid fa-users',
                        items: [
                            {
                                label: 'Cộng đồng',
                                icon: 'fa fa-fw fa-list',
                                routerLink: ['/admin/users']
                            },
                            {
                                label: 'Quản trị viên',
                                icon: 'fa fa-fw fa-solid fa-user-shield',
                            }
                        ]
                    },
                ]
            },
            {
                label: 'Cấu hình',
                items: [
                    { label: 'Thông tin web', icon: 'fa fa-fw fa-solid fa-circle-info', badge: 'NEW' },
                    { label: 'Galleria', icon: 'fa fa-fw fa-solid fa-photo-film' },
                ]
            },
            {
                label: 'Tài khoản',
                items: [
                    {
                        label: 'Đăng xuất', 
                        icon: 'fa-solid fa-right-from-bracket text-red-600', 
                        command: () => {
                            this.authService.logout();
                            window.location.reload();
                        }
                    }
                ]
            }
        ];
    }
}
