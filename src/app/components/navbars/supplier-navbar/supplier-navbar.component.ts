import { Component } from '@angular/core';

@Component({
  selector: 'app-supplier-navbar',
  templateUrl: './supplier-navbar.component.html',
  styleUrls: ['./supplier-navbar.component.scss'],
})
export class SupplierNavbarComponent {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
