import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { menu } from '../Menu';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  menuList: any = [];
  filteredMenu: any = [];
  role!: string;
  isRouteVisible: boolean = false;
  constructor(private router: Router) {
    debugger;
    this.menuList = menu;
    this.role = JSON.parse(JSON.stringify(localStorage.getItem('UserRoles')));
    this.menuList.forEach((element: any) => {
      const isInRole = element.roles.find((x: any) => x === this.role);
      if (isInRole != undefined) {
        this.filteredMenu.push(element);
      }
    });
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isRouteVisible =
          event.urlAfterRedirects === '/Home' ||
          event.urlAfterRedirects === '/home';
      });
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
