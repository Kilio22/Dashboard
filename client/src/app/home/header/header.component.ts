import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { DashboardService } from '../../shared/services/dashboard.service';
import { User } from '../../shared/interfaces/user';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
    userInfo: User = {
        displayName: '',
        email: ''
    };
    userMenu: NbMenuItem[] = [
        {
            title: this.userInfo.email,
            group: true
        },
        {
            title: 'Log out',
            icon: 'log-out-outline',
            url: '/api/auth/logout'
        } ];

    constructor(private sidebarService: NbSidebarService, private dashboardService: DashboardService) {
    }

    ngOnInit(): void {
        this.dashboardService.getUserProfile().subscribe(res => {
            this.userMenu[0].title = res.body.email;
            this.userInfo = res.body;
        });
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle();
        return false;
    }

}
