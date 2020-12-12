import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
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

    constructor() {
    }

    ngOnInit(): void {
    }
}
