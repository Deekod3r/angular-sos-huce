import { Component, OnInit } from '@angular/core';
import { CONFIG } from 'src/app/common/config';
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
                    { label: 'Dashboard', icon: 'fa fa-fw fa-home', routerLink: ['/admin/trang-chu'] }
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
                                routerLink: ['/admin/thu-cung']
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
                                routerLink: ['/admin/ung-ho']
                            },
                            {
                                label: 'Chi tiêu',
                                icon: 'fa fa-fw fa-solid fa-dollar-sign',
                            }

                        ]
                    },
                    {
                        label: 'Blog',
                        icon: 'fa fa-fw fa-solid fa-blog',
                        items: [
                            { 
                                label: 'Tin tức', 
                                icon: 'fa fa-fw fa-solid fa-newspaper',
                                items: [
                                    {
                                        label: 'Danh sách',
                                        icon: 'fa fa-fw fa-list',
                                        routerLink: ['/admin/tin-tuc']
                                    },
                                    {
                                        label: 'Danh mục',
                                        icon: 'fa fa-solid fa-layer-group',
                                        routerLink: ['/admin/danh-muc-tin-tuc']
                                    }
                                ] 
                            },
                            { 
                                label: 'Sự kiện', 
                                icon: 'fa fa-fw fa-solid fa-calendar-check',
                                items: [
                                    {
                                        label: 'Danh sách',
                                        icon: 'fa fa-fw fa-list',
                                        routerLink: ['/admin/su-kien']
                                    },
                                    {
                                        label: 'Danh mục',
                                        icon: 'fa fa-solid fa-layer-group',
                                        routerLink: ['/admin/danh-muc-su-kien']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Người dùng', icon: 'fa fa-fw fa-solid fa-users',
                        items: [
                            {
                                label: 'Cộng đồng',
                                icon: 'fa fa-solid fa-users-viewfinder',
                                routerLink: ['/admin/nguoi-dung']
                            },
                            {
                                visible: CONFIG.ROLE.MANAGER.includes(this.authService.getRole()),
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
