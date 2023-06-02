import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-supplier-navbar',
  templateUrl: './supplier-navbar.component.html',
  styleUrls: ['./supplier-navbar.component.scss'],
})
export class SupplierNavbarComponent implements OnInit{
  navbarOpen = false;
  @ViewChild('dialog') myDialog: ElementRef | undefined;
  openDialog: boolean = false
  reloadDetailProduct = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  open() {
    this.openDialog = true
  }
  close() {

    this.openDialog = false
    this.myDialog?.nativeElement.close();
  }
}
