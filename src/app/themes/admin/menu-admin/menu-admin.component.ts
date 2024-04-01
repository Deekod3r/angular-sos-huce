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
                    { 
                        label: 'Dashboard', 
                        icon: 'fa fa-fw fa-home', 
                        routerLink: ['/admin/trang-chu'] 
                    }
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
                                icon: 'fa fa-list',
                                routerLink: ['/admin/thu-cung']
                            },
                            {
                                label: 'Đơn nhận nuôi',
                                icon: 'fa fa-fw fa-brands fa-wpforms',
                                routerLink: ['/admin/don-nhan-nuoi']
                            },
                            {
                                label: 'Kiểm tra sau nhận nuôi',
                                icon: 'fa fa-check-to-slot',
                                routerLink: ['/admin/kiem-tra-sau-nhan-nuoi']
                            }
                        ]
                    },
                    {
                        label: 'Ủng hộ', 
                        icon: 'fa fa-fw fa-solid fa-hand-holding-heart',
                        items: [
                            {
                                label: 'Danh sách',
                                icon: 'fa fa-fw fa-list',
                                routerLink: ['/admin/ung-ho']
                            },
                            {
                                label: 'Chi tiêu',
                                icon: 'fa fa-solid fa-circle-dollar-to-slot',
                                routerLink: ['/admin/chi-tieu'],
                            },
                            {
                                label: 'Tài khoản',
                                icon: 'fa fa-bank',
                                routerLink: ['/admin/tai-khoan-ung-ho'],
                                // visible: CONFIG.ROLE.MANAGER.includes(this.authService.getRole())
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
                        label: 'Người dùng', 
                        icon: 'fa fa-fw fa-solid fa-users',
                        items: [
                            {
                                label: 'Cộng đồng',
                                icon: 'fa fa-solid fa-users-viewfinder',
                                routerLink: ['/admin/nguoi-dung']
                            },
                            {
                                label: 'Quản trị viên',
                                icon: 'fa fa-fw fa-solid fa-user-shield',
                                routerLink: ['/admin/quan-tri-vien'],
                                visible: CONFIG.ROLE.MANAGER.includes(this.authService.getRole())
                            }
                        ]
                    },
                ]
            },
            {
                label: 'Cấu hình',
                items: [
                    { 
                        label: 'Galleria', 
                        icon: 'fa fa-fw fa-solid fa-photo-film',
                        routerLink: ['/admin/galleria']
                    },
                    { 
                        label: 'Thông tin web', 
                        icon: 'fa fa-fw fa-solid fa-circle-info', 
                        routerLink: ['/admin/cau-hinh'],
                        visible: CONFIG.ROLE.MANAGER.includes(this.authService.getRole())
                    },
                ]
            },
            {
                label: 'Tài khoản',
                items: [
                    { 
                        label: 'Đổi mật khẩu', 
                        icon: 'fa fa-fw fa-lock',
                        routerLink: ['/admin/doi-mat-khau'],
                        visible: CONFIG.ROLE.MANAGER.includes(this.authService.getRole())
                    },
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
