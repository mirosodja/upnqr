import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Upnqr',
        icon: 'pi pi-home',
        routerLink: ['']
      },
      {
        label: 'Pripravi UPN',
        icon: 'pi pi-book',
        routerLink: ['qr-upn']
      },
      {
        label: 'Help',
        icon: 'pi pi-question',
        routerLink: ['/help']
      }
    ];
  }
}
