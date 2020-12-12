import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { User } from '../shared/interfaces/user';
import { DashboardService } from '../shared/services/dashboard.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Id } from '../shared/interfaces/id';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: [ './users.component.scss' ]
})
export class UsersComponent implements OnInit {

    faTrash = faTrash;
    items: NbMenuItem[] = [
        {
            title: 'Home',
            icon: 'home-outline',
            link: '/home',
            home: true
        },
        {
            title: 'Users',
            icon: 'people-outline',
            link: '/users',
            home: false
        }
    ];
    users: (User & Id)[] = [];
    isLoading = true;
    errorMessage = null;

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit(): void {
        this.dashboardService.getUsers().subscribe(users => {
                this.users = users;
                this.isLoading = false;
            },
            error => {
                this.errorMessage = 'Something went wrong.';
                this.isLoading = false;
            });
    }

    onDeleteClick(id: string): void {
        this.isLoading = true;
        this.dashboardService.deleteUser(id).subscribe((users) => {
            this.isLoading = false;
            this.users = users;
        }, error => {
            this.errorMessage = 'Something went wrong.';
            this.isLoading = false;
        });
    }

}
